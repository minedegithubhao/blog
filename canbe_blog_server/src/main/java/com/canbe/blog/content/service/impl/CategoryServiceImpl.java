package com.canbe.blog.content.service.impl;

import com.canbe.blog.common.BusinessException;
import com.canbe.blog.common.PageResult;
import com.canbe.blog.content.convert.CategoryConvert;
import com.canbe.blog.content.dto.CategoryCreateDTO;
import com.canbe.blog.content.dto.CategoryQueryDTO;
import com.canbe.blog.content.dto.CategoryUpdateDTO;
import com.canbe.blog.content.entity.Category;
import com.canbe.blog.content.mapper.CategoryMapper;
import com.canbe.blog.content.service.CategoryService;
import com.canbe.blog.content.vo.CategoryVO;
import com.canbe.blog.security.AuthenticatedUser;
import com.canbe.blog.security.CurrentUserContext;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CategoryServiceImpl implements CategoryService {

    private static final String ADMIN_ROLE = "ADMIN";

    private final CategoryMapper categoryMapper;

    public CategoryServiceImpl(CategoryMapper categoryMapper) {
        this.categoryMapper = categoryMapper;
    }

    @Override
    public PageResult<CategoryVO> list(CategoryQueryDTO queryDTO) {
        requireAdmin();
        int page = normalizePage(queryDTO.getPage());
        int pageSize = normalizePageSize(queryDTO.getPageSize());
        queryDTO.setPage(page);
        queryDTO.setPageSize(pageSize);
        List<CategoryVO> list = categoryMapper.list(queryDTO).stream()
            .map(CategoryConvert::toVO)
            .toList();
        return new PageResult<>(list, categoryMapper.count(queryDTO), page, pageSize);
    }

    @Override
    @Transactional
    public Long create(CategoryCreateDTO createDTO) {
        requireAdmin();
        normalize(createDTO);
        validateUnique(createDTO.getName(), createDTO.getSlug(), null);
        return categoryMapper.create(createDTO);
    }

    @Override
    @Transactional
    public void update(Long id, CategoryUpdateDTO updateDTO) {
        requireAdmin();
        Category category = categoryMapper.findById(id).orElseThrow(() -> new BusinessException(3101, "分类不存在"));
        normalize(updateDTO);
        validateUnique(updateDTO.getName(), updateDTO.getSlug(), category.getId());
        if (categoryMapper.update(category.getId(), updateDTO) == 0) {
            throw new BusinessException(3101, "分类不存在");
        }
    }

    @Override
    @Transactional
    public void delete(Long id) {
        requireAdmin();
        categoryMapper.findById(id).orElseThrow(() -> new BusinessException(3101, "分类不存在"));
        if (categoryMapper.delete(id) == 0) {
            throw new BusinessException(3101, "分类不存在");
        }
    }

    private AuthenticatedUser requireAdmin() {
        AuthenticatedUser currentUser = CurrentUserContext.getRequired();
        if (!ADMIN_ROLE.equals(currentUser.getRoleCode())) {
            throw new BusinessException(2005, "权限不足");
        }
        return currentUser;
    }

    private void validateUnique(String name, String slug, Long currentId) {
        if (currentId == null) {
            if (categoryMapper.existsByName(name)) {
                throw new BusinessException(3102, "分类名称已存在");
            }
            if (categoryMapper.existsBySlug(slug)) {
                throw new BusinessException(3103, "分类 slug 已存在");
            }
            return;
        }
        if (categoryMapper.existsByNameExceptId(name, currentId)) {
            throw new BusinessException(3102, "分类名称已存在");
        }
        if (categoryMapper.existsBySlugExceptId(slug, currentId)) {
            throw new BusinessException(3103, "分类 slug 已存在");
        }
    }

    private void normalize(CategoryCreateDTO dto) {
        dto.setName(trim(dto.getName()));
        dto.setSlug(trim(dto.getSlug()));
        dto.setDescription(trimToEmpty(dto.getDescription()));
        dto.setSortOrder(dto.getSortOrder() == null ? 0 : dto.getSortOrder());
        dto.setStatus(dto.getStatus() == null ? 1 : dto.getStatus());
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
