package com.canbe.blog.content.service.impl;

import com.canbe.blog.common.BusinessException;
import com.canbe.blog.common.PageResult;
import com.canbe.blog.content.convert.ArticleConvert;
import com.canbe.blog.content.dto.ArticleCreateDTO;
import com.canbe.blog.content.dto.ArticleQueryDTO;
import com.canbe.blog.content.dto.ArticleUpdateDTO;
import com.canbe.blog.content.entity.Article;
import com.canbe.blog.content.mapper.ArticleMapper;
import com.canbe.blog.content.mapper.CategoryMapper;
import com.canbe.blog.content.mapper.TagMapper;
import com.canbe.blog.content.service.ArticleService;
import com.canbe.blog.content.vo.ArticleVO;
import com.canbe.blog.security.AuthenticatedUser;
import com.canbe.blog.security.CurrentUserContext;
import java.util.LinkedHashSet;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ArticleServiceImpl implements ArticleService {

    private static final String ADMIN_ROLE = "ADMIN";

    private final ArticleMapper articleMapper;
    private final CategoryMapper categoryMapper;
    private final TagMapper tagMapper;

    public ArticleServiceImpl(ArticleMapper articleMapper, CategoryMapper categoryMapper, TagMapper tagMapper) {
        this.articleMapper = articleMapper;
        this.categoryMapper = categoryMapper;
        this.tagMapper = tagMapper;
    }

    @Override
    public PageResult<ArticleVO> list(ArticleQueryDTO queryDTO) {
        requireAdmin();
        int page = normalizePage(queryDTO.getPage());
        int pageSize = normalizePageSize(queryDTO.getPageSize());
        queryDTO.setPage(page);
        queryDTO.setPageSize(pageSize);
        List<ArticleVO> list = articleMapper.list(queryDTO).stream()
            .map(ArticleConvert::toVO)
            .toList();
        return new PageResult<>(list, articleMapper.count(queryDTO), page, pageSize);
    }

    @Override
    public ArticleVO get(Long id) {
        requireAdmin();
        Article article = articleMapper.findById(id).orElseThrow(() -> new BusinessException(3301, "文章不存在"));
        return ArticleConvert.toVO(article);
    }

    @Override
    @Transactional
    public Long create(ArticleCreateDTO createDTO) {
        requireAdmin();
        normalize(createDTO);
        validateAssociations(createDTO.getCategoryId(), createDTO.getTagIds());
        Long articleId = articleMapper.create(createDTO);
        articleMapper.replaceTags(articleId, createDTO.getTagIds());
        return articleId;
    }

    @Override
    @Transactional
    public void update(Long id, ArticleUpdateDTO updateDTO) {
        requireAdmin();
        articleMapper.findById(id).orElseThrow(() -> new BusinessException(3301, "文章不存在"));
        normalize(updateDTO);
        validateAssociations(updateDTO.getCategoryId(), updateDTO.getTagIds());
        if (articleMapper.update(id, updateDTO) == 0) {
            throw new BusinessException(3301, "文章不存在");
        }
        articleMapper.replaceTags(id, updateDTO.getTagIds());
    }

    @Override
    @Transactional
    public void delete(Long id) {
        requireAdmin();
        articleMapper.findById(id).orElseThrow(() -> new BusinessException(3301, "文章不存在"));
        if (articleMapper.delete(id) == 0) {
            throw new BusinessException(3301, "文章不存在");
        }
        articleMapper.replaceTags(id, List.of());
    }

    private AuthenticatedUser requireAdmin() {
        AuthenticatedUser currentUser = CurrentUserContext.getRequired();
        if (!ADMIN_ROLE.equals(currentUser.getRoleCode())) {
            throw new BusinessException(2005, "权限不足");
        }
        return currentUser;
    }

    private void validateAssociations(Long categoryId, List<Long> tagIds) {
        categoryMapper.findById(categoryId).orElseThrow(() -> new BusinessException(3302, "分类不存在"));
        if (tagIds == null || tagIds.isEmpty()) {
            throw new BusinessException(3303, "至少选择一个标签");
        }
        LinkedHashSet<Long> uniqueIds = new LinkedHashSet<>(tagIds);
        if (uniqueIds.size() != tagIds.size()) {
            throw new BusinessException(3304, "标签不能重复选择");
        }
        for (Long tagId : uniqueIds) {
            tagMapper.findById(tagId).orElseThrow(() -> new BusinessException(3305, "标签不存在"));
        }
    }

    private void normalize(ArticleCreateDTO dto) {
        dto.setTitle(trim(dto.getTitle()));
        dto.setSummary(trimToEmpty(dto.getSummary()));
        dto.setContent(trim(dto.getContent()));
        dto.setCoverUrl(trimToEmpty(dto.getCoverUrl()));
        dto.setTagIds(dto.getTagIds().stream().map(Long::valueOf).toList());
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

    private String trim(String value) {
        return value == null ? "" : value.trim();
    }

    private String trimToEmpty(String value) {
        return value == null ? "" : value.trim();
    }
}
