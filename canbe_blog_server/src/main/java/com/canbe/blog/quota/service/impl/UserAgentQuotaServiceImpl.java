package com.canbe.blog.quota.service.impl;

import com.canbe.blog.common.BusinessException;
import com.canbe.blog.common.PageResult;
import com.canbe.blog.quota.convert.QuotaConvert;
import com.canbe.blog.quota.dto.UserAgentQuotaQueryDTO;
import com.canbe.blog.quota.dto.UserAgentQuotaUpdateDTO;
import com.canbe.blog.quota.entity.UserAgentQuota;
import com.canbe.blog.quota.mapper.UserAgentQuotaMapper;
import com.canbe.blog.quota.service.UserAgentQuotaService;
import com.canbe.blog.quota.vo.UserAgentQuotaVO;
import com.canbe.blog.security.AuthenticatedUser;
import com.canbe.blog.security.CurrentUserContext;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserAgentQuotaServiceImpl implements UserAgentQuotaService {

    private static final String ADMIN_ROLE = "ADMIN";

    private final UserAgentQuotaMapper userAgentQuotaMapper;

    public UserAgentQuotaServiceImpl(UserAgentQuotaMapper userAgentQuotaMapper) {
        this.userAgentQuotaMapper = userAgentQuotaMapper;
    }

    @Override
    public PageResult<UserAgentQuotaVO> list(UserAgentQuotaQueryDTO queryDTO) {
        requireAdmin();
        int page = normalizePage(queryDTO.getPage());
        int pageSize = normalizePageSize(queryDTO.getPageSize());
        queryDTO.setPage(page);
        queryDTO.setPageSize(pageSize);
        List<UserAgentQuotaVO> list = userAgentQuotaMapper.list(queryDTO).stream()
            .map(QuotaConvert::toVO)
            .toList();
        return new PageResult<>(list, userAgentQuotaMapper.count(queryDTO), page, pageSize);
    }

    @Override
    @Transactional
    public void update(Long id, UserAgentQuotaUpdateDTO updateDTO) {
        requireAdmin();
        UserAgentQuota quota = userAgentQuotaMapper.findById(id)
            .orElseThrow(() -> new BusinessException(5001, "用户额度不存在"));
        int totalQuota = updateDTO.getTotalQuota();
        if (totalQuota < quota.getUsedQuota()) {
            throw new BusinessException(5002, "总额度不能小于已用次数");
        }
        int remainingQuota = totalQuota - quota.getUsedQuota();
        if (userAgentQuotaMapper.update(quota.getId(), totalQuota, remainingQuota) == 0) {
            throw new BusinessException(5001, "用户额度不存在");
        }
    }

    @Override
    public void checkAvailable(Long userId, Long agentId) {
        UserAgentQuota quota = userAgentQuotaMapper.findByUserAndAgent(userId, agentId)
            .orElseThrow(() -> new BusinessException(5003, "Agent额度未初始化"));
        if (quota.getRemainingQuota() <= 0) {
            throw new BusinessException(5004, "Agent体验次数不足");
        }
    }

    @Override
    @Transactional
    public int consumeOne(Long userId, Long agentId) {
        return userAgentQuotaMapper.consumeOne(userId, agentId);
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
