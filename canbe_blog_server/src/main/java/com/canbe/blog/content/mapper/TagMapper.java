package com.canbe.blog.content.mapper;

import com.canbe.blog.content.dto.TagCreateDTO;
import com.canbe.blog.content.dto.TagQueryDTO;
import com.canbe.blog.content.dto.TagUpdateDTO;
import com.canbe.blog.content.entity.Tag;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

@Repository
public class TagMapper {

    private final JdbcTemplate jdbcTemplate;

    public TagMapper(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Tag> list(TagQueryDTO queryDTO) {
        QueryParts queryParts = buildQueryParts(queryDTO);
        String sql = """
            select id, name, slug, gmt_create, gmt_modified
            from blog_tag
            where is_deleted = 0
            """ + queryParts.whereSql() + """
            order by id desc
            limit ? offset ?
            """;
        int page = normalizePage(queryDTO.getPage());
        int pageSize = normalizePageSize(queryDTO.getPageSize());
        List<Object> args = new ArrayList<>(queryParts.args());
        args.add(pageSize);
        args.add((page - 1) * pageSize);
        return jdbcTemplate.query(sql, new TagRowMapper(), args.toArray());
    }

    public long count(TagQueryDTO queryDTO) {
        QueryParts queryParts = buildQueryParts(queryDTO);
        String sql = "select count(1) from blog_tag where is_deleted = 0" + queryParts.whereSql();
        Long total = jdbcTemplate.queryForObject(sql, Long.class, queryParts.args().toArray());
        return total == null ? 0 : total;
    }

    public Optional<Tag> findById(Long id) {
        String sql = """
            select id, name, slug, gmt_create, gmt_modified
            from blog_tag
            where id = ? and is_deleted = 0
            limit 1
            """;
        List<Tag> tags = jdbcTemplate.query(sql, new TagRowMapper(), id);
        return tags.stream().findFirst();
    }

    public boolean existsByName(String name) {
        String sql = "select count(1) from blog_tag where name = ? and is_deleted = 0";
        Long count = jdbcTemplate.queryForObject(sql, Long.class, name);
        return count != null && count > 0;
    }

    public boolean existsByNameExceptId(String name, Long exceptId) {
        String sql = "select count(1) from blog_tag where name = ? and id <> ? and is_deleted = 0";
        Long count = jdbcTemplate.queryForObject(sql, Long.class, name, exceptId == null ? 0 : exceptId);
        return count != null && count > 0;
    }

    public boolean existsBySlug(String slug) {
        String sql = "select count(1) from blog_tag where slug = ? and is_deleted = 0";
        Long count = jdbcTemplate.queryForObject(sql, Long.class, slug);
        return count != null && count > 0;
    }

    public boolean existsBySlugExceptId(String slug, Long exceptId) {
        String sql = "select count(1) from blog_tag where slug = ? and id <> ? and is_deleted = 0";
        Long count = jdbcTemplate.queryForObject(sql, Long.class, slug, exceptId == null ? 0 : exceptId);
        return count != null && count > 0;
    }

    public Long create(TagCreateDTO dto) {
        String sql = """
            insert into blog_tag (
              name, slug, gmt_create, gmt_modified, is_deleted
            ) values (?, ?, now(), now(), 0)
            """;
        jdbcTemplate.update(sql, trim(dto.getName()), trim(dto.getSlug()));
        return jdbcTemplate.queryForObject("select last_insert_id()", Long.class);
    }

    public int update(Long id, TagUpdateDTO dto) {
        String sql = """
            update blog_tag
            set name = ?, slug = ?, gmt_modified = now()
            where id = ? and is_deleted = 0
            """;
        return jdbcTemplate.update(sql, trim(dto.getName()), trim(dto.getSlug()), id);
    }

    public int delete(Long id) {
        String sql = "update blog_tag set is_deleted = 1, gmt_modified = now() where id = ? and is_deleted = 0";
        return jdbcTemplate.update(sql, id);
    }

    private QueryParts buildQueryParts(TagQueryDTO queryDTO) {
        StringBuilder whereSql = new StringBuilder();
        List<Object> args = new ArrayList<>();
        if (queryDTO.getName() != null && !queryDTO.getName().trim().isEmpty()) {
            whereSql.append(" and name like ? ");
            args.add(queryDTO.getName().trim() + "%");
        }
        return new QueryParts(whereSql.toString(), args);
    }

    private int normalizePage(Integer page) {
        return page == null || page < 1 ? 1 : page;
    }

    private int normalizePageSize(Integer pageSize) {
        if (pageSize == null || pageSize < 1) {
            return 20;
        }
        return Math.min(pageSize, 100);
    }

    private String trim(String value) {
        return value == null ? "" : value.trim();
    }

    private record QueryParts(String whereSql, List<Object> args) {
    }

    private static class TagRowMapper implements RowMapper<Tag> {

        @Override
        public Tag mapRow(ResultSet resultSet, int rowNum) throws SQLException {
            Tag tag = new Tag();
            tag.setId(resultSet.getLong("id"));
            tag.setName(resultSet.getString("name"));
            tag.setSlug(resultSet.getString("slug"));
            tag.setGmtCreate(toLocalDateTime(resultSet.getTimestamp("gmt_create")));
            tag.setGmtModified(toLocalDateTime(resultSet.getTimestamp("gmt_modified")));
            return tag;
        }

        private java.time.LocalDateTime toLocalDateTime(Timestamp timestamp) {
            return timestamp == null ? null : timestamp.toLocalDateTime();
        }
    }
}
