package com.canbe.blog.system.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class MenuCreateDTO {

    @NotNull
    private Long parentId;

    @NotBlank
    @Size(max = 64)
    private String name;

    @NotBlank
    @Size(max = 64)
    private String title;

    @Size(max = 128)
    private String path;

    @Size(max = 128)
    private String component;

    @Size(max = 64)
    private String icon;

    @NotBlank
    @Size(max = 16)
    @Pattern(regexp = "CATALOG|MENU|BUTTON")
    private String type;

    @Size(max = 128)
    private String permission;

    @NotNull
    private Integer sortOrder;

    @NotNull
    @Min(0)
    @Max(1)
    private Integer visible;

    @NotNull
    @Min(0)
    @Max(1)
    private Integer status;

    public Long getParentId() {
        return parentId;
    }

    public void setParentId(Long parentId) {
        this.parentId = parentId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public String getComponent() {
        return component;
    }

    public void setComponent(String component) {
        this.component = component;
    }

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getPermission() {
        return permission;
    }

    public void setPermission(String permission) {
        this.permission = permission;
    }

    public Integer getSortOrder() {
        return sortOrder;
    }

    public void setSortOrder(Integer sortOrder) {
        this.sortOrder = sortOrder;
    }

    public Integer getVisible() {
        return visible;
    }

    public void setVisible(Integer visible) {
        this.visible = visible;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }
}
