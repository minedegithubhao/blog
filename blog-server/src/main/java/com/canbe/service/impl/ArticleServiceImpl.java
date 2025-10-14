package com.canbe.service.impl;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.canbe.mapper.ArticleMapper;
import com.canbe.pojo.Article;
import com.canbe.service.ArticleService;
import com.canbe.utils.ThreadLocalUtil;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;

/**
 * Article Service Implementation - 文章服务实现类
 * Implements business logic for article operations - 实现文章操作的业务逻辑
 * <p>
 * This class provides the implementation of ArticleService interface
 * 该类提供了ArticleService接口的实现
 */
@Service
public class ArticleServiceImpl extends ServiceImpl<ArticleMapper, Article> implements ArticleService {

    @Resource
    private ArticleMapper articleMapper;

    /**
     * Get article list with pagination - 分页获取文章列表
     * Retrieve articles with pagination support and optional filtering by category and isPublish
     * 分页获取文章，并支持按分类和状态筛选
     *
     * @param pageNum    Page number - 页码
     * @param pageSize   Page size - 每页条数
     * @param categoryId Category ID filter - 分类ID筛选条件 (optional - 可选参数)
     * @param isPublish  Article isPublish filter - 文章状态筛选条件 (optional - 可选参数)
     * @return PageBean containing articles and pagination information - 包含文章和分页信息的PageBean对象
     */
    @Override
    public IPage<Article> list(Integer pageNum, Integer pageSize, String categoryId, String isPublish) {

        // 使用MyBatis Plus分页功能
        Page<Article> page = new Page<>(pageNum, pageSize);

        // 执行分页查询
        return articleMapper.list(page, categoryId, isPublish);
    }

}