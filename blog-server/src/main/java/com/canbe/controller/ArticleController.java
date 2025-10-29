package com.canbe.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.canbe.pojo.Article;
import com.canbe.pojo.Result;
import com.canbe.service.ArticleService;
import com.canbe.utils.ThreadLocalUtil;
import jakarta.annotation.Resource;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

/**
 * Article Controller - 文章控制器
 * 处理博客文章相关的CRUD操作
 * <p>
 * Controller for Article Operations - Handles CRUD operations related to blog articles
 */
@RestController
@RequestMapping("/article")
public class ArticleController {

    @Resource
    private ArticleService articleService;

    /**
     * Add article - 添加文章
     * 处理添加新文章的请求，验证文章信息并保存到数据库
     * <p>
     * Process request to add new article, validate article information and save to database
     *
     * @param article Article object with validation - 带验证的文章对象
     * @return Result Response result - 响应结果
     */
    @PostMapping
    public Result<String> add(@RequestBody @Validated Article article) {
        Map<String, Object> claims = ThreadLocalUtil.get();
        Integer id = (Integer) claims.get("id");
        article.setCreateUser(id);
        articleService.save(article);
        return Result.success();
    }

    /**
     * Get article list - 获取文章列表
     * 分页获取文章列表，支持按分类和状态筛选
     * <p>
     * Get article list with pagination, support filtering by category and status
     *
     * @param pageNum    Page number - 页码
     * @param pageSize   Page size - 每页条数
     * @param categoryId Category ID - 分类ID (可选参数)
     * @param isPublish  Article isPublish - 文章状态 (可选参数)
     * @return Result<PageBean < Article>> Paginated article list - 分页文章列表结果
     */
    @GetMapping
    public Result<IPage<Article>> list(Integer pageNum,
                                       Integer pageSize,
                                       @RequestParam(required = false) String categoryId,
                                       @RequestParam(required = false) String isPublish) {
        IPage<Article> pageBean = articleService.list(pageNum, pageSize, categoryId, isPublish);
        return Result.success(pageBean);
    }

    /**
     * Update article - 更新文章
     * 处理更新文章信息的请求，验证文章信息并更新到数据库
     * <p>
     * Process request to update article information, validate article information and update to database
     *
     * @param article Article object with validation - 带验证的文章对象
     * @return Result Response result - 响应结果
     */
    @PutMapping
    public Result<String> update(@RequestBody @Validated Article article) {
        articleService.updateById(article);
        return Result.success();
    }
}