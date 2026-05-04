package com.canbe.blog.system.dto;

public class DictItemQueryDTO {

    private Integer page;
    private Integer pageSize;
    private String typeCode;
    private String itemLabel;
    private Integer status;

    public Integer getPage() {
        return page;
    }

    public void setPage(Integer page) {
        this.page = page;
    }

    public Integer getPageSize() {
        return pageSize;
    }

    public void setPageSize(Integer pageSize) {
        this.pageSize = pageSize;
    }

    public String getTypeCode() {
        return typeCode;
    }

    public void setTypeCode(String typeCode) {
        this.typeCode = typeCode;
    }

    public String getItemLabel() {
        return itemLabel;
    }

    public void setItemLabel(String itemLabel) {
        this.itemLabel = itemLabel;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }
}
