package com.canbe.blog.system.convert;

import com.canbe.blog.system.entity.SiteConfig;
import com.canbe.blog.system.vo.SiteConfigVO;

public final class SiteConfigConvert {

    private SiteConfigConvert() {
    }

    public static SiteConfigVO toVO(SiteConfig config) {
        if (config == null) {
            return null;
        }
        SiteConfigVO vo = new SiteConfigVO();
        vo.setId(config.getId());
        vo.setSiteName(config.getSiteName());
        vo.setLogoUrl(config.getLogoUrl());
        vo.setHeroEyebrow(config.getHeroEyebrow());
        vo.setHeroTitle(config.getHeroTitle());
        vo.setHeroTitleHighlight(config.getHeroTitleHighlight());
        vo.setHeroSubtitle(config.getHeroSubtitle());
        vo.setProfileAvatarUrl(config.getProfileAvatarUrl());
        vo.setGithubUrl(config.getGithubUrl());
        vo.setTwitterUrl(config.getTwitterUrl());
        vo.setContactUrl(config.getContactUrl());
        vo.setTotalViews(config.getTotalViews());
        vo.setProjectCount(config.getProjectCount());
        vo.setFooterYear(config.getFooterYear());
        vo.setFooterText(config.getFooterText());
        vo.setGmtCreate(config.getGmtCreate());
        vo.setGmtModified(config.getGmtModified());
        return vo;
    }
}
