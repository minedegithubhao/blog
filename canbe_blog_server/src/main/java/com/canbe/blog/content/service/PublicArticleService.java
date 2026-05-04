package com.canbe.blog.content.service;

import com.canbe.blog.common.PageResult;
import com.canbe.blog.content.dto.ArticleQueryDTO;
import com.canbe.blog.content.vo.ArticleVO;

public interface PublicArticleService {

    PageResult<ArticleVO> list(ArticleQueryDTO queryDTO);

    ArticleVO get(Long id);
}
