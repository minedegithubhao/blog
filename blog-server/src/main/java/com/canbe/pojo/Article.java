package com.canbe.pojo;

import com.baomidou.mybatisplus.annotation.*;

import java.io.Serializable;
import java.time.LocalDateTime;

import com.canbe.annotation.State;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.groups.Default;
import lombok.Getter;
import lombok.Setter;

/**
 * <p>
 * 文章表
 * </p>
 *
 * @author canbe
 * @since 2025-10-14
 */
@Getter
@Setter
public class Article implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * ID
     */
    @TableId(value = "id", type = IdType.AUTO)
    @NotNull(groups = Update.class)
    private Integer id;

    /**
     * 文章标题
     */
    @NotEmpty
    private String title;

    /**
     * 文章封面
     */
    private String img;

    /**
     * 文章简介
     */
    private String summary;

    /**
     * 文章内容
     */
    @NotEmpty
    private String content;

    /**
     * 文章内容(MD格式)
     */
    private String contentMd;

    /**
     * 文章关键词
     */
    private String keywords;

    /**
     * SEO关键词
     */
    private String seowords;

    /**
     * 创建人ID
     */
    @TableField(fill = FieldFill.INSERT)
    private Integer createUser;

    /**
     * 创建时间
     */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;

    /**
     * 修改人ID
     */
    @TableField(fill = FieldFill.UPDATE)
    private Integer updateUser;

    /**
     * 修改时间
     */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @TableField(fill = FieldFill.UPDATE)
    private LocalDateTime updateTime;

    /**
     * 文章分类ID
     */
    @NotNull
    private Integer categoryId;

    /**
     * 浏览量
     */
    private Integer viewNum;

    /**
     * 点赞量
     */
    private Integer likeNum;

    /**
     * 评论量
     */
    private Integer commentNum;

    /**
     * 是否发布(1-已发布，0-未发布)
     */
    @State
    private Integer isPublish;

    /**
     * 是否删除 (1-已删除，0-未删除)
     */
    private Integer isDel;

    // validate group add - 验证组：添加
    public interface Add extends Default {}

    // validate group update - 验证组：更新
    public interface Update extends Default {}
}
