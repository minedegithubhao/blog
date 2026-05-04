package com.canbe.blog.agent.controller;

import com.canbe.blog.agent.dto.AgentCreateDTO;
import com.canbe.blog.agent.dto.AgentQueryDTO;
import com.canbe.blog.agent.dto.AgentUpdateDTO;
import com.canbe.blog.agent.service.AgentService;
import com.canbe.blog.agent.vo.AgentVO;
import com.canbe.blog.agent.vo.ConnectionTestVO;
import com.canbe.blog.common.PageResult;
import com.canbe.blog.common.Result;
import jakarta.validation.Valid;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Validated
@RestController
@RequestMapping("/api/v1/agents")
public class AdminAgentController {

    private final AgentService agentService;

    public AdminAgentController(AgentService agentService) {
        this.agentService = agentService;
    }

    @GetMapping
    public Result<PageResult<AgentVO>> list(AgentQueryDTO queryDTO) {
        return Result.success(agentService.list(queryDTO));
    }

    @PostMapping
    public Result<Long> create(@Valid @RequestBody AgentCreateDTO createDTO) {
        return Result.success(agentService.create(createDTO));
    }

    @PutMapping("/{id}")
    public Result<Void> update(@PathVariable Long id, @Valid @RequestBody AgentUpdateDTO updateDTO) {
        agentService.update(id, updateDTO);
        return Result.success(null);
    }

    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        agentService.delete(id);
        return Result.success(null);
    }

    @PostMapping("/{id}/test-connection")
    public Result<ConnectionTestVO> testConnection(@PathVariable Long id) {
        return Result.success(agentService.testConnection(id));
    }
}
