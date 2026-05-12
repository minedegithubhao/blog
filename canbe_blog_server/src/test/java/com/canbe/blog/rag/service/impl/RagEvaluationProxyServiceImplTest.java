package com.canbe.blog.rag.service.impl;

import static org.junit.jupiter.api.Assertions.assertEquals;

import com.canbe.blog.common.BusinessException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpHeaders;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicReference;
import javax.net.ssl.SSLSession;
import org.junit.jupiter.api.Test;

class RagEvaluationProxyServiceImplTest {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Test
    void derivesAgentsBaseUrlFromChatRuntimeUrl() throws Exception {
        CapturingHttpClient httpClient = new CapturingHttpClient("{\"items\":[]}");
        RagEvaluationProxyServiceImpl service = new RagEvaluationProxyServiceImpl(
            objectMapper,
            httpClient,
            "",
            "http://127.0.0.1:8801/faq/chat"
        );

        service.forwardGet("/admin/eval-sets", "limit=10");

        assertEquals(URI.create("http://127.0.0.1:8801/admin/eval-sets?limit=10"), httpClient.lastRequest.get().uri());
    }

    @Test
    void forwardsPostJsonBodyToAgents() throws Exception {
        CapturingHttpClient httpClient = new CapturingHttpClient("{\"ok\":true,\"eval_set_id\":\"eval_1\"}");
        RagEvaluationProxyServiceImpl service = new RagEvaluationProxyServiceImpl(
            objectMapper,
            httpClient,
            "http://canbe-agents:18801",
            ""
        );
        JsonNode body = objectMapper.readTree("{\"name\":\"smoke\",\"total_count\":1}");

        JsonNode result = service.forwardPost("/admin/eval-sets/generate", body);

        assertEquals(URI.create("http://canbe-agents:18801/admin/eval-sets/generate"), httpClient.lastRequest.get().uri());
        assertEquals("eval_1", result.get("eval_set_id").asText());
    }

    @Test
    void rejectsNonJsonAgentsResponse() {
        CapturingHttpClient httpClient = new CapturingHttpClient("<!doctype html>");
        RagEvaluationProxyServiceImpl service = new RagEvaluationProxyServiceImpl(
            objectMapper,
            httpClient,
            "http://127.0.0.1:8801",
            ""
        );

        BusinessException exception = org.junit.jupiter.api.Assertions.assertThrows(
            BusinessException.class,
            () -> service.forwardGet("/admin/eval-sets", "")
        );

        assertEquals(4004, exception.getCode());
    }

    private static class CapturingHttpClient extends HttpClient {
        private final String responseBody;
        private final AtomicReference<HttpRequest> lastRequest = new AtomicReference<>();

        private CapturingHttpClient(String responseBody) {
            this.responseBody = responseBody;
        }

        @Override
        public <T> HttpResponse<T> send(HttpRequest request, HttpResponse.BodyHandler<T> responseBodyHandler) {
            lastRequest.set(request);
            @SuppressWarnings("unchecked")
            T body = (T) responseBody;
            return new SimpleHttpResponse<>(request, body);
        }

        @Override
        public Optional<java.net.CookieHandler> cookieHandler() {
            return Optional.empty();
        }

        @Override
        public Optional<java.time.Duration> connectTimeout() {
            return Optional.empty();
        }

        @Override
        public Redirect followRedirects() {
            return Redirect.NEVER;
        }

        @Override
        public Optional<java.net.ProxySelector> proxy() {
            return Optional.empty();
        }

        @Override
        public javax.net.ssl.SSLContext sslContext() {
            return null;
        }

        @Override
        public javax.net.ssl.SSLParameters sslParameters() {
            return null;
        }

        @Override
        public Optional<java.net.Authenticator> authenticator() {
            return Optional.empty();
        }

        @Override
        public Version version() {
            return Version.HTTP_1_1;
        }

        @Override
        public Optional<java.util.concurrent.Executor> executor() {
            return Optional.empty();
        }

        @Override
        public <T> java.util.concurrent.CompletableFuture<HttpResponse<T>> sendAsync(
            HttpRequest request,
            HttpResponse.BodyHandler<T> responseBodyHandler
        ) {
            throw new UnsupportedOperationException();
        }

        @Override
        public <T> java.util.concurrent.CompletableFuture<HttpResponse<T>> sendAsync(
            HttpRequest request,
            HttpResponse.BodyHandler<T> responseBodyHandler,
            HttpResponse.PushPromiseHandler<T> pushPromiseHandler
        ) {
            throw new UnsupportedOperationException();
        }
    }

    private record SimpleHttpResponse<T>(HttpRequest request, T body) implements HttpResponse<T> {
        @Override
        public int statusCode() {
            return 200;
        }

        @Override
        public HttpHeaders headers() {
            return HttpHeaders.of(java.util.Map.of(), (name, value) -> true);
        }

        @Override
        public Optional<SSLSession> sslSession() {
            return Optional.empty();
        }

        @Override
        public URI uri() {
            return request.uri();
        }

        @Override
        public HttpClient.Version version() {
            return HttpClient.Version.HTTP_1_1;
        }

        @Override
        public Optional<HttpResponse<T>> previousResponse() {
            return Optional.empty();
        }
    }
}
