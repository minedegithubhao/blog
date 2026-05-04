package com.canbe.blog.user.service.impl;

import com.canbe.blog.common.BusinessException;
import com.canbe.blog.common.PageResult;
import com.canbe.blog.quota.service.QuotaInitializationService;
import com.canbe.blog.security.AuthenticatedUser;
import com.canbe.blog.security.CurrentUserContext;
import com.canbe.blog.user.convert.RoleConvert;
import com.canbe.blog.user.dto.RoleCreateDTO;
import com.canbe.blog.user.dto.RoleQueryDTO;
import com.canbe.blog.user.dto.RoleUpdateDTO;
import com.canbe.blog.user.entity.Role;
import com.canbe.blog.user.mapper.BlogAccountMapper;
import com.canbe.blog.user.mapper.RoleMapper;
import com.canbe.blog.user.service.RoleService;
import com.canbe.blog.user.vo.RoleVO;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class RoleServiceImpl implements RoleService {

    private static final String ADMIN_ROLE = "ADMIN";

    private final RoleMapper roleMapper;
    private final BlogAccountMapper blogAccountMapper;
    private final QuotaInitializationService quotaInitializationService;

    public RoleServiceImpl(RoleMapper roleMapper, BlogAccountMapper blogAccountMapper, QuotaInitializationService quotaInitializationService) {
        this.roleMapper = roleMapper;
        this.blogAccountMapper = blogAccountMapper;
        this.quotaInitializationService = quotaInitializationService;
    }

    @Override
    public PageResult<RoleVO> list(RoleQueryDTO queryDTO) {
        requireAdmin();
        int page = normalizePage(queryDTO.getPage());
        int pageSize = normalizePageSize(queryDTO.getPageSize());
        queryDTO.setPage(page);
        queryDTO.setPageSize(pageSize);
        List<RoleVO> list = roleMapper.list(queryDTO).stream()
            .map(RoleConvert::toVO)
            .toList();
        return new PageResult<>(list, roleMapper.count(queryDTO), page, pageSize);
    }

    @Override
    @Transactional
    public Long create(RoleCreateDTO createDTO) {
        requireAdmin();
        normalize(createDTO);
        validateUnique(createDTO.getName(), createDTO.getCode(), null);
        Long roleId = roleMapper.create(createDTO);
        quotaInitializationService.initializeRolePolicies(createDTO.getCode());
        return roleId;
    }

    @Override
    @Transactional
    public void update(Long id, RoleUpdateDTO updateDTO) {
        requireAdmin();
        Role role = roleMapper.findById(id).orElseThrow(() -> new BusinessException(2201, "角色不存在"));
        normalize(updateDTO);
        validateUnique(updateDTO.getName(), updateDTO.getCode(), role.getId());
        if (!role.getCode().equals(updateDTO.getCode()) && blogAccountMapper.existsByRoleCode(role.getCode())) {
            throw new BusinessException(2204, "当前角色已被账号使用，不能修改角色编码");
        }
        if (Integer.valueOf(0).equals(updateDTO.getStatus()) && blogAccountMapper.existsByRoleCode(role.getCode())) {
            throw new BusinessException(2205, "当前角色已被账号使用，不能停用");
        }
        if (roleMapper.update(role.getId(), updateDTO) == 0) {
            throw new BusinessException(2201, "角色不存在");
        }
    }

    @Override
    @Transactional
    public void delete(Long id) {
        requireAdmin();
        Role role = roleMapper.findById(id).orElseThrow(() -> new BusinessException(2201, "角色不存在"));
        if (blogAccountMapper.existsByRoleCode(role.getCode())) {
            throw new BusinessException(2206, "当前角色已被账号使用，不能删除");
        }
        if (roleMapper.delete(role.getId()) == 0) {
            throw new BusinessException(2201, "角色不存在");
        }
    }

    private AuthenticatedUser requireAdmin() {
        AuthenticatedUser currentUser = CurrentUserContext.getRequired();
        if (!ADMIN_ROLE.equals(currentUser.getRoleCode())) {
            throw new BusinessException(2005, "权限不足");
        }
        return currentUser;
    }

    private void validateUnique(String name, String code, Long currentId) {
        if (currentId == null) {
            if (roleMapper.existsByName(name)) {
                throw new BusinessException(2202, "角色名称已存在");
            }
            if (roleMapper.existsByCode(code)) {
                throw new BusinessException(2203, "角色编码已存在");
            }
            return;
        }

        if (roleMapper.existsByNameExceptId(name, currentId)) {
            throw new BusinessException(2202, "角色名称已存在");
        }
        if (roleMapper.existsByCodeExceptId(code, currentId)) {
            throw new BusinessException(2203, "角色编码已存在");
        }
    }

    private void normalize(RoleCreateDTO dto) {
        dto.setName(trim(dto.getName()));
        dto.setCode(trim(dto.getCode()).toUpperCase());
        dto.setDescription(trimToEmpty(dto.getDescription()));
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
