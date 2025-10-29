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
 * 博客文章表
 * </p>
 *
 * @author canbe
 * @since 2025-10-28
 */
@Getter
@Setter
@TableName("sys_article")
public class SysArticle implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 主键id
     */
    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    /**
     * 用户id
     */
    private Integer userId;

    /**
     * 分类id
     */
    private Integer categoryId;

    /**
     * 文章标题
     */
    private String title;

    /**
     * 文章封面地址
     */
    private String cover;

    /**
     * 文章简介
     */
    private String summary;

    /**
     * 文章内容
     */
    private String content;

    /**
     * 文章内容md格式
     */
    private String contentMd;

    /**
     * 阅读方式 0无需验证 1：评论阅读 2：点赞阅读 3：扫码阅读
     */
    private Integer readType;

    /**
     * 是否置顶 0否 1是
     */
    private Integer isStick;

    /**
     * 状态 0：下架 1：发布
     */
    private Integer status;

    /**
     * 是否原创  0：转载 1:原创
     */
    private Integer isOriginal;

    /**
     * 是否首页轮播
     */
    private Integer isCarousel;

    /**
     * 是否推荐
     */
    private Integer isRecommend;

    /**
     * 转载地址
     */
    private String originalUrl;

    /**
     * 文章阅读量
     */
    private Long quantity;

    /**
     * 关键词
     */
    private String keywords;

    /**
     * Ai生成的简短描述
     */
    private String aiDescribe;

    /**
     * 创建时间
     */
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;

    /**
     * 修改时间
     */
    @TableField(fill = FieldFill.UPDATE)
    private LocalDateTime updateTime;
}
