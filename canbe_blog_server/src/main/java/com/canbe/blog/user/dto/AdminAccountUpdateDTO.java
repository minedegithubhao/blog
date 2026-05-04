package com.canbe.blog.user.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class AdminAccountUpdateDTO {

    @Size(max = 128)
    private String email;

    @NotBlank
    @Size(max = 20)
    private String nickname;

    @NotBlank
    @Pattern(regexp = "ADMIN|USER")
    private String roleCode;

    @Min(0)
    @Max(1)
    private Integer status = 1;

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getNickname() {
        return nickname;
    }

    public void setNickname(String nickname) {
        this.nickname = nickname;
    }

    public String getRoleCode() {
        return roleCode;
    }

    public void setRoleCode(String roleCode) {
        this.roleCode = roleCode;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }
}
