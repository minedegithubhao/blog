package com.canbe.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.canbe.pojo.Article;
import com.canbe.pojo.Category;
import com.canbe.pojo.Result;
import com.canbe.service.ArticleService;
import com.canbe.service.CategoryService;
import jakarta.annotation.Resource;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Public API Controller - 公共API控制器
 * 提供公开访问的API接口，无需用户登录即可访问博客文章、分类等信息
 * 
 * Provides public access API interfaces that can be accessed without user login 
 * to retrieve blog articles, categories and other information
 */
@RestController
@RequestMapping("/public")
public class PublicApiController {

    @Resource
    private ArticleService articleService;
    @Resource
    private CategoryService categoryService;

    /**
     * Get article list - 获取文章列表
     * 分页获取文章列表，支持按分类和状态筛选
     * 
     * Get article list with pagination, support filtering by category and status
     *
     * @param pageNum    Page number - 页码
     * @param pageSize   Page size - 每页条数
     * @param categoryId Category ID - 分类ID (可选参数)
     * @param state      Article state - 文章状态 (可选参数)
     * @return Result<PageBean<Article>> Paginated article list - 分页文章列表结果
     */
    @GetMapping("/article/list")
    public Result<IPage<Article>> articleList(Integer pageNum,
                                          Integer pageSize,
                                          @RequestParam(required = false) String categoryId,
                                          @RequestParam(required = false) String state) {
        IPage<Article> pageBean = articleService.list(pageNum, pageSize, categoryId, state);
        return Result.success(pageBean);
    }

    /**
     * Get article detail - 获取文章详情
     * 根据文章ID获取文章详细信息
     * 
     * Get article details by article ID
     *
     * @param id Article ID - 文章ID
     * @return Result<Article> Article detail - 文章详情结果
     */
    @GetMapping("/article/detail")
    public Result<Article> articleDetail(Integer id) {
        Article article = articleService.getById(id);
        return Result.success(article);
    }

    /**
     * Get article categories - 获取文章分类
     * 获取所有文章分类信息
     * 
     * Get all article category information
     *
     * @return Result<List<Category>> Category list - 分类列表结果
     */
    @GetMapping("/article/category")
    public Result<List<Category>> articleCategory() {
        List<Category> list = categoryService.list(null);
        return Result.success(list);
    }
}
