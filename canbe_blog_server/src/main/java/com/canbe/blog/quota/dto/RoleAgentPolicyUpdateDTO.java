package com.canbe.blog.quota.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class RoleAgentPolicyUpdateDTO {

    @NotNull
    @Min(0)
    @Max(1)
    private Integer enabled;

    @NotNull
    @Min(0)
    private Integer totalQuota;

    public Integer getEnabled() {
        return enabled;
    }

    public void setEnabled(Integer enabled) {
        this.enabled = enabled;
    }

    public Integer getTotalQuota() {
        return totalQuota;
    }

    public void setTotalQuota(Integer totalQuota) {
        this.totalQuota = totalQuota;
    }
}
