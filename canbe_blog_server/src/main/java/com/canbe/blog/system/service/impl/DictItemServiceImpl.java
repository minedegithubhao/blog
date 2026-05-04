package com.canbe.blog.system.service.impl;

import com.canbe.blog.common.BusinessException;
import com.canbe.blog.common.PageResult;
import com.canbe.blog.security.AuthenticatedUser;
import com.canbe.blog.security.CurrentUserContext;
import com.canbe.blog.system.convert.DictItemConvert;
import com.canbe.blog.system.dto.DictItemCreateDTO;
import com.canbe.blog.system.dto.DictItemQueryDTO;
import com.canbe.blog.system.dto.DictItemUpdateDTO;
import com.canbe.blog.system.entity.DictItem;
import com.canbe.blog.system.mapper.DictItemMapper;
import com.canbe.blog.system.service.DictItemService;
import com.canbe.blog.system.vo.DictItemVO;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DictItemServiceImpl implements DictItemService {

    private static final String ADMIN_ROLE = "ADMIN";

    private final DictItemMapper dictItemMapper;

    public DictItemServiceImpl(DictItemMapper dictItemMapper) {
        this.dictItemMapper = dictItemMapper;
    }

    @Override
    public PageResult<DictItemVO> list(DictItemQueryDTO queryDTO) {
        requireAdmin();
        int page = normalizePage(queryDTO.getPage());
        int pageSize = normalizePageSize(queryDTO.getPageSize());
        queryDTO.setPage(page);
        queryDTO.setPageSize(pageSize);
        List<DictItemVO> list = dictItemMapper.list(queryDTO).stream()
            .map(DictItemConvert::toVO)
            .toList();
        return new PageResult<>(list, dictItemMapper.count(queryDTO), page, pageSize);
    }

    @Override
    @Transactional
    public Long create(DictItemCreateDTO createDTO) {
        requireAdmin();
        normalize(createDTO);
        validateUnique(createDTO.getTypeCode(), createDTO.getItemValue(), null);
        return dictItemMapper.create(createDTO);
    }

    @Override
    @Transactional
    public void update(Long id, DictItemUpdateDTO updateDTO) {
        requireAdmin();
        DictItem item = dictItemMapper.findById(id).orElseThrow(() -> new BusinessException(7101, "字典项不存在"));
        normalize(updateDTO);
        validateUnique(updateDTO.getTypeCode(), updateDTO.getItemValue(), item.getId());
        if (dictItemMapper.update(item.getId(), updateDTO) == 0) {
            throw new BusinessException(7101, "字典项不存在");
        }
    }

    @Override
    @Transactional
    public void delete(Long id) {
        requireAdmin();
        dictItemMapper.findById(id).orElseThrow(() -> new BusinessException(7101, "字典项不存在"));
        if (dictItemMapper.delete(id) == 0) {
            throw new BusinessException(7101, "字典项不存在");
        }
    }

    private AuthenticatedUser requireAdmin() {
        AuthenticatedUser currentUser = CurrentUserContext.getRequired();
        if (!ADMIN_ROLE.equals(currentUser.getRoleCode())) {
            throw new BusinessException(2005, "权限不足");
        }
        return currentUser;
    }

    private void validateUnique(String typeCode, String itemValue, Long currentId) {
        if (currentId == null) {
            if (dictItemMapper.existsByTypeAndValue(typeCode, itemValue)) {
                throw new BusinessException(7102, "同类型字典值已存在");
            }
            return;
        }
        if (dictItemMapper.existsByTypeAndValueExceptId(typeCode, itemValue, currentId)) {
            throw new BusinessException(7102, "同类型字典值已存在");
        }
    }

    private void normalize(DictItemCreateDTO dto) {
        dto.setTypeCode(trim(dto.getTypeCode()));
        dto.setTypeName(trim(dto.getTypeName()));
        dto.setItemLabel(trim(dto.getItemLabel()));
        dto.setItemValue(trim(dto.getItemValue()));
        dto.setRemark(trimToEmpty(dto.getRemark()));
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
