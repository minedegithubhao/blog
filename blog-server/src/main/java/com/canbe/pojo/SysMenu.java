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
 * 权限资源表 
 * </p>
 *
 * @author canbe
 * @since 2025-10-28
 */
@Getter
@Setter
@TableName("sys_menu")
public class SysMenu implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 主键
     */
    @TableId(value = "id", type = IdType.AUTO)
    private Integer id;

    /**
     * 上级资源ID
     */
    private String parentId;

    /**
     * 路由路径
     */
    private String path;

    /**
     * 组件路径
     */
    private String component;

    /**
     * 菜单名称
     */
    private String title;

    /**
     * 排序
     */
    private Integer sort;

    /**
     * 资源图标
     */
    private String icon;

    /**
     * 类型 menu、button
     */
    private String type;

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
     * 重定向地址
     */
    private String redirect;

    /**
     * 跳转地址
     */
    private String name;

    /**
     * 是否隐藏
     */
    private Integer hidden;

    /**
     * 权限标识
     */
    private String perm;

    /**
     * 是否外链 0:否  1:是
     */
    private Integer isExternal;
}
