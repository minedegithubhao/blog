package com.canbe.blog.content.convert;

import com.canbe.blog.content.entity.Category;
import com.canbe.blog.content.vo.CategoryVO;

public final class CategoryConvert {

    private CategoryConvert() {
    }

    public static CategoryVO toVO(Category category) {
        CategoryVO vo = new CategoryVO();
        vo.setId(category.getId());
        vo.setName(category.getName());
        vo.setSlug(category.getSlug());
        vo.setDescription(category.getDescription());
        vo.setSortOrder(category.getSortOrder());
        vo.setStatus(category.getStatus());
        vo.setGmtCreate(category.getGmtCreate());
        vo.setGmtModified(category.getGmtModified());
        return vo;
    }
}
