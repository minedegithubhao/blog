package com.canbe.blog.quota.service.impl;

import com.canbe.blog.agent.mapper.AgentMapper;
import com.canbe.blog.quota.entity.RoleAgentPolicy;
import com.canbe.blog.quota.mapper.RoleAgentPolicyMapper;
import com.canbe.blog.quota.mapper.UserAgentQuotaMapper;
import com.canbe.blog.quota.service.QuotaInitializationService;
import com.canbe.blog.user.entity.BlogAccount;
import com.canbe.blog.user.mapper.BlogAccountMapper;
import com.canbe.blog.user.mapper.RoleMapper;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class QuotaInitializationServiceImpl implements QuotaInitializationService {

    private static final int DEFAULT_ENABLED = 1;
    private static final int DEFAULT_TOTAL_QUOTA = 10;

    private final AgentMapper agentMapper;
    private final RoleMapper roleMapper;
    private final BlogAccountMapper blogAccountMapper;
    private final RoleAgentPolicyMapper roleAgentPolicyMapper;
    private final UserAgentQuotaMapper userAgentQuotaMapper;

    public QuotaInitializationServiceImpl(
        AgentMapper agentMapper,
        RoleMapper roleMapper,
        BlogAccountMapper blogAccountMapper,
        RoleAgentPolicyMapper roleAgentPolicyMapper,
        UserAgentQuotaMapper userAgentQuotaMapper
    ) {
        this.agentMapper = agentMapper;
        this.roleMapper = roleMapper;
        this.blogAccountMapper = blogAccountMapper;
        this.roleAgentPolicyMapper = roleAgentPolicyMapper;
        this.userAgentQuotaMapper = userAgentQuotaMapper;
    }

    @Override
    @Transactional
    public void initializeAgentPolicies(Long agentId) {
        List<String> roleCodes = roleMapper.listAllCodes();
        for (String roleCode : roleCodes) {
            roleAgentPolicyMapper.createIfAbsent(roleCode, agentId, DEFAULT_ENABLED, DEFAULT_TOTAL_QUOTA);
        }
        for (BlogAccount account : blogAccountMapper.listEnabledAccounts()) {
            userAgentQuotaMapper.createIfAbsent(account.getId(), agentId, DEFAULT_TOTAL_QUOTA, 0, DEFAULT_TOTAL_QUOTA);
        }
    }

    @Override
    @Transactional
    public void initializeRolePolicies(String roleCode) {
        for (Long agentId : agentMapper.listAllIds()) {
            roleAgentPolicyMapper.createIfAbsent(roleCode, agentId, DEFAULT_ENABLED, DEFAULT_TOTAL_QUOTA);
        }
    }

    @Override
    @Transactional
    public void initializeUserQuotas(Long userId, String roleCode) {
        List<RoleAgentPolicy> policies = roleAgentPolicyMapper.listEnabledByRoleCode(roleCode);
        for (RoleAgentPolicy policy : policies) {
            userAgentQuotaMapper.createIfAbsent(userId, policy.getAgentId(), policy.getTotalQuota(), 0, policy.getTotalQuota());
        }
    }
}
