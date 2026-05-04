package com.canbe.blog.system.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class DictItemCreateDTO {

    @NotBlank
    @Size(max = 64)
    private String typeCode;

    @NotBlank
    @Size(max = 64)
    private String typeName;

    @NotBlank
    @Size(max = 64)
    private String itemLabel;

    @NotBlank
    @Size(max = 64)
    private String itemValue;

    private Integer sortOrder = 0;

    @Min(0)
    @Max(1)
    private Integer status = 1;

    @Size(max = 255)
    private String remark;

    public String getTypeCode() {
        return typeCode;
    }

    public void setTypeCode(String typeCode) {
        this.typeCode = typeCode;
    }

    public String getTypeName() {
        return typeName;
    }

    public void setTypeName(String typeName) {
        this.typeName = typeName;
    }

    public String getItemLabel() {
        return itemLabel;
    }

    public void setItemLabel(String itemLabel) {
        this.itemLabel = itemLabel;
    }

    public String getItemValue() {
        return itemValue;
    }

    public void setItemValue(String itemValue) {
        this.itemValue = itemValue;
    }

    public Integer getSortOrder() {
        return sortOrder;
    }

    public void setSortOrder(Integer sortOrder) {
        this.sortOrder = sortOrder;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }
}
