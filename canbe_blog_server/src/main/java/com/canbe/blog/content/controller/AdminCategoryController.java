package com.canbe.blog.content.controller;

import com.canbe.blog.common.PageResult;
import com.canbe.blog.common.Result;
import com.canbe.blog.content.dto.CategoryCreateDTO;
import com.canbe.blog.content.dto.CategoryQueryDTO;
import com.canbe.blog.content.dto.CategoryUpdateDTO;
import com.canbe.blog.content.service.CategoryService;
import com.canbe.blog.content.vo.CategoryVO;
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
@RequestMapping("/api/v1/categories")
public class AdminCategoryController {

    private final CategoryService categoryService;

    public AdminCategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping
    public Result<PageResult<CategoryVO>> list(CategoryQueryDTO queryDTO) {
        return Result.success(categoryService.list(queryDTO));
    }

    @PostMapping
    public Result<Long> create(@Valid @RequestBody CategoryCreateDTO createDTO) {
        return Result.success(categoryService.create(createDTO));
    }

    @PutMapping("/{id}")
    public Result<Void> update(@PathVariable Long id, @Valid @RequestBody CategoryUpdateDTO updateDTO) {
        categoryService.update(id, updateDTO);
        return Result.success(null);
    }

    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        categoryService.delete(id);
        return Result.success(null);
    }
}
