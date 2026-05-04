package com.canbe.blog.agent.controller;

import com.canbe.blog.agent.dto.AgentCallRecordQueryDTO;
import com.canbe.blog.agent.service.AgentCallRecordService;
import com.canbe.blog.agent.vo.AgentCallRecordVO;
import com.canbe.blog.common.PageResult;
import com.canbe.blog.common.Result;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/agent-call-records")
public class AdminAgentCallRecordController {

    private final AgentCallRecordService agentCallRecordService;

    public AdminAgentCallRecordController(AgentCallRecordService agentCallRecordService) {
        this.agentCallRecordService = agentCallRecordService;
    }

    @GetMapping
    public Result<PageResult<AgentCallRecordVO>> list(AgentCallRecordQueryDTO queryDTO) {
        return Result.success(agentCallRecordService.list(queryDTO));
    }
}
