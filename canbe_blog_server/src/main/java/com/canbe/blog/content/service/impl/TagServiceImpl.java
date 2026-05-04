package com.canbe.blog.content.service.impl;

import com.canbe.blog.common.BusinessException;
import com.canbe.blog.common.PageResult;
import com.canbe.blog.content.convert.TagConvert;
import com.canbe.blog.content.dto.TagCreateDTO;
import com.canbe.blog.content.dto.TagQueryDTO;
import com.canbe.blog.content.dto.TagUpdateDTO;
import com.canbe.blog.content.entity.Tag;
import com.canbe.blog.content.mapper.TagMapper;
import com.canbe.blog.content.service.TagService;
import com.canbe.blog.content.vo.TagVO;
import com.canbe.blog.security.AuthenticatedUser;
import com.canbe.blog.security.CurrentUserContext;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class TagServiceImpl implements TagService {

    private static final String ADMIN_ROLE = "ADMIN";

    private final TagMapper tagMapper;

    public TagServiceImpl(TagMapper tagMapper) {
        this.tagMapper = tagMapper;
    }

    @Override
    public PageResult<TagVO> list(TagQueryDTO queryDTO) {
        requireAdmin();
        int page = normalizePage(queryDTO.getPage());
        int pageSize = normalizePageSize(queryDTO.getPageSize());
        queryDTO.setPage(page);
        queryDTO.setPageSize(pageSize);
        List<TagVO> list = tagMapper.list(queryDTO).stream()
            .map(TagConvert::toVO)
            .toList();
        return new PageResult<>(list, tagMapper.count(queryDTO), page, pageSize);
    }

    @Override
    @Transactional
    public Long create(TagCreateDTO createDTO) {
        requireAdmin();
        normalize(createDTO);
        validateUnique(createDTO.getName(), createDTO.getSlug(), null);
        return tagMapper.create(createDTO);
    }

    @Override
    @Transactional
    public void update(Long id, TagUpdateDTO updateDTO) {
        requireAdmin();
        Tag tag = tagMapper.findById(id).orElseThrow(() -> new BusinessException(3201, "标签不存在"));
        normalize(updateDTO);
        validateUnique(updateDTO.getName(), updateDTO.getSlug(), tag.getId());
        if (tagMapper.update(tag.getId(), updateDTO) == 0) {
            throw new BusinessException(3201, "标签不存在");
        }
    }

    @Override
    @Transactional
    public void delete(Long id) {
        requireAdmin();
        tagMapper.findById(id).orElseThrow(() -> new BusinessException(3201, "标签不存在"));
        if (tagMapper.delete(id) == 0) {
            throw new BusinessException(3201, "标签不存在");
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
            if (tagMapper.existsByName(name)) {
                throw new BusinessException(3202, "标签名称已存在");
            }
            if (tagMapper.existsBySlug(slug)) {
                throw new BusinessException(3203, "标签 slug 已存在");
            }
            return;
        }
        if (tagMapper.existsByNameExceptId(name, currentId)) {
            throw new BusinessException(3202, "标签名称已存在");
        }
        if (tagMapper.existsBySlugExceptId(slug, currentId)) {
            throw new BusinessException(3203, "标签 slug 已存在");
        }
    }

    private void normalize(TagCreateDTO dto) {
        dto.setName(trim(dto.getName()));
        dto.setSlug(trim(dto.getSlug()));
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
}
