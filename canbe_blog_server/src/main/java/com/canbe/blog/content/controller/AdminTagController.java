package com.canbe.blog.content.controller;

import com.canbe.blog.common.PageResult;
import com.canbe.blog.common.Result;
import com.canbe.blog.content.dto.TagCreateDTO;
import com.canbe.blog.content.dto.TagQueryDTO;
import com.canbe.blog.content.dto.TagUpdateDTO;
import com.canbe.blog.content.service.TagService;
import com.canbe.blog.content.vo.TagVO;
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
@RequestMapping("/api/v1/tags")
public class AdminTagController {

    private final TagService tagService;

    public AdminTagController(TagService tagService) {
        this.tagService = tagService;
    }

    @GetMapping
    public Result<PageResult<TagVO>> list(TagQueryDTO queryDTO) {
        return Result.success(tagService.list(queryDTO));
    }

    @PostMapping
    public Result<Long> create(@Valid @RequestBody TagCreateDTO createDTO) {
        return Result.success(tagService.create(createDTO));
    }

    @PutMapping("/{id}")
    public Result<Void> update(@PathVariable Long id, @Valid @RequestBody TagUpdateDTO updateDTO) {
        tagService.update(id, updateDTO);
        return Result.success(null);
    }

    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        tagService.delete(id);
        return Result.success(null);
    }
}
