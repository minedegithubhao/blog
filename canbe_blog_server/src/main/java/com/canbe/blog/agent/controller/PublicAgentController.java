package com.canbe.blog.agent.controller;

import com.canbe.blog.agent.dto.AgentQueryDTO;
import com.canbe.blog.agent.service.PublicAgentService;
import com.canbe.blog.agent.vo.AgentVO;
import com.canbe.blog.common.PageResult;
import com.canbe.blog.common.Result;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/public/agents")
public class PublicAgentController {

    private final PublicAgentService publicAgentService;

    public PublicAgentController(PublicAgentService publicAgentService) {
        this.publicAgentService = publicAgentService;
    }

    @GetMapping
    public Result<PageResult<AgentVO>> list(AgentQueryDTO queryDTO) {
        return Result.success(publicAgentService.list(queryDTO));
    }
}
