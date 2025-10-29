package com.canbe.pojo;

import lombok.Getter;
import lombok.Setter;

/**
 * <p>
 * 文章及分类信息 DTO
 * </p>
 *
 * @author canbe
 * @since 2025-10-30
 */
@Getter
@Setter
public class SysArticleDto extends SysArticle {
    /**
     * 分类名称
     */
    private String categoryName;
    
    public void setCategoryId(Integer categoryId) {
        // 修复类型不匹配问题
        super.setCategoryId(categoryId);
    }
}