package com.canbe.system.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import java.io.Serializable;
import java.time.LocalDateTime;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

/**
 * <p>
 * 用户表
 * </p>
 *
 * @author cxd
 * @since 2022-07-14
 */
@TableName("sys_user")
@ApiModel(value = "SysUser对象", description = "用户表")
public class SysUser implements Serializable {

    private static final long serialVersionUID = 1L;

    @ApiModelProperty("主键id")
    private String id;

    @ApiModelProperty("登录账号")
    private String username;

    @ApiModelProperty("真实姓名")
    private String realname;

    @ApiModelProperty("密码")
    private String password;

    @ApiModelProperty("md5密码盐")
    private String salt;

    @ApiModelProperty("头像")
    private String avatar;

    @ApiModelProperty("生日")
    private LocalDateTime birthday;

    @ApiModelProperty("性别(0-默认未知,1-男,2-女)")
    private Boolean sex;

    @ApiModelProperty("电子邮件")
    private String email;

    @ApiModelProperty("电话")
    private String phone;

    @ApiModelProperty("机构编码")
    private String orgCode;

    @ApiModelProperty("性别(1-正常,2-冻结)")
    private Boolean status;

    @ApiModelProperty("删除状态(0-正常,1-已删除)")
    private Boolean delFlag;

    @ApiModelProperty("第三方登录的唯一标识")
    private String thirdId;

    @ApiModelProperty("第三方类型")
    private String thirdType;

    @ApiModelProperty("同步工作流引擎(1-同步,0-不同步)")
    private Boolean activitiSync;

    @ApiModelProperty("工号，唯一键")
    private String workNo;

    @ApiModelProperty("职务，关联职务表")
    private String post;

    @ApiModelProperty("座机号")
    private String telephone;

    @ApiModelProperty("创建人")
    private String createBy;

    @ApiModelProperty("创建时间")
    private LocalDateTime createTime;

    @ApiModelProperty("更新人")
    private String updateBy;

    @ApiModelProperty("更新时间")
    private LocalDateTime updateTime;

    @ApiModelProperty("身份（1普通成员 2上级）")
    private Boolean userIdentity;

    @ApiModelProperty("负责部门")
    private String departIds;

    @ApiModelProperty("多租户标识")
    private String relTenantIds;

    @ApiModelProperty("设备ID")
    private String clientId;


    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getRealname() {
        return realname;
    }

    public void setRealname(String realname) {
        this.realname = realname;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getSalt() {
        return salt;
    }

    public void setSalt(String salt) {
        this.salt = salt;
    }

    public String getAvatar() {
        return avatar;
    }

    public void setAvatar(String avatar) {
        this.avatar = avatar;
    }

    public LocalDateTime getBirthday() {
        return birthday;
    }

    public void setBirthday(LocalDateTime birthday) {
        this.birthday = birthday;
    }

    public Boolean getSex() {
        return sex;
    }

    public void setSex(Boolean sex) {
        this.sex = sex;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getOrgCode() {
        return orgCode;
    }

    public void setOrgCode(String orgCode) {
        this.orgCode = orgCode;
    }

    public Boolean getStatus() {
        return status;
    }

    public void setStatus(Boolean status) {
        this.status = status;
    }

    public Boolean getDelFlag() {
        return delFlag;
    }

    public void setDelFlag(Boolean delFlag) {
        this.delFlag = delFlag;
    }

    public String getThirdId() {
        return thirdId;
    }

    public void setThirdId(String thirdId) {
        this.thirdId = thirdId;
    }

    public String getThirdType() {
        return thirdType;
    }

    public void setThirdType(String thirdType) {
        this.thirdType = thirdType;
    }

    public Boolean getActivitiSync() {
        return activitiSync;
    }

    public void setActivitiSync(Boolean activitiSync) {
        this.activitiSync = activitiSync;
    }

    public String getWorkNo() {
        return workNo;
    }

    public void setWorkNo(String workNo) {
        this.workNo = workNo;
    }

    public String getPost() {
        return post;
    }

    public void setPost(String post) {
        this.post = post;
    }

    public String getTelephone() {
        return telephone;
    }

    public void setTelephone(String telephone) {
        this.telephone = telephone;
    }

    public String getCreateBy() {
        return createBy;
    }

    public void setCreateBy(String createBy) {
        this.createBy = createBy;
    }

    public LocalDateTime getCreateTime() {
        return createTime;
    }

    public void setCreateTime(LocalDateTime createTime) {
        this.createTime = createTime;
    }

    public String getUpdateBy() {
        return updateBy;
    }

    public void setUpdateBy(String updateBy) {
        this.updateBy = updateBy;
    }

    public LocalDateTime getUpdateTime() {
        return updateTime;
    }

    public void setUpdateTime(LocalDateTime updateTime) {
        this.updateTime = updateTime;
    }

    public Boolean getUserIdentity() {
        return userIdentity;
    }

    public void setUserIdentity(Boolean userIdentity) {
        this.userIdentity = userIdentity;
    }

    public String getDepartIds() {
        return departIds;
    }

    public void setDepartIds(String departIds) {
        this.departIds = departIds;
    }

    public String getRelTenantIds() {
        return relTenantIds;
    }

    public void setRelTenantIds(String relTenantIds) {
        this.relTenantIds = relTenantIds;
    }

    public String getClientId() {
        return clientId;
    }

    public void setClientId(String clientId) {
        this.clientId = clientId;
    }

    @Override
    public String toString() {
        return "SysUser{" +
        "id=" + id +
        ", username=" + username +
        ", realname=" + realname +
        ", password=" + password +
        ", salt=" + salt +
        ", avatar=" + avatar +
        ", birthday=" + birthday +
        ", sex=" + sex +
        ", email=" + email +
        ", phone=" + phone +
        ", orgCode=" + orgCode +
        ", status=" + status +
        ", delFlag=" + delFlag +
        ", thirdId=" + thirdId +
        ", thirdType=" + thirdType +
        ", activitiSync=" + activitiSync +
        ", workNo=" + workNo +
        ", post=" + post +
        ", telephone=" + telephone +
        ", createBy=" + createBy +
        ", createTime=" + createTime +
        ", updateBy=" + updateBy +
        ", updateTime=" + updateTime +
        ", userIdentity=" + userIdentity +
        ", departIds=" + departIds +
        ", relTenantIds=" + relTenantIds +
        ", clientId=" + clientId +
        "}";
    }
}
