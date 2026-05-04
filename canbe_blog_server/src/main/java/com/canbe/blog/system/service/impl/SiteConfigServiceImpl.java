package com.canbe.blog.system.service.impl;

import com.canbe.blog.common.BusinessException;
import com.canbe.blog.security.AuthenticatedUser;
import com.canbe.blog.security.CurrentUserContext;
import com.canbe.blog.system.convert.SiteConfigConvert;
import com.canbe.blog.system.dto.SiteConfigUpdateDTO;
import com.canbe.blog.system.mapper.SiteConfigMapper;
import com.canbe.blog.system.service.SiteConfigService;
import com.canbe.blog.system.vo.SiteConfigVO;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SiteConfigServiceImpl implements SiteConfigService {

    private static final String ADMIN_ROLE = "ADMIN";

    private final SiteConfigMapper siteConfigMapper;

    public SiteConfigServiceImpl(SiteConfigMapper siteConfigMapper) {
        this.siteConfigMapper = siteConfigMapper;
    }

    @Override
    public SiteConfigVO get() {
        siteConfigMapper.ensureDefault();
        return siteConfigMapper.findCurrent()
            .map(SiteConfigConvert::toVO)
            .orElseThrow(() -> new BusinessException(7201, "站点配置不存在"));
    }

    @Override
    @Transactional
    public void update(SiteConfigUpdateDTO updateDTO) {
        requireAdmin();
        normalize(updateDTO);
        siteConfigMapper.ensureDefault();
        if (siteConfigMapper.update(updateDTO) == 0) {
            throw new BusinessException(7201, "站点配置不存在");
        }
    }

    private AuthenticatedUser requireAdmin() {
        AuthenticatedUser currentUser = CurrentUserContext.getRequired();
        if (!ADMIN_ROLE.equals(currentUser.getRoleCode())) {
            throw new BusinessException(2005, "权限不足");
        }
        return currentUser;
    }

    private void normalize(SiteConfigUpdateDTO dto) {
        dto.setSiteName(trim(dto.getSiteName()));
        dto.setLogoUrl(trimToEmpty(dto.getLogoUrl()));
        dto.setHeroEyebrow(trimToEmpty(dto.getHeroEyebrow()));
        dto.setHeroTitle(trim(dto.getHeroTitle()));
        dto.setHeroTitleHighlight(trimToEmpty(dto.getHeroTitleHighlight()));
        dto.setHeroSubtitle(trimToEmpty(dto.getHeroSubtitle()));
        dto.setProfileAvatarUrl(trimToEmpty(dto.getProfileAvatarUrl()));
        dto.setGithubUrl(trimToEmpty(dto.getGithubUrl()));
        dto.setTwitterUrl(trimToEmpty(dto.getTwitterUrl()));
        dto.setContactUrl(trimToEmpty(dto.getContactUrl()));
        dto.setTotalViews(dto.getTotalViews() == null ? 0L : dto.getTotalViews());
        dto.setProjectCount(dto.getProjectCount() == null ? 0 : dto.getProjectCount());
        dto.setFooterYear(trimToEmpty(dto.getFooterYear()));
        dto.setFooterText(trimToEmpty(dto.getFooterText()));
    }

    private String trim(String value) {
        return value == null ? "" : value.trim();
    }

    private String trimToEmpty(String value) {
        return value == null ? "" : value.trim();
    }
}
