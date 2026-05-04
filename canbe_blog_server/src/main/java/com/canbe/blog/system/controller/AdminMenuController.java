package com.canbe.blog.system.controller;

import com.canbe.blog.common.PageResult;
import com.canbe.blog.common.Result;
import com.canbe.blog.system.dto.MenuCreateDTO;
import com.canbe.blog.system.dto.MenuQueryDTO;
import com.canbe.blog.system.dto.MenuUpdateDTO;
import com.canbe.blog.system.service.MenuService;
import com.canbe.blog.system.vo.MenuTreeVO;
import com.canbe.blog.system.vo.MenuVO;
import jakarta.validation.Valid;
import java.util.List;
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
@RequestMapping("/api/v1/menus")
public class AdminMenuController {

    private final MenuService menuService;

    public AdminMenuController(MenuService menuService) {
        this.menuService = menuService;
    }

    @GetMapping
    public Result<PageResult<MenuVO>> list(MenuQueryDTO queryDTO) {
        return Result.success(menuService.list(queryDTO));
    }

    @GetMapping("/tree")
    public Result<List<MenuTreeVO>> listTree() {
        return Result.success(menuService.listTree());
    }

    @PostMapping
    public Result<Long> create(@Valid @RequestBody MenuCreateDTO createDTO) {
        return Result.success(menuService.create(createDTO));
    }

    @PutMapping("/{id}")
    public Result<Void> update(@PathVariable Long id, @Valid @RequestBody MenuUpdateDTO updateDTO) {
        menuService.update(id, updateDTO);
        return Result.success(null);
    }

    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        menuService.delete(id);
        return Result.success(null);
    }
}
