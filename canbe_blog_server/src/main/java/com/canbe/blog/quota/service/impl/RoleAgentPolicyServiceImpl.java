package com.canbe.blog.quota.service.impl;

import com.canbe.blog.common.BusinessException;
import com.canbe.blog.common.PageResult;
import com.canbe.blog.quota.convert.QuotaConvert;
import com.canbe.blog.quota.dto.RoleAgentPolicyQueryDTO;
import com.canbe.blog.quota.dto.RoleAgentPolicyUpdateDTO;
import com.canbe.blog.quota.mapper.RoleAgentPolicyMapper;
import com.canbe.blog.quota.service.RoleAgentPolicyService;
import com.canbe.blog.quota.vo.RoleAgentPolicyVO;
import com.canbe.blog.security.AuthenticatedUser;
import com.canbe.blog.security.CurrentUserContext;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class RoleAgentPolicyServiceImpl implements RoleAgentPolicyService {

    private static final String ADMIN_ROLE = "ADMIN";

    private final RoleAgentPolicyMapper roleAgentPolicyMapper;

    public RoleAgentPolicyServiceImpl(RoleAgentPolicyMapper roleAgentPolicyMapper) {
        this.roleAgentPolicyMapper = roleAgentPolicyMapper;
    }

    @Override
    public PageResult<RoleAgentPolicyVO> list(RoleAgentPolicyQueryDTO queryDTO) {
        requireAdmin();
        int page = normalizePage(queryDTO.getPage());
        int pageSize = normalizePageSize(queryDTO.getPageSize());
        queryDTO.setPage(page);
        queryDTO.setPageSize(pageSize);
        List<RoleAgentPolicyVO> list = roleAgentPolicyMapper.list(queryDTO).stream()
            .map(QuotaConvert::toVO)
            .toList();
        return new PageResult<>(list, roleAgentPolicyMapper.count(queryDTO), page, pageSize);
    }

    @Override
    @Transactional
    public void update(Long id, RoleAgentPolicyUpdateDTO updateDTO) {
        requireAdmin();
        roleAgentPolicyMapper.findById(id).orElseThrow(() -> new BusinessException(5003, "角色Agent策略不存在"));
        if (roleAgentPolicyMapper.update(id, updateDTO.getEnabled(), updateDTO.getTotalQuota()) == 0) {
            throw new BusinessException(5003, "角色Agent策略不存在");
        }
    }

    private AuthenticatedUser requireAdmin() {
        AuthenticatedUser currentUser = CurrentUserContext.getRequired();
        if (!ADMIN_ROLE.equals(currentUser.getRoleCode())) {
            throw new BusinessException(2005, "权限不足");
        }
        return currentUser;
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
