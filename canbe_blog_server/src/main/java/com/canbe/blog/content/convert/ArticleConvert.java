package com.canbe.blog.content.convert;

import com.canbe.blog.content.entity.Article;
import com.canbe.blog.content.vo.ArticleVO;

public final class ArticleConvert {

    private ArticleConvert() {
    }

    public static ArticleVO toVO(Article article) {
        ArticleVO vo = new ArticleVO();
        vo.setId(article.getId());
        vo.setTitle(article.getTitle());
        vo.setSummary(article.getSummary());
        vo.setContent(article.getContent());
        vo.setCoverUrl(article.getCoverUrl());
        vo.setCategoryId(article.getCategoryId());
        vo.setCategoryName(article.getCategoryName());
        vo.setTagIds(article.getTagIds());
        vo.setTagNames(article.getTagNames());
        vo.setStatus(article.getStatus());
        vo.setGmtCreate(article.getGmtCreate());
        vo.setGmtModified(article.getGmtModified());
        return vo;
    }
}
