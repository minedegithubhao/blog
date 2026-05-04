package com.canbe.blog.system.entity;

import java.time.LocalDateTime;

public class SiteConfig {

    private Long id;
    private String siteName;
    private String logoUrl;
    private String heroEyebrow;
    private String heroTitle;
    private String heroTitleHighlight;
    private String heroSubtitle;
    private String profileAvatarUrl;
    private String githubUrl;
    private String twitterUrl;
    private String contactUrl;
    private Long totalViews;
    private Integer projectCount;
    private String footerYear;
    private String footerText;
    private LocalDateTime gmtCreate;
    private LocalDateTime gmtModified;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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

    public LocalDateTime getGmtCreate() {
        return gmtCreate;
    }

    public void setGmtCreate(LocalDateTime gmtCreate) {
        this.gmtCreate = gmtCreate;
    }

    public LocalDateTime getGmtModified() {
        return gmtModified;
    }

    public void setGmtModified(LocalDateTime gmtModified) {
        this.gmtModified = gmtModified;
    }
}
