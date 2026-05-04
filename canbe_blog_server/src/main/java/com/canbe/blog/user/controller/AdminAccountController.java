package com.canbe.blog.user.controller;

import com.canbe.blog.common.PageResult;
import com.canbe.blog.common.Result;
import com.canbe.blog.user.dto.AdminAccountCreateDTO;
import com.canbe.blog.user.dto.AdminAccountQueryDTO;
import com.canbe.blog.user.dto.AdminAccountUpdateDTO;
import com.canbe.blog.user.service.AdminAccountService;
import com.canbe.blog.user.vo.AdminAccountVO;
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
@RequestMapping("/api/v1/admin/accounts")
public class AdminAccountController {

    private final AdminAccountService adminAccountService;

    public AdminAccountController(AdminAccountService adminAccountService) {
        this.adminAccountService = adminAccountService;
    }

    @GetMapping
    public Result<PageResult<AdminAccountVO>> list(AdminAccountQueryDTO queryDTO) {
        return Result.success(adminAccountService.list(queryDTO));
    }

    @PostMapping
    public Result<Long> create(@Valid @RequestBody AdminAccountCreateDTO createDTO) {
        return Result.success(adminAccountService.create(createDTO));
    }

    @PutMapping("/{id}")
    public Result<Void> update(@PathVariable Long id, @Valid @RequestBody AdminAccountUpdateDTO updateDTO) {
        adminAccountService.update(id, updateDTO);
        return Result.success(null);
    }

    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        adminAccountService.delete(id);
        return Result.success(null);
    }
}
