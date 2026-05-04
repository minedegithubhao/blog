package com.canbe.blog.agent.controller;

import com.canbe.blog.agent.dto.AgentChatRequestDTO;
import com.canbe.blog.agent.service.AgentChatService;
import com.canbe.blog.agent.vo.AgentChatVO;
import com.canbe.blog.common.Result;
import jakarta.validation.Valid;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Validated
@RestController
@RequestMapping("/api/v1/agents")
public class AgentChatController {

    private final AgentChatService agentChatService;

    public AgentChatController(AgentChatService agentChatService) {
        this.agentChatService = agentChatService;
    }

    @PostMapping("/{id}/chat")
    public Result<AgentChatVO> chat(@PathVariable Long id, @Valid @RequestBody AgentChatRequestDTO requestDTO) {
        return Result.success(agentChatService.chat(id, requestDTO));
    }
}
