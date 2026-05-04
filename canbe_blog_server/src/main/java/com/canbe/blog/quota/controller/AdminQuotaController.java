package com.canbe.blog.quota.controller;

import com.canbe.blog.common.PageResult;
import com.canbe.blog.common.Result;
import com.canbe.blog.quota.dto.RoleAgentPolicyQueryDTO;
import com.canbe.blog.quota.dto.RoleAgentPolicyUpdateDTO;
import com.canbe.blog.quota.dto.UserAgentQuotaQueryDTO;
import com.canbe.blog.quota.dto.UserAgentQuotaUpdateDTO;
import com.canbe.blog.quota.service.RoleAgentPolicyService;
import com.canbe.blog.quota.service.UserAgentQuotaService;
import com.canbe.blog.quota.vo.RoleAgentPolicyVO;
import com.canbe.blog.quota.vo.UserAgentQuotaVO;
import jakarta.validation.Valid;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Validated
@RestController
@RequestMapping("/api/v1")
public class AdminQuotaController {

    private final UserAgentQuotaService userAgentQuotaService;
    private final RoleAgentPolicyService roleAgentPolicyService;

    public AdminQuotaController(UserAgentQuotaService userAgentQuotaService, RoleAgentPolicyService roleAgentPolicyService) {
        this.userAgentQuotaService = userAgentQuotaService;
        this.roleAgentPolicyService = roleAgentPolicyService;
    }

    @GetMapping("/quotas")
    public Result<PageResult<UserAgentQuotaVO>> listQuotas(UserAgentQuotaQueryDTO queryDTO) {
        return Result.success(userAgentQuotaService.list(queryDTO));
    }

    @PutMapping("/quotas/{id}")
    public Result<Void> updateQuota(@PathVariable Long id, @Valid @RequestBody UserAgentQuotaUpdateDTO updateDTO) {
        userAgentQuotaService.update(id, updateDTO);
        return Result.success(null);
    }

    @GetMapping("/role-agent-policies")
    public Result<PageResult<RoleAgentPolicyVO>> listRolePolicies(RoleAgentPolicyQueryDTO queryDTO) {
        return Result.success(roleAgentPolicyService.list(queryDTO));
    }

    @PutMapping("/role-agent-policies/{id}")
    public Result<Void> updateRolePolicy(@PathVariable Long id, @Valid @RequestBody RoleAgentPolicyUpdateDTO updateDTO) {
        roleAgentPolicyService.update(id, updateDTO);
        return Result.success(null);
    }
}
