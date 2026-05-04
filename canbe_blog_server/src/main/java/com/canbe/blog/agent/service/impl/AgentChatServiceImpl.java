package com.canbe.blog.agent.service.impl;

import com.canbe.blog.agent.dto.AgentChatRequestDTO;
import com.canbe.blog.agent.entity.Agent;
import com.canbe.blog.agent.entity.AgentCallRecord;
import com.canbe.blog.agent.mapper.AgentCallRecordMapper;
import com.canbe.blog.agent.mapper.AgentMapper;
import com.canbe.blog.agent.service.AgentChatService;
import com.canbe.blog.agent.vo.AgentChatVO;
import com.canbe.blog.common.BusinessException;
import com.canbe.blog.quota.service.UserAgentQuotaService;
import com.canbe.blog.security.AuthenticatedUser;
import com.canbe.blog.security.CurrentUserContext;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class AgentChatServiceImpl implements AgentChatService {

    private static final Logger log = LoggerFactory.getLogger(AgentChatServiceImpl.class);
    private static final int ENABLED_STATUS = 1;
    private static final String PROVIDER_DIFY = "DIFY";
    private static final String FALLBACK_ANSWER = "我暂时没有找到可以直接回答这个问题的资料。\n\n你可以换个关键词再问一次，或者告诉我更具体的场景，我再帮你查。";
    private static final String[] FALLBACK_SUGGESTED_QUESTIONS = {
        "收货地址怎么改？",
        "怎么开发票？",
        "商品降价可以价保吗？"
    };

    private final AgentMapper agentMapper;
    private final AgentCallRecordMapper agentCallRecordMapper;
    private final UserAgentQuotaService userAgentQuotaService;
    private final ObjectMapper objectMapper;
    private final HttpClient httpClient;

    public AgentChatServiceImpl(
        AgentMapper agentMapper,
        AgentCallRecordMapper agentCallRecordMapper,
        UserAgentQuotaService userAgentQuotaService,
        ObjectMapper objectMapper
    ) {
        this.agentMapper = agentMapper;
        this.agentCallRecordMapper = agentCallRecordMapper;
        this.userAgentQuotaService = userAgentQuotaService;
        this.objectMapper = objectMapper;
        this.httpClient = HttpClient.newBuilder()
            .version(HttpClient.Version.HTTP_1_1)
            .connectTimeout(Duration.ofSeconds(5))
            .build();
    }

    @Override
    public AgentChatVO chat(Long agentId, AgentChatRequestDTO requestDTO) {
        AuthenticatedUser currentUser = CurrentUserContext.getRequired();
        Agent agent = agentMapper.findById(agentId)
            .orElseThrow(() -> new BusinessException(4001, "Agent不存在"));
        if (agent.getStatus() == null || agent.getStatus() != ENABLED_STATUS) {
            throw new BusinessException(4001, "Agent不存在");
        }
        normalize(requestDTO);
        validateProviderConfig(agent);
        userAgentQuotaService.checkAvailable(currentUser.getAccountId(), agent.getId());

        long start = System.nanoTime();
        try {
            HttpRequest request = buildAgentRequest(agent, requestDTO, currentUser);
            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString(StandardCharsets.UTF_8));
            long durationMs = Duration.ofNanos(System.nanoTime() - start).toMillis();
            if (response.statusCode() < 200 || response.statusCode() >= 300) {
                recordFailure(currentUser, agent, requestDTO.getQuery(), "FAILED", "PROVIDER_ERROR", "Agent服务返回异常", durationMs);
                throw new BusinessException(4004, "Agent服务返回异常");
            }
            AgentChatVO chatVO = parseAgentResponse(agent, requestDTO, response.body());
            normalizeAgentAnswer(chatVO);
            chatVO.setSessionId(trimToDefault(chatVO.getSessionId(), requestDTO.getSessionId()));
            chatVO.setQuotaUsed(1);
            int consumed = userAgentQuotaService.consumeOne(currentUser.getAccountId(), agent.getId());
            if (consumed == 0) {
                recordFailure(currentUser, agent, requestDTO.getQuery(), "FAILED", "QUOTA_NOT_ENOUGH", "Agent体验次数不足", durationMs);
                throw new BusinessException(5004, "Agent体验次数不足");
            }
            recordSuccess(currentUser, agent, requestDTO.getQuery(), chatVO.getAnswer(), durationMs);
            return chatVO;
        } catch (BusinessException exception) {
            throw exception;
        } catch (IllegalArgumentException exception) {
            long durationMs = Duration.ofNanos(System.nanoTime() - start).toMillis();
            recordFailure(currentUser, agent, requestDTO.getQuery(), "FAILED", "INVALID_PROVIDER_CONFIG", "Agent服务配置不合法", durationMs);
            throw new BusinessException(4005, "Agent服务配置不合法");
        } catch (java.net.http.HttpTimeoutException exception) {
            long durationMs = Duration.ofNanos(System.nanoTime() - start).toMillis();
            recordFailure(currentUser, agent, requestDTO.getQuery(), "TIMEOUT", "AGENT_TIMEOUT", "Agent响应超时", durationMs);
            log.warn("Agent provider timeout, userId={}, agentId={}, sessionId={}", currentUser.getAccountId(), agent.getId(), requestDTO.getSessionId(), exception);
            throw new BusinessException(4006, "Agent响应超时");
        } catch (InterruptedException exception) {
            Thread.currentThread().interrupt();
            long durationMs = Duration.ofNanos(System.nanoTime() - start).toMillis();
            recordFailure(currentUser, agent, requestDTO.getQuery(), "INTERRUPTED", "REQUEST_INTERRUPTED", "Agent调用被中断", durationMs);
            throw new BusinessException(4007, "Agent调用被中断");
        } catch (Exception exception) {
            long durationMs = Duration.ofNanos(System.nanoTime() - start).toMillis();
            recordFailure(currentUser, agent, requestDTO.getQuery(), "FAILED", "NETWORK_ERROR", "Agent调用失败", durationMs);
            log.warn("Agent provider call failed, userId={}, agentId={}, sessionId={}", currentUser.getAccountId(), agent.getId(), requestDTO.getSessionId(), exception);
            throw new BusinessException(4008, "Agent调用失败");
        }
    }

    private void validateProviderConfig(Agent agent) {
        if (PROVIDER_DIFY.equals(providerType(agent))) {
            if (trim(agent.getApiUrl()).isEmpty()) {
                throw new BusinessException(4005, "Dify API地址未配置");
            }
            if (trim(agent.getApiKey()).isEmpty()) {
                throw new BusinessException(4005, "Dify API Key未配置");
            }
            return;
        }
        if (trim(agent.getRuntimeUrl()).isEmpty()) {
            throw new BusinessException(4005, "Agent Runtime地址未配置");
        }
    }

    private HttpRequest buildAgentRequest(Agent agent, AgentChatRequestDTO requestDTO, AuthenticatedUser currentUser) throws Exception {
        if (PROVIDER_DIFY.equals(providerType(agent))) {
            ObjectNode body = objectMapper.createObjectNode();
            body.set("inputs", objectMapper.createObjectNode());
            body.put("query", requestDTO.getQuery());
            body.put("response_mode", trimToDefault(agent.getResponseMode(), "blocking"));
            body.put("conversation_id", "");
            body.put("user", "account_" + currentUser.getAccountId());
            return HttpRequest.newBuilder()
                .uri(URI.create(agent.getApiUrl()))
                .timeout(Duration.ofSeconds(60))
                .header("Content-Type", "application/json")
                .header("Authorization", "Bearer " + trim(agent.getApiKey()))
                .POST(HttpRequest.BodyPublishers.ofString(objectMapper.writeValueAsString(body), StandardCharsets.UTF_8))
                .build();
        }
        String requestBody = objectMapper.writeValueAsString(requestDTO);
        return HttpRequest.newBuilder()
            .uri(URI.create(agent.getRuntimeUrl()))
            .timeout(Duration.ofSeconds(30))
            .header("Content-Type", "application/json")
            .POST(HttpRequest.BodyPublishers.ofString(requestBody, StandardCharsets.UTF_8))
            .build();
    }

    private AgentChatVO parseAgentResponse(Agent agent, AgentChatRequestDTO requestDTO, String responseBody) throws Exception {
        if (!PROVIDER_DIFY.equals(providerType(agent))) {
            return objectMapper.readValue(responseBody, AgentChatVO.class);
        }
        JsonNode root = objectMapper.readTree(responseBody);
        AgentChatVO vo = new AgentChatVO();
        vo.setSessionId(text(root, "conversation_id", requestDTO.getSessionId()));
        vo.setAnswer(text(root, "answer", ""));
        vo.setTraceId(text(root, "message_id", text(root, "task_id", "")));
        vo.setFallback(false);
        JsonNode metadata = root.get("metadata");
        if (metadata != null && metadata.has("retriever_resources")) {
            vo.setSources(metadata.get("retriever_resources"));
        }
        if (root.has("suggested_questions")) {
            vo.setSuggestedQuestions(root.get("suggested_questions"));
        }
        return vo;
    }

    private void normalizeAgentAnswer(AgentChatVO chatVO) {
        String answer = trim(chatVO.getAnswer());
        if (answer.isEmpty() || Boolean.TRUE.equals(chatVO.getFallback()) || isTechnicalNoHitAnswer(answer)) {
            chatVO.setAnswer(FALLBACK_ANSWER);
            chatVO.setFallback(true);
            chatVO.setSources(objectMapper.createArrayNode());
            if (!hasSuggestedQuestions(chatVO.getSuggestedQuestions())) {
                chatVO.setSuggestedQuestions(fallbackSuggestedQuestions(chatVO));
            }
            return;
        }
        chatVO.setAnswer(answer);
        if (chatVO.getFallback() == null) {
            chatVO.setFallback(false);
        }
    }

    private boolean isTechnicalNoHitAnswer(String answer) {
        return answer.contains("暂未找到")
            && (answer.contains("高度相关") || answer.contains("公开 FAQ") || answer.contains("FAQ"));
    }

    private boolean hasSuggestedQuestions(JsonNode suggestedQuestions) {
        return suggestedQuestions != null && suggestedQuestions.isArray() && !suggestedQuestions.isEmpty();
    }

    private ArrayNode fallbackSuggestedQuestions(AgentChatVO chatVO) {
        ArrayNode candidateQuestions = candidateSuggestedQuestions(chatVO.getSuggestedQuestionCandidates());
        return candidateQuestions.isEmpty() ? defaultFallbackSuggestedQuestions() : candidateQuestions;
    }

    private ArrayNode candidateSuggestedQuestions(JsonNode candidates) {
        ArrayNode questions = objectMapper.createArrayNode();
        if (candidates == null || !candidates.isArray()) {
            return questions;
        }
        for (JsonNode candidate : candidates) {
            String question = candidateQuestionText(candidate);
            if (!question.isEmpty()) {
                questions.add(question);
            }
        }
        return questions;
    }

    private String candidateQuestionText(JsonNode candidate) {
        if (candidate == null || candidate.isNull()) {
            return "";
        }
        if (candidate.isTextual()) {
            return trim(candidate.asText());
        }
        if (candidate.isObject()) {
            String question = text(candidate, "question", "");
            if (!question.isEmpty()) {
                return question;
            }
            return text(candidate, "title", "");
        }
        return "";
    }

    private ArrayNode defaultFallbackSuggestedQuestions() {
        ArrayNode questions = objectMapper.createArrayNode();
        for (String question : FALLBACK_SUGGESTED_QUESTIONS) {
            questions.add(question);
        }
        return questions;
    }

    private void normalize(AgentChatRequestDTO requestDTO) {
        requestDTO.setQuery(trim(requestDTO.getQuery()));
        requestDTO.setSessionId(trimToDefault(requestDTO.getSessionId(), "default"));
        requestDTO.setTopK(requestDTO.getTopK() == null ? 5 : requestDTO.getTopK());
    }

    private void recordSuccess(AuthenticatedUser user, Agent agent, String prompt, String responseText, long durationMs) {
        AgentCallRecord record = baseRecord(user, agent, prompt, durationMs);
        record.setResponseText(responseText);
        record.setStatus("SUCCESS");
        agentCallRecordMapper.create(record);
    }

    private void recordFailure(
        AuthenticatedUser user,
        Agent agent,
        String prompt,
        String status,
        String errorCode,
        String errorMessage,
        long durationMs
    ) {
        AgentCallRecord record = baseRecord(user, agent, prompt, durationMs);
        record.setStatus(status);
        record.setErrorCode(errorCode);
        record.setErrorMessage(errorMessage);
        agentCallRecordMapper.create(record);
    }

    private AgentCallRecord baseRecord(AuthenticatedUser user, Agent agent, String prompt, long durationMs) {
        AgentCallRecord record = new AgentCallRecord();
        record.setUserId(user.getAccountId());
        record.setAgentId(agent.getId());
        record.setUsername(user.getUsername());
        record.setAgentName(agent.getName());
        record.setPrompt(prompt);
        record.setDurationMs(durationMs);
        return record;
    }

    private String trim(String value) {
        return value == null ? "" : value.trim();
    }

    private String trimToDefault(String value, String defaultValue) {
        String trimmed = trim(value);
        return trimmed.isEmpty() ? defaultValue : trimmed;
    }

    private String providerType(Agent agent) {
        return trimToDefault(agent.getProviderType(), "CUSTOM").toUpperCase();
    }

    private String text(JsonNode root, String fieldName, String defaultValue) {
        JsonNode node = root.get(fieldName);
        if (node == null || node.isNull()) {
            return defaultValue;
        }
        String value = node.asText("");
        return value.isEmpty() ? defaultValue : value;
    }
}
