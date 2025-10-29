package com.canbe.pojo;

import com.baomidou.mybatisplus.annotation.FieldFill;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import java.io.Serializable;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.Setter;

/**
 * <p>
 * 用户信息表
 * </p>
 *
 * @author canbe
 * @since 2025-10-28
 */
@Getter
@Setter
@TableName("sys_user")
public class SysUser implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 主键ID
     */
    @TableId(value = "id", type = IdType.AUTO)
    private Integer id;

    /**
     * 账号
     */
    private String username;

    /**
     * 登录密码
     */
    private String password;

    /**
     * 创建时间
     */
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;

    /**
     * 更新时间
     */
    @TableField(fill = FieldFill.UPDATE)
    private LocalDateTime updateTime;

    /**
     * 状态 0:禁用 1:正常
     */
    private Integer status;

    /**
     * ip地址
     */
    private String ip;

    /**
     * ip来源
     */
    private String ipLocation;

    /**
     * 登录系统
     */
    private String os;

    /**
     * 最后登录时间
     */
    private LocalDateTime lastLoginTime;

    /**
     * 浏览器
     */
    private String browser;

    /**
     * 昵称
     */
    private String nickname;

    /**
     * 头像
     */
    private String avatar;

    /**
     * 手机号
     */
    private String mobile;

    private String email;

    /**
     * 性别
     */
    private Integer sex;

    /**
     * 登录方式
     */
    private String loginType;

    /**
     * 个性签名
     */
    private String signature;
}
