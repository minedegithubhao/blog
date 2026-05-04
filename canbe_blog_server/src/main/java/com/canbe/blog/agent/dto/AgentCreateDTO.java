package com.canbe.blog.agent.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class AgentCreateDTO {

    @NotBlank
    @Size(max = 64)
    private String name;

    @NotBlank
    @Size(max = 32)
    @Pattern(regexp = "^[A-Z][A-Z0-9_]*$")
    private String code;

    @Size(max = 500)
    private String description;

    @Size(max = 255)
    private String avatarUrl;

    @Size(max = 255)
    private String runtimeUrl;

    @Size(max = 500)
    private String embedUrl;

    @Size(max = 32)
    private String providerType = "CUSTOM";

    @Size(max = 500)
    private String apiUrl;

    @Size(max = 500)
    private String apiKey;

    @Size(max = 32)
    private String responseMode = "blocking";

    @Min(0)
    @Max(1)
    private Integer status = 1;

    private Integer sortOrder = 0;

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

    public String getAvatarUrl() {
        return avatarUrl;
    }

    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }

    public String getRuntimeUrl() {
        return runtimeUrl;
    }

    public void setRuntimeUrl(String runtimeUrl) {
        this.runtimeUrl = runtimeUrl;
    }

    public String getEmbedUrl() {
        return embedUrl;
    }

    public void setEmbedUrl(String embedUrl) {
        this.embedUrl = embedUrl;
    }

    public String getProviderType() {
        return providerType;
    }

    public void setProviderType(String providerType) {
        this.providerType = providerType;
    }

    public String getApiUrl() {
        return apiUrl;
    }

    public void setApiUrl(String apiUrl) {
        this.apiUrl = apiUrl;
    }

    public String getApiKey() {
        return apiKey;
    }

    public void setApiKey(String apiKey) {
        this.apiKey = apiKey;
    }

    public String getResponseMode() {
        return responseMode;
    }

    public void setResponseMode(String responseMode) {
        this.responseMode = responseMode;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public Integer getSortOrder() {
        return sortOrder;
    }

    public void setSortOrder(Integer sortOrder) {
        this.sortOrder = sortOrder;
    }
}
