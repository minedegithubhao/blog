package com.canbe.blog.agent.service.impl;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import com.canbe.blog.agent.dto.AgentChatRequestDTO;
import com.canbe.blog.agent.entity.Agent;
import com.canbe.blog.agent.mapper.AgentCallRecordMapper;
import com.canbe.blog.agent.mapper.AgentMapper;
import com.canbe.blog.common.BusinessException;
import com.canbe.blog.quota.service.UserAgentQuotaService;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.lang.reflect.Method;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import org.junit.jupiter.api.Test;

class AgentChatServiceImplTest {

    @Test
    void parseAgentResponseRejectsHtmlProviderResponse() throws Exception {
        AgentChatServiceImpl service = new AgentChatServiceImpl(
            nullMapper(),
            nullRecordMapper(),
            nullQuotaService(),
            new ObjectMapper(),
            HttpClient.newHttpClient()
        );
        Agent agent = new Agent();
        agent.setProviderType("CUSTOM");
        AgentChatRequestDTO request = new AgentChatRequestDTO();
        request.setSessionId("debug");

        Method method = AgentChatServiceImpl.class.getDeclaredMethod(
            "parseAgentResponse",
            Agent.class,
            AgentChatRequestDTO.class,
            String.class
        );
        method.setAccessible(true);

        Exception exception = assertThrows(
            Exception.class,
            () -> method.invoke(service, agent, request, "<!doctype html><html><head><meta content=\"MinIO Console\"></head></html>")
        );
        BusinessException businessException = (BusinessException) exception.getCause();
        assertEquals(4004, businessException.getCode());
        assertEquals("Agent服务返回非JSON响应，请检查Agent地址配置", businessException.getMessage());
    }

    @Test
    void buildAgentRequestUsesRuntimeUrlOverrideForCustomAgent() throws Exception {
        AgentChatServiceImpl service = new AgentChatServiceImpl(
            nullMapper(),
            nullRecordMapper(),
            nullQuotaService(),
            new ObjectMapper(),
            HttpClient.newHttpClient(),
            "http://canbe-agents:8801/faq/chat"
        );
        Agent agent = new Agent();
        agent.setProviderType("CUSTOM");
        agent.setRuntimeUrl("http://127.0.0.1:8801/faq/chat");
        AgentChatRequestDTO request = new AgentChatRequestDTO();
        request.setQuery("test");
        request.setSessionId("debug");

        Method method = AgentChatServiceImpl.class.getDeclaredMethod(
            "buildAgentRequest",
            Agent.class,
            AgentChatRequestDTO.class,
            com.canbe.blog.security.AuthenticatedUser.class
        );
        method.setAccessible(true);

        HttpRequest httpRequest = (HttpRequest) method.invoke(service, agent, request, null);

        assertEquals(URI.create("http://canbe-agents:8801/faq/chat"), httpRequest.uri());
    }

    @Test
    void buildAgentRequestSupportsPreprodRuntimeUrlOverrideForCustomAgent() throws Exception {
        AgentChatServiceImpl service = new AgentChatServiceImpl(
            nullMapper(),
            nullRecordMapper(),
            nullQuotaService(),
            new ObjectMapper(),
            HttpClient.newHttpClient(),
            "http://canbe-agents:18801/faq/chat"
        );
        Agent agent = new Agent();
        agent.setProviderType("CUSTOM");
        agent.setRuntimeUrl("http://127.0.0.1:8801/faq/chat");
        AgentChatRequestDTO request = new AgentChatRequestDTO();
        request.setQuery("test");
        request.setSessionId("debug");

        Method method = AgentChatServiceImpl.class.getDeclaredMethod(
            "buildAgentRequest",
            Agent.class,
            AgentChatRequestDTO.class,
            com.canbe.blog.security.AuthenticatedUser.class
        );
        method.setAccessible(true);

        HttpRequest httpRequest = (HttpRequest) method.invoke(service, agent, request, null);

        assertEquals(URI.create("http://canbe-agents:18801/faq/chat"), httpRequest.uri());
    }

    private AgentMapper nullMapper() {
        return null;
    }

    private AgentCallRecordMapper nullRecordMapper() {
        return null;
    }

    private UserAgentQuotaService nullQuotaService() {
        return null;
    }
}
