package com.canbe.blog.content.controller;

import com.canbe.blog.common.PageResult;
import com.canbe.blog.common.Result;
import com.canbe.blog.content.dto.ArticleCreateDTO;
import com.canbe.blog.content.dto.ArticleQueryDTO;
import com.canbe.blog.content.dto.ArticleUpdateDTO;
import com.canbe.blog.content.service.ArticleService;
import com.canbe.blog.content.vo.ArticleVO;
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
@RequestMapping("/api/v1/articles")
public class AdminArticleController {

    private final ArticleService articleService;

    public AdminArticleController(ArticleService articleService) {
        this.articleService = articleService;
    }

    @GetMapping
    public Result<PageResult<ArticleVO>> list(ArticleQueryDTO queryDTO) {
        return Result.success(articleService.list(queryDTO));
    }

    @GetMapping("/{id}")
    public Result<ArticleVO> get(@PathVariable Long id) {
        return Result.success(articleService.get(id));
    }

    @PostMapping
    public Result<Long> create(@Valid @RequestBody ArticleCreateDTO createDTO) {
        return Result.success(articleService.create(createDTO));
    }

    @PutMapping("/{id}")
    public Result<Void> update(@PathVariable Long id, @Valid @RequestBody ArticleUpdateDTO updateDTO) {
        articleService.update(id, updateDTO);
        return Result.success(null);
    }

    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        articleService.delete(id);
        return Result.success(null);
    }
}
