package com.canbe.blog.content.service;

import com.canbe.blog.common.PageResult;
import com.canbe.blog.content.dto.ArticleCreateDTO;
import com.canbe.blog.content.dto.ArticleQueryDTO;
import com.canbe.blog.content.dto.ArticleUpdateDTO;
import com.canbe.blog.content.vo.ArticleVO;

public interface ArticleService {

    PageResult<ArticleVO> list(ArticleQueryDTO queryDTO);

    ArticleVO get(Long id);

    Long create(ArticleCreateDTO createDTO);

    void update(Long id, ArticleUpdateDTO updateDTO);

    void delete(Long id);
}
