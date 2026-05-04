package com.canbe.blog.quota.service;

import com.canbe.blog.common.PageResult;
import com.canbe.blog.quota.dto.UserAgentQuotaQueryDTO;
import com.canbe.blog.quota.dto.UserAgentQuotaUpdateDTO;
import com.canbe.blog.quota.vo.UserAgentQuotaVO;

public interface UserAgentQuotaService {

    PageResult<UserAgentQuotaVO> list(UserAgentQuotaQueryDTO queryDTO);

    void update(Long id, UserAgentQuotaUpdateDTO updateDTO);

    void checkAvailable(Long userId, Long agentId);

    int consumeOne(Long userId, Long agentId);
}
