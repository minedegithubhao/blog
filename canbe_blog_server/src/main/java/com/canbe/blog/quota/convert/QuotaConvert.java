package com.canbe.blog.quota.convert;

import com.canbe.blog.quota.entity.RoleAgentPolicy;
import com.canbe.blog.quota.entity.UserAgentQuota;
import com.canbe.blog.quota.vo.RoleAgentPolicyVO;
import com.canbe.blog.quota.vo.UserAgentQuotaVO;

public final class QuotaConvert {

    private QuotaConvert() {
    }

    public static UserAgentQuotaVO toVO(UserAgentQuota quota) {
        UserAgentQuotaVO vo = new UserAgentQuotaVO();
        vo.setId(quota.getId());
        vo.setUserId(quota.getUserId());
        vo.setUsername(quota.getUsername());
        vo.setAgentId(quota.getAgentId());
        vo.setAgentName(quota.getAgentName());
        vo.setTotalQuota(quota.getTotalQuota());
        vo.setUsedQuota(quota.getUsedQuota());
        vo.setRemainingQuota(quota.getRemainingQuota());
        vo.setGmtCreate(quota.getGmtCreate());
        vo.setGmtModified(quota.getGmtModified());
        return vo;
    }

    public static RoleAgentPolicyVO toVO(RoleAgentPolicy policy) {
        RoleAgentPolicyVO vo = new RoleAgentPolicyVO();
        vo.setId(policy.getId());
        vo.setRoleCode(policy.getRoleCode());
        vo.setAgentId(policy.getAgentId());
        vo.setAgentName(policy.getAgentName());
        vo.setEnabled(policy.getEnabled());
        vo.setTotalQuota(policy.getTotalQuota());
        vo.setGmtCreate(policy.getGmtCreate());
        vo.setGmtModified(policy.getGmtModified());
        return vo;
    }
}
