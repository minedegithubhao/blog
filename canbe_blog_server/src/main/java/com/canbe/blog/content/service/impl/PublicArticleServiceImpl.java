package com.canbe.blog.content.service.impl;

import com.canbe.blog.common.BusinessException;
import com.canbe.blog.common.PageResult;
import com.canbe.blog.content.convert.ArticleConvert;
import com.canbe.blog.content.dto.ArticleQueryDTO;
import com.canbe.blog.content.entity.Article;
import com.canbe.blog.content.mapper.ArticleMapper;
import com.canbe.blog.content.service.PublicArticleService;
import com.canbe.blog.content.vo.ArticleVO;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class PublicArticleServiceImpl implements PublicArticleService {

    private final ArticleMapper articleMapper;

    public PublicArticleServiceImpl(ArticleMapper articleMapper) {
        this.articleMapper = articleMapper;
    }

    @Override
    public PageResult<ArticleVO> list(ArticleQueryDTO queryDTO) {
        int page = normalizePage(queryDTO.getPage());
        int pageSize = normalizePageSize(queryDTO.getPageSize());
        queryDTO.setPage(page);
        queryDTO.setPageSize(pageSize);
        List<ArticleVO> list = articleMapper.listPublished(queryDTO).stream()
            .map(ArticleConvert::toVO)
            .toList();
        return new PageResult<>(list, articleMapper.countPublished(queryDTO), page, pageSize);
    }

    @Override
    public ArticleVO get(Long id) {
        Article article = articleMapper.findPublishedById(id)
            .orElseThrow(() -> new BusinessException(3301, "文章不存在"));
        return ArticleConvert.toVO(article);
    }

    private int normalizePage(Integer page) {
        return page == null || page < 1 ? 1 : page;
    }

    private int normalizePageSize(Integer pageSize) {
        if (pageSize == null || pageSize < 1) {
            return 20;
        }
        return Math.min(pageSize, 100);
    }
}
