package com.canbe.blog.system.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

public class SiteConfigUpdateDTO {

    @NotBlank(message = "站点名称不能为空")
    @Size(max = 64, message = "站点名称不能超过64个字符")
    private String siteName;

    @Size(max = 255, message = "Logo地址不能超过255个字符")
    private String logoUrl;

    @Size(max = 64, message = "首页提示语不能超过64个字符")
    private String heroEyebrow;

    @NotBlank(message = "首页标题不能为空")
    @Size(max = 128, message = "首页标题不能超过128个字符")
    private String heroTitle;

    @Size(max = 64, message = "首页标题强调文字不能超过64个字符")
    private String heroTitleHighlight;

    @Size(max = 500, message = "首页简介不能超过500个字符")
    private String heroSubtitle;

    @Size(max = 255, message = "首页头像地址不能超过255个字符")
    private String profileAvatarUrl;

    @Size(max = 255, message = "GitHub地址不能超过255个字符")
    private String githubUrl;

    @Size(max = 255, message = "Twitter地址不能超过255个字符")
    private String twitterUrl;

    @Size(max = 255, message = "联系我地址不能超过255个字符")
    private String contactUrl;

    @PositiveOrZero(message = "总浏览量不能小于0")
    private Long totalViews;

    @PositiveOrZero(message = "开源项目数量不能小于0")
    @Max(value = 999999, message = "开源项目数量过大")
    private Integer projectCount;

    @Size(max = 16, message = "页脚年份不能超过16个字符")
    private String footerYear;

    @Size(max = 255, message = "页脚文案不能超过255个字符")
    private String footerText;

    public String getSiteName() {
        return siteName;
    }

    public void setSiteName(String siteName) {
        this.siteName = siteName;
    }

    public String getLogoUrl() {
        return logoUrl;
    }

    public void setLogoUrl(String logoUrl) {
        this.logoUrl = logoUrl;
    }

    public String getHeroEyebrow() {
        return heroEyebrow;
    }

    public void setHeroEyebrow(String heroEyebrow) {
        this.heroEyebrow = heroEyebrow;
    }

    public String getHeroTitle() {
        return heroTitle;
    }

    public void setHeroTitle(String heroTitle) {
        this.heroTitle = heroTitle;
    }

    public String getHeroTitleHighlight() {
        return heroTitleHighlight;
    }

    public void setHeroTitleHighlight(String heroTitleHighlight) {
        this.heroTitleHighlight = heroTitleHighlight;
    }

    public String getHeroSubtitle() {
        return heroSubtitle;
    }

    public void setHeroSubtitle(String heroSubtitle) {
        this.heroSubtitle = heroSubtitle;
    }

    public String getProfileAvatarUrl() {
        return profileAvatarUrl;
    }

    public void setProfileAvatarUrl(String profileAvatarUrl) {
        this.profileAvatarUrl = profileAvatarUrl;
    }

    public String getGithubUrl() {
        return githubUrl;
    }

    public void setGithubUrl(String githubUrl) {
        this.githubUrl = githubUrl;
    }

    public String getTwitterUrl() {
        return twitterUrl;
    }

    public void setTwitterUrl(String twitterUrl) {
        this.twitterUrl = twitterUrl;
    }

    public String getContactUrl() {
        return contactUrl;
    }

    public void setContactUrl(String contactUrl) {
        this.contactUrl = contactUrl;
    }

    public Long getTotalViews() {
        return totalViews;
    }

    public void setTotalViews(Long totalViews) {
        this.totalViews = totalViews;
    }

    public Integer getProjectCount() {
        return projectCount;
    }

    public void setProjectCount(Integer projectCount) {
        this.projectCount = projectCount;
    }

    public String getFooterYear() {
        return footerYear;
    }

    public void setFooterYear(String footerYear) {
        this.footerYear = footerYear;
    }

    public String getFooterText() {
        return footerText;
    }

    public void setFooterText(String footerText) {
        this.footerText = footerText;
    }
}
