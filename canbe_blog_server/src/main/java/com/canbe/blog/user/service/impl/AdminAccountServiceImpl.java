package com.canbe.blog.user.service.impl;

import com.canbe.blog.common.BusinessException;
import com.canbe.blog.common.PageResult;
import com.canbe.blog.quota.service.QuotaInitializationService;
import com.canbe.blog.security.AuthenticatedUser;
import com.canbe.blog.security.CurrentUserContext;
import com.canbe.blog.security.PasswordHashService;
import com.canbe.blog.user.convert.BlogAccountConvert;
import com.canbe.blog.user.dto.AdminAccountCreateDTO;
import com.canbe.blog.user.dto.AdminAccountQueryDTO;
import com.canbe.blog.user.dto.AdminAccountUpdateDTO;
import com.canbe.blog.user.entity.BlogAccount;
import com.canbe.blog.user.mapper.BlogAccountMapper;
import com.canbe.blog.user.mapper.RoleMapper;
import com.canbe.blog.user.service.AdminAccountService;
import com.canbe.blog.user.vo.AdminAccountVO;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AdminAccountServiceImpl implements AdminAccountService {

    private static final String ADMIN_ROLE = "ADMIN";

    private final BlogAccountMapper blogAccountMapper;
    private final RoleMapper roleMapper;
    private final PasswordHashService passwordHashService;
    private final QuotaInitializationService quotaInitializationService;

    public AdminAccountServiceImpl(
        BlogAccountMapper blogAccountMapper,
        RoleMapper roleMapper,
        PasswordHashService passwordHashService,
        QuotaInitializationService quotaInitializationService
    ) {
        this.blogAccountMapper = blogAccountMapper;
        this.roleMapper = roleMapper;
        this.passwordHashService = passwordHashService;
        this.quotaInitializationService = quotaInitializationService;
    }

    @Override
    public PageResult<AdminAccountVO> list(AdminAccountQueryDTO queryDTO) {
        requireAdmin();
        int page = normalizePage(queryDTO.getPage());
        int pageSize = normalizePageSize(queryDTO.getPageSize());
        queryDTO.setPage(page);
        queryDTO.setPageSize(pageSize);
        List<AdminAccountVO> list = blogAccountMapper.list(queryDTO).stream()
            .map(BlogAccountConvert::toAdminAccountVO)
            .toList();
        return new PageResult<>(list, blogAccountMapper.count(queryDTO), page, pageSize);
    }

    @Override
    @Transactional
    public Long create(AdminAccountCreateDTO createDTO) {
        requireAdmin();
        createDTO.setUsername(trim(createDTO.getUsername()));
        createDTO.setEmail(trimToNull(createDTO.getEmail()));
        createDTO.setNickname(trim(createDTO.getNickname()));
        createDTO.setRoleCode(trim(createDTO.getRoleCode()));
        if (blogAccountMapper.existsByUsername(createDTO.getUsername())) {
            throw new BusinessException(2101, "用户名已存在");
        }
        if (blogAccountMapper.existsByEmailExceptId(createDTO.getEmail(), 0L)) {
            throw new BusinessException(2102, "邮箱已存在");
        }
        validateRole(createDTO.getRoleCode());
        String passwordHash = passwordHashService.encode(createDTO.getPassword());
        Long accountId = blogAccountMapper.create(createDTO, passwordHash);
        quotaInitializationService.initializeUserQuotas(accountId, createDTO.getRoleCode());
        return accountId;
    }

    @Override
    @Transactional
    public void update(Long id, AdminAccountUpdateDTO updateDTO) {
        AuthenticatedUser currentUser = requireAdmin();
        BlogAccount account = blogAccountMapper.findById(id)
            .orElseThrow(() -> new BusinessException(2103, "账号不存在"));
        updateDTO.setEmail(trimToNull(updateDTO.getEmail()));
        updateDTO.setNickname(trim(updateDTO.getNickname()));
        updateDTO.setRoleCode(trim(updateDTO.getRoleCode()));
        if (blogAccountMapper.existsByEmailExceptId(updateDTO.getEmail(), account.getId())) {
            throw new BusinessException(2102, "邮箱已存在");
        }
        validateRole(updateDTO.getRoleCode());
        if (account.getId().equals(currentUser.getAccountId())
            && (!ADMIN_ROLE.equals(updateDTO.getRoleCode()) || Integer.valueOf(0).equals(updateDTO.getStatus()))) {
            throw new BusinessException(2104, "不能停用或降级当前登录账号");
        }
        if (blogAccountMapper.update(account.getId(), updateDTO) == 0) {
            throw new BusinessException(2103, "账号不存在");
        }
    }

    @Override
    @Transactional
    public void delete(Long id) {
        AuthenticatedUser currentUser = requireAdmin();
        BlogAccount account = blogAccountMapper.findById(id)
            .orElseThrow(() -> new BusinessException(2103, "账号不存在"));
        if (account.getId().equals(currentUser.getAccountId())) {
            throw new BusinessException(2105, "不能删除当前登录账号");
        }
        if (blogAccountMapper.delete(account.getId()) == 0) {
            throw new BusinessException(2103, "账号不存在");
        }
    }

    private AuthenticatedUser requireAdmin() {
        AuthenticatedUser currentUser = CurrentUserContext.getRequired();
        if (!ADMIN_ROLE.equals(currentUser.getRoleCode())) {
            throw new BusinessException(2005, "权限不足");
        }
        return currentUser;
    }

    private void validateRole(String roleCode) {
        roleMapper.findByCode(roleCode)
            .orElseThrow(() -> new BusinessException(2106, "角色不存在"));
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

    private String trimToNull(String value) {
        if (value == null || value.trim().isEmpty()) {
            return null;
        }
        return value.trim();
    }
}
