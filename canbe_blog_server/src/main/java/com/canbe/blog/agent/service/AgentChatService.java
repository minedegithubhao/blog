package com.canbe.blog.agent.service;

import com.canbe.blog.agent.dto.AgentChatRequestDTO;
import com.canbe.blog.agent.vo.AgentChatVO;

public interface AgentChatService {

    AgentChatVO chat(Long agentId, AgentChatRequestDTO requestDTO);
}
