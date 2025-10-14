package com.canbe.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.service.IService;
import com.canbe.pojo.Article;

/**
 * Article Service - 文章业务逻辑接口
 * Provides business logic operations for articles - 提供文章的业务逻辑操作
 * 
 * This interface handles the business logic related to article operations
 * 该接口处理与文章操作相关的业务逻辑
 */
public interface ArticleService extends IService<Article> {

    /**
     * Get article list with pagination - 分页获取文章列表
     * Retrieve articles with pagination support
     * 分页获取文章
     *
     * @param pageNum    Page number - 页码
     * @param pageSize   Page size - 每页条数
     * @param categoryId Category ID filter - 分类ID筛选条件 (optional - 可选参数)
     * @param state      Article state filter - 文章状态筛选条件 (optional - 可选参数)
     * @return PageBean containing articles and pagination information - 包含文章和分页信息的PageBean对象
     */
    IPage<Article> list(Integer pageNum, Integer pageSize, String categoryId, String isPublish);

}