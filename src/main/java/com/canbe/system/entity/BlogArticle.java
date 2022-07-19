package com.canbe.system.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import java.io.Serializable;
import java.time.LocalDate;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

/**
 * <p>
 * 
 * </p>
 *
 * @author cxd
 * @since 2022-07-18
 */
@TableName("blog_article")
@ApiModel(value = "BlogArticle对象", description = "")
public class BlogArticle implements Serializable {

    private static final long serialVersionUID = 1L;

    private String id;

    @ApiModelProperty("博客分类")
    private String blogCategory;

    @ApiModelProperty("博客标题")
    private String blogTitle;

    @ApiModelProperty("博客内容")
    private String blogContent;

    @ApiModelProperty("创建人")
    private String createBy;

    @ApiModelProperty("创建日期")
    private LocalDate createDate;

    @ApiModelProperty("更新人")
    private String updateBy;

    @ApiModelProperty("更新日期")
    private LocalDate updateDate;

    @ApiModelProperty("删除标记，0-正常，1-删除")
    private String deleteFlag;

    @ApiModelProperty("评论数量")
    private Integer comments;

    @ApiModelProperty("阅读量")
    private Integer readingViews;


    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getBlogCategory() {
        return blogCategory;
    }

    public void setBlogCategory(String blogCategory) {
        this.blogCategory = blogCategory;
    }

    public String getBlogTitle() {
        return blogTitle;
    }

    public void setBlogTitle(String blogTitle) {
        this.blogTitle = blogTitle;
    }

    public String getBlogContent() {
        return blogContent;
    }

    public void setBlogContent(String blogContent) {
        this.blogContent = blogContent;
    }

    public String getCreateBy() {
        return createBy;
    }

    public void setCreateBy(String createBy) {
        this.createBy = createBy;
    }

    public LocalDate getCreateDate() {
        return createDate;
    }

    public void setCreateDate(LocalDate createDate) {
        this.createDate = createDate;
    }

    public String getUpdateBy() {
        return updateBy;
    }

    public void setUpdateBy(String updateBy) {
        this.updateBy = updateBy;
    }

    public LocalDate getUpdateDate() {
        return updateDate;
    }

    public void setUpdateDate(LocalDate updateDate) {
        this.updateDate = updateDate;
    }

    public String getDeleteFlag() {
        return deleteFlag;
    }

    public void setDeleteFlag(String deleteFlag) {
        this.deleteFlag = deleteFlag;
    }

    public Integer getComments() {
        return comments;
    }

    public void setComments(Integer comments) {
        this.comments = comments;
    }

    public Integer getReadingViews() {
        return readingViews;
    }

    public void setReadingViews(Integer readingViews) {
        this.readingViews = readingViews;
    }

    @Override
    public String toString() {
        return "BlogArticle{" +
        "id=" + id +
        ", blogCategory=" + blogCategory +
        ", blogTitle=" + blogTitle +
        ", blogContent=" + blogContent +
        ", createBy=" + createBy +
        ", createDate=" + createDate +
        ", updateBy=" + updateBy +
        ", updateDate=" + updateDate +
        ", deleteFlag=" + deleteFlag +
        ", comments=" + comments +
        ", readingViews=" + readingViews +
        "}";
    }
}
