package com.canbe.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.canbe.pojo.Article;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface ArticleMapper extends BaseMapper<Article> {
    /**
     * Get article list - 获取文章列表
     * Query articles based on category ID and state with pagination
     * 根据分类ID和状态分页查询文章
     *
     * @param page 分页对象
     * @param categoryId Category ID filter - 分类ID筛选条件 (optional - 可选参数)
     * @param isPublish      Article isPublish filter - 文章状态筛选条件 (optional - 可选参数)
     * @return 分页结果
     */
    IPage<Article> list(Page<Article> page, @Param("categoryId") String categoryId, @Param("isPublish") String isPublish);
}