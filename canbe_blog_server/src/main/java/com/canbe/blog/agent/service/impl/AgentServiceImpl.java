package com.canbe.blog.agent.service.impl;

import com.canbe.blog.agent.convert.AgentConvert;
import com.canbe.blog.agent.dto.AgentCreateDTO;
import com.canbe.blog.agent.dto.AgentQueryDTO;
import com.canbe.blog.agent.dto.AgentUpdateDTO;
import com.canbe.blog.agent.entity.Agent;
import com.canbe.blog.agent.mapper.AgentMapper;
import com.canbe.blog.agent.service.AgentService;
import com.canbe.blog.agent.vo.AgentVO;
import com.canbe.blog.agent.vo.ConnectionTestVO;
import com.canbe.blog.common.BusinessException;
import com.canbe.blog.common.PageResult;
import com.canbe.blog.quota.service.QuotaInitializationService;
import com.canbe.blog.security.AuthenticatedUser;
import com.canbe.blog.security.CurrentUserContext;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AgentServiceImpl implements AgentService {

    private static final String ADMIN_ROLE = "ADMIN";
    private static final String PROVIDER_CUSTOM = "CUSTOM";
    private static final String PROVIDER_DIFY = "DIFY";

    private final AgentMapper agentMapper;
    private final QuotaInitializationService quotaInitializationService;

    public AgentServiceImpl(AgentMapper agentMapper, QuotaInitializationService quotaInitializationService) {
        this.agentMapper = agentMapper;
        this.quotaInitializationService = quotaInitializationService;
    }

    @Override
    public PageResult<AgentVO> list(AgentQueryDTO queryDTO) {
        requireAdmin();
        int page = normalizePage(queryDTO.getPage());
        int pageSize = normalizePageSize(queryDTO.getPageSize());
        queryDTO.setPage(page);
        queryDTO.setPageSize(pageSize);
        List<AgentVO> list = agentMapper.list(queryDTO).stream()
            .map(AgentConvert::toVO)
            .toList();
        return new PageResult<>(list, agentMapper.count(queryDTO), page, pageSize);
    }

    @Override
    @Transactional
    public Long create(AgentCreateDTO createDTO) {
        requireAdmin();
        normalize(createDTO);
        validateUnique(createDTO.getName(), createDTO.getCode(), null);
        Long agentId = agentMapper.create(createDTO);
        quotaInitializationService.initializeAgentPolicies(agentId);
        return agentId;
    }

    @Override
    @Transactional
    public void update(Long id, AgentUpdateDTO updateDTO) {
        requireAdmin();
        Agent agent = agentMapper.findById(id).orElseThrow(() -> new BusinessException(4001, "Agent不存在"));
        normalize(updateDTO);
        if (PROVIDER_DIFY.equals(updateDTO.getProviderType()) && updateDTO.getApiKey().isEmpty()) {
            updateDTO.setApiKey(trimToEmpty(agent.getApiKey()));
        }
        validateUnique(updateDTO.getName(), updateDTO.getCode(), agent.getId());
        if (agentMapper.update(agent.getId(), updateDTO) == 0) {
            throw new BusinessException(4001, "Agent不存在");
        }
    }

    @Override
    @Transactional
    public void delete(Long id) {
        requireAdmin();
        agentMapper.findById(id).orElseThrow(() -> new BusinessException(4001, "Agent不存在"));
        if (agentMapper.delete(id) == 0) {
            throw new BusinessException(4001, "Agent不存在");
        }
    }

    @Override
    public ConnectionTestVO testConnection(Long id) {
        requireAdmin();
        Agent agent = agentMapper.findById(id).orElseThrow(() -> new BusinessException(4001, "Agent不存在"));
        boolean difyProvider = PROVIDER_DIFY.equals(trim(agent.getProviderType()).toUpperCase());
        String testUrl = difyProvider ? trim(agent.getApiUrl()) : trim(agent.getRuntimeUrl());
        if (testUrl.isEmpty()) {
            throw new BusinessException(4005, "Agent地址未配置");
        }
        long start = System.nanoTime();
        ConnectionTestVO vo = new ConnectionTestVO();
        try {
            HttpClient client = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(5))
                .build();
            HttpRequest.Builder requestBuilder = HttpRequest.newBuilder()
                .uri(URI.create(testUrl))
                .timeout(Duration.ofSeconds(10));
            HttpRequest request;
            if (difyProvider) {
                String apiKey = trim(agent.getApiKey());
                if (apiKey.isEmpty()) {
                    vo.setSuccess(false);
                    vo.setLatencyMs(Duration.ofNanos(System.nanoTime() - start).toMillis());
                    vo.setErrorCode("API_KEY_REQUIRED");
                    vo.setErrorMessage("Dify API Key未配置");
                    return vo;
                }
                request = requestBuilder
                    .header("Content-Type", "application/json")
                    .header("Authorization", "Bearer " + apiKey)
                    .POST(HttpRequest.BodyPublishers.ofString(
                        "{\"inputs\":{},\"query\":\"ping\",\"response_mode\":\"blocking\",\"conversation_id\":\"\",\"user\":\"connection_test\"}",
                        StandardCharsets.UTF_8
                    ))
                    .build();
            } else {
                request = requestBuilder.GET().build();
            }
            HttpResponse<Void> response = client.send(request, HttpResponse.BodyHandlers.discarding());
            long latency = Duration.ofNanos(System.nanoTime() - start).toMillis();
            vo.setLatencyMs(latency);
            vo.setSuccess(response.statusCode() >= 200 && response.statusCode() < 300);
            if (!vo.isSuccess()) {
                vo.setErrorCode("RUNTIME_ERROR");
                vo.setErrorMessage("Agent服务 HTTP " + response.statusCode());
            }
            return vo;
        } catch (IllegalArgumentException ex) {
            vo.setSuccess(false);
            vo.setLatencyMs(Duration.ofNanos(System.nanoTime() - start).toMillis());
            vo.setErrorCode("INVALID_URL");
            vo.setErrorMessage("Runtime URL不合法");
            return vo;
        } catch (Exception ex) {
            vo.setSuccess(false);
            vo.setLatencyMs(Duration.ofNanos(System.nanoTime() - start).toMillis());
            vo.setErrorCode("NETWORK_ERROR");
            vo.setErrorMessage("Runtime连接失败");
            return vo;
        }
    }

    private AuthenticatedUser requireAdmin() {
        AuthenticatedUser currentUser = CurrentUserContext.getRequired();
        if (!ADMIN_ROLE.equals(currentUser.getRoleCode())) {
            throw new BusinessException(2005, "权限不足");
        }
        return currentUser;
    }

    private void validateUnique(String name, String code, Long currentId) {
        if (currentId == null) {
            if (agentMapper.existsByName(name)) {
                throw new BusinessException(4002, "Agent名称已存在");
            }
            if (agentMapper.existsByCode(code)) {
                throw new BusinessException(4003, "Agent编码已存在");
            }
            return;
        }
        if (agentMapper.existsByNameExceptId(name, currentId)) {
            throw new BusinessException(4002, "Agent名称已存在");
        }
        if (agentMapper.existsByCodeExceptId(code, currentId)) {
            throw new BusinessException(4003, "Agent编码已存在");
        }
    }

    private void normalize(AgentCreateDTO dto) {
        dto.setName(trim(dto.getName()));
        dto.setCode(trim(dto.getCode()).toUpperCase());
        dto.setDescription(trimToEmpty(dto.getDescription()));
        dto.setAvatarUrl(trimToEmpty(dto.getAvatarUrl()));
        dto.setRuntimeUrl(trimToEmpty(dto.getRuntimeUrl()));
        dto.setEmbedUrl(trimToEmpty(dto.getEmbedUrl()));
        dto.setProviderType(trimToDefault(dto.getProviderType(), PROVIDER_CUSTOM).toUpperCase());
        dto.setApiUrl(trimToEmpty(dto.getApiUrl()));
        dto.setApiKey(trimToEmpty(dto.getApiKey()));
        dto.setResponseMode(trimToDefault(dto.getResponseMode(), "blocking").toLowerCase());
        if (!"blocking".equals(dto.getResponseMode())) {
            throw new BusinessException(4005, "V1 Dify Agent仅支持blocking响应模式");
        }
        if (!PROVIDER_CUSTOM.equals(dto.getProviderType()) && !PROVIDER_DIFY.equals(dto.getProviderType())) {
            throw new BusinessException(4005, "Agent提供方仅支持CUSTOM或DIFY");
        }
        if (PROVIDER_CUSTOM.equals(dto.getProviderType()) && dto.getRuntimeUrl().isEmpty()) {
            throw new BusinessException(4005, "CUSTOM Agent必须填写Runtime地址");
        }
        if (PROVIDER_DIFY.equals(dto.getProviderType()) && dto.getApiUrl().isEmpty()) {
            throw new BusinessException(4005, "Dify Agent必须填写API地址");
        }
        dto.setStatus(dto.getStatus() == null ? 1 : dto.getStatus());
        dto.setSortOrder(dto.getSortOrder() == null ? 0 : dto.getSortOrder());
    }

    private int normalizePage(Integer page) {
        return page == null || page < 1 ? 1 : page;
    }

    private int normalizePageSize(Integer pageSize) {
        if (pageSize == null || pageSize < 1) {
            return 20;
        }
        return Math.min(pageSize, 100);
    }

    private String trim(String value) {
        return value == null ? "" : value.trim();
    }

    private String trimToEmpty(String value) {
        return value == null ? "" : value.trim();
    }

    private String trimToDefault(String value, String defaultValue) {
        String trimmed = trim(value);
        return trimmed.isEmpty() ? defaultValue : trimmed;
    }
}
