package com.canbe.blog.rag.service.impl;

import com.canbe.blog.common.BusinessException;
import com.canbe.blog.rag.service.RagEvaluationProxyService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class RagEvaluationProxyServiceImpl implements RagEvaluationProxyService {

    private final ObjectMapper objectMapper;
    private final HttpClient httpClient;
    private final String agentsBaseUrl;

    @Autowired
    public RagEvaluationProxyServiceImpl(
        ObjectMapper objectMapper,
        @Value("${canbe.agent.evaluation-base-url:}") String evaluationBaseUrl,
        @Value("${canbe.agent.runtime-url:}") String runtimeUrl
    ) {
        this(objectMapper, HttpClient.newBuilder()
            .version(HttpClient.Version.HTTP_1_1)
            .connectTimeout(Duration.ofSeconds(5))
            .build(), evaluationBaseUrl, runtimeUrl);
    }

    RagEvaluationProxyServiceImpl(ObjectMapper objectMapper, HttpClient httpClient, String evaluationBaseUrl, String runtimeUrl) {
        this.objectMapper = objectMapper;
        this.httpClient = httpClient;
        this.agentsBaseUrl = normalizeBaseUrl(evaluationBaseUrl, runtimeUrl);
    }

    @Override
    public JsonNode forwardGet(String path, String queryString) {
        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create(targetUrl(path, queryString)))
            .timeout(Duration.ofSeconds(30))
            .GET()
            .build();
        return send(request);
    }

    @Override
    public JsonNode forwardPost(String path, JsonNode body) {
        try {
            HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(targetUrl(path, "")))
                .timeout(Duration.ofSeconds(120))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(body == null ? "{}" : objectMapper.writeValueAsString(body), StandardCharsets.UTF_8))
                .build();
            return send(request);
        } catch (Exception exception) {
            throw new BusinessException(4008, "RAG评估服务调用失败");
        }
    }

    private JsonNode send(HttpRequest request) {
        try {
            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString(StandardCharsets.UTF_8));
            if (response.statusCode() < 200 || response.statusCode() >= 300) {
                throw new BusinessException(4004, "RAG评估服务返回异常");
            }
            String body = trim(response.body());
            if (body.isEmpty() || (body.charAt(0) != '{' && body.charAt(0) != '[')) {
                throw new BusinessException(4004, "RAG评估服务返回非JSON响应，请检查canbe_agents地址配置");
            }
            return objectMapper.readTree(body);
        } catch (BusinessException exception) {
            throw exception;
        } catch (InterruptedException exception) {
            Thread.currentThread().interrupt();
            throw new BusinessException(4007, "RAG评估服务调用被中断");
        } catch (Exception exception) {
            throw new BusinessException(4008, "RAG评估服务调用失败");
        }
    }

    private String targetUrl(String path, String queryString) {
        String normalizedPath = path.startsWith("/") ? path : "/" + path;
        String query = trim(queryString);
        return agentsBaseUrl + normalizedPath + (query.isEmpty() ? "" : "?" + query);
    }

    private String normalizeBaseUrl(String evaluationBaseUrl, String runtimeUrl) {
        String explicit = removeTrailingSlash(evaluationBaseUrl);
        if (!explicit.isEmpty()) {
            return explicit;
        }
        String runtime = trim(runtimeUrl);
        if (runtime.isEmpty()) {
            throw new BusinessException(4005, "RAG评估服务地址未配置");
        }
        URI uri = URI.create(runtime);
        String scheme = uri.getScheme();
        String authority = uri.getAuthority();
        if (scheme == null || authority == null) {
            throw new BusinessException(4005, "RAG评估服务地址配置不合法");
        }
        return scheme + "://" + authority;
    }

    private String removeTrailingSlash(String value) {
        String result = trim(value);
        while (result.endsWith("/")) {
            result = result.substring(0, result.length() - 1);
        }
        return result;
    }

    private String trim(String value) {
        return value == null ? "" : value.trim();
    }
}
