package com.canbe.blog.quota.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class UserAgentQuotaUpdateDTO {

    @NotNull
    @Min(0)
    private Integer totalQuota;

    public Integer getTotalQuota() {
        return totalQuota;
    }

    public void setTotalQuota(Integer totalQuota) {
        this.totalQuota = totalQuota;
    }
}
