package com.canbe.blog.user.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class RoleCreateDTO {

    @NotBlank
    @Size(max = 64)
    private String name;

    @NotBlank
    @Size(max = 32)
    @Pattern(regexp = "^[A-Z][A-Z0-9_]*$")
    private String code;

    @Size(max = 255)
    private String description;

    @Min(0)
    @Max(1)
    private Integer status = 1;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }
}
