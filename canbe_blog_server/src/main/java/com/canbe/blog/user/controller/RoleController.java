package com.canbe.blog.user.controller;

import com.canbe.blog.common.PageResult;
import com.canbe.blog.common.Result;
import com.canbe.blog.user.dto.RoleCreateDTO;
import com.canbe.blog.user.dto.RoleQueryDTO;
import com.canbe.blog.user.dto.RoleUpdateDTO;
import com.canbe.blog.user.service.RoleService;
import com.canbe.blog.user.vo.RoleVO;
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
@RequestMapping("/api/v1/roles")
public class RoleController {

    private final RoleService roleService;

    public RoleController(RoleService roleService) {
        this.roleService = roleService;
    }

    @GetMapping
    public Result<PageResult<RoleVO>> list(RoleQueryDTO queryDTO) {
        return Result.success(roleService.list(queryDTO));
    }

    @PostMapping
    public Result<Long> create(@Valid @RequestBody RoleCreateDTO createDTO) {
        return Result.success(roleService.create(createDTO));
    }

    @PutMapping("/{id}")
    public Result<Void> update(@PathVariable Long id, @Valid @RequestBody RoleUpdateDTO updateDTO) {
        roleService.update(id, updateDTO);
        return Result.success(null);
    }

    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        roleService.delete(id);
        return Result.success(null);
    }
}
