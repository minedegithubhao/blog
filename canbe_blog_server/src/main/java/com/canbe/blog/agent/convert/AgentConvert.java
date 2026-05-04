package com.canbe.blog.agent.convert;

import com.canbe.blog.agent.entity.Agent;
import com.canbe.blog.agent.entity.AgentCallRecord;
import com.canbe.blog.agent.vo.AgentCallRecordVO;
import com.canbe.blog.agent.vo.AgentVO;

public final class AgentConvert {

    private AgentConvert() {
    }

    public static AgentVO toVO(Agent agent) {
        AgentVO vo = new AgentVO();
        vo.setId(agent.getId());
        vo.setName(agent.getName());
        vo.setCode(agent.getCode());
        vo.setDescription(agent.getDescription());
        vo.setAvatarUrl(agent.getAvatarUrl());
        vo.setRuntimeUrl(agent.getRuntimeUrl());
        vo.setEmbedUrl(agent.getEmbedUrl());
        vo.setProviderType(agent.getProviderType());
        vo.setApiUrl(agent.getApiUrl());
        vo.setResponseMode(agent.getResponseMode());
        vo.setApiKeyConfigured(agent.getApiKey() != null && !agent.getApiKey().trim().isEmpty());
        vo.setStatus(agent.getStatus());
        vo.setSortOrder(agent.getSortOrder());
        vo.setGmtCreate(agent.getGmtCreate());
        vo.setGmtModified(agent.getGmtModified());
        return vo;
    }

    public static AgentCallRecordVO toVO(AgentCallRecord record) {
        AgentCallRecordVO vo = new AgentCallRecordVO();
        vo.setId(record.getId());
        vo.setUserId(record.getUserId());
        vo.setAgentId(record.getAgentId());
        vo.setUsername(record.getUsername());
        vo.setAgentName(record.getAgentName());
        vo.setPrompt(record.getPrompt());
        vo.setResponseText(record.getResponseText());
        vo.setStatus(record.getStatus());
        vo.setErrorCode(record.getErrorCode());
        vo.setErrorMessage(record.getErrorMessage());
        vo.setDurationMs(record.getDurationMs());
        vo.setGmtCreate(record.getGmtCreate());
        vo.setGmtModified(record.getGmtModified());
        return vo;
    }
}
