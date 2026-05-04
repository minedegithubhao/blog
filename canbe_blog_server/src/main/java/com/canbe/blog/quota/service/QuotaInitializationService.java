package com.canbe.blog.quota.service;

public interface QuotaInitializationService {

    void initializeAgentPolicies(Long agentId);

    void initializeRolePolicies(String roleCode);

    void initializeUserQuotas(Long userId, String roleCode);
}
