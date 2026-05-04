package com.canbe.blog.system.mapper;

import com.canbe.blog.system.dto.SiteConfigUpdateDTO;
import com.canbe.blog.system.entity.SiteConfig;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

@Repository
public class SiteConfigMapper {

    private final JdbcTemplate jdbcTemplate;

    public SiteConfigMapper(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public Optional<SiteConfig> findCurrent() {
        String sql = """
            select id, site_name, logo_url, hero_eyebrow, hero_title, hero_title_highlight, hero_subtitle,
                   profile_avatar_url, github_url, twitter_url, contact_url, total_views, project_count,
                   footer_year, footer_text, gmt_create, gmt_modified
            from blog_site_config
            where id = 1 and is_deleted = 0
            limit 1
            """;
        List<SiteConfig> configs = jdbcTemplate.query(sql, new SiteConfigRowMapper());
        return configs.stream().findFirst();
    }

    public int update(SiteConfigUpdateDTO dto) {
        String sql = """
            update blog_site_config
            set site_name = ?, logo_url = ?, hero_eyebrow = ?, hero_title = ?, hero_title_highlight = ?,
                hero_subtitle = ?, profile_avatar_url = ?, github_url = ?, twitter_url = ?, contact_url = ?,
                total_views = ?, project_count = ?, footer_year = ?, footer_text = ?, gmt_modified = now()
            where id = 1 and is_deleted = 0
            """;
        return jdbcTemplate.update(
            sql,
            trim(dto.getSiteName()),
            trimToEmpty(dto.getLogoUrl()),
            trimToEmpty(dto.getHeroEyebrow()),
            trim(dto.getHeroTitle()),
            trimToEmpty(dto.getHeroTitleHighlight()),
            trimToEmpty(dto.getHeroSubtitle()),
            trimToEmpty(dto.getProfileAvatarUrl()),
            trimToEmpty(dto.getGithubUrl()),
            trimToEmpty(dto.getTwitterUrl()),
            trimToEmpty(dto.getContactUrl()),
            dto.getTotalViews() == null ? 0L : dto.getTotalViews(),
            dto.getProjectCount() == null ? 0 : dto.getProjectCount(),
            trimToEmpty(dto.getFooterYear()),
            trimToEmpty(dto.getFooterText())
        );
    }

    public void ensureDefault() {
        String sql = """
            insert into blog_site_config (
              id, site_name, logo_url, hero_eyebrow, hero_title, hero_title_highlight, hero_subtitle,
              profile_avatar_url, github_url, twitter_url, contact_url, total_views, project_count,
              footer_year, footer_text, gmt_create, gmt_modified, is_deleted
            ) values (
              1, ?, '', ?, ?, ?, ?, ?, '', '', '', 0, 0, ?, ?, now(), now(), 0
            ) on duplicate key update is_deleted = 0
            """;
        jdbcTemplate.update(
            sql,
            "乘风博客",
            "欢迎来到我的博客",
            "你好，我是",
            "乘风",
            "一名热爱技术的全栈开发者，专注于 Web 开发、用户体验设计和开源项目。在这里分享我的技术心得、学习笔记和项目经验。",
            "/images/profile/home-avatar.jpg",
            "2025",
            "乘风博客. All rights reserved."
        );
    }

    private String trim(String value) {
        return value == null ? "" : value.trim();
    }

    private String trimToEmpty(String value) {
        return value == null ? "" : value.trim();
    }

    private static class SiteConfigRowMapper implements RowMapper<SiteConfig> {

        @Override
        public SiteConfig mapRow(ResultSet resultSet, int rowNum) throws SQLException {
            SiteConfig config = new SiteConfig();
            config.setId(resultSet.getLong("id"));
            config.setSiteName(resultSet.getString("site_name"));
            config.setLogoUrl(resultSet.getString("logo_url"));
            config.setHeroEyebrow(resultSet.getString("hero_eyebrow"));
            config.setHeroTitle(resultSet.getString("hero_title"));
            config.setHeroTitleHighlight(resultSet.getString("hero_title_highlight"));
            config.setHeroSubtitle(resultSet.getString("hero_subtitle"));
            config.setProfileAvatarUrl(resultSet.getString("profile_avatar_url"));
            config.setGithubUrl(resultSet.getString("github_url"));
            config.setTwitterUrl(resultSet.getString("twitter_url"));
            config.setContactUrl(resultSet.getString("contact_url"));
            config.setTotalViews(resultSet.getLong("total_views"));
            config.setProjectCount(resultSet.getInt("project_count"));
            config.setFooterYear(resultSet.getString("footer_year"));
            config.setFooterText(resultSet.getString("footer_text"));
            config.setGmtCreate(toLocalDateTime(resultSet.getTimestamp("gmt_create")));
            config.setGmtModified(toLocalDateTime(resultSet.getTimestamp("gmt_modified")));
            return config;
        }

        private java.time.LocalDateTime toLocalDateTime(Timestamp timestamp) {
            return timestamp == null ? null : timestamp.toLocalDateTime();
        }
    }
}
