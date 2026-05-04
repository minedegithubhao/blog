package com.canbe.blog.content.mapper;

import com.canbe.blog.content.dto.CategoryCreateDTO;
import com.canbe.blog.content.dto.CategoryQueryDTO;
import com.canbe.blog.content.dto.CategoryUpdateDTO;
import com.canbe.blog.content.entity.Category;
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
public class CategoryMapper {

    private final JdbcTemplate jdbcTemplate;

    public CategoryMapper(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Category> list(CategoryQueryDTO queryDTO) {
        QueryParts queryParts = buildQueryParts(queryDTO);
        String sql = """
            select id, name, slug, description, sort_order, status, gmt_create, gmt_modified
            from blog_category
            where is_deleted = 0
            """ + queryParts.whereSql() + """
            order by sort_order asc, id desc
            limit ? offset ?
            """;
        int page = normalizePage(queryDTO.getPage());
        int pageSize = normalizePageSize(queryDTO.getPageSize());
        List<Object> args = new ArrayList<>(queryParts.args());
        args.add(pageSize);
        args.add((page - 1) * pageSize);
        return jdbcTemplate.query(sql, new CategoryRowMapper(), args.toArray());
    }

    public long count(CategoryQueryDTO queryDTO) {
        QueryParts queryParts = buildQueryParts(queryDTO);
        String sql = "select count(1) from blog_category where is_deleted = 0" + queryParts.whereSql();
        Long total = jdbcTemplate.queryForObject(sql, Long.class, queryParts.args().toArray());
        return total == null ? 0 : total;
    }

    public Optional<Category> findById(Long id) {
        String sql = """
            select id, name, slug, description, sort_order, status, gmt_create, gmt_modified
            from blog_category
            where id = ? and is_deleted = 0
            limit 1
            """;
        List<Category> categories = jdbcTemplate.query(sql, new CategoryRowMapper(), id);
        return categories.stream().findFirst();
    }

    public boolean existsByName(String name) {
        String sql = "select count(1) from blog_category where name = ? and is_deleted = 0";
        Long count = jdbcTemplate.queryForObject(sql, Long.class, name);
        return count != null && count > 0;
    }

    public boolean existsByNameExceptId(String name, Long exceptId) {
        String sql = "select count(1) from blog_category where name = ? and id <> ? and is_deleted = 0";
        Long count = jdbcTemplate.queryForObject(sql, Long.class, name, exceptId == null ? 0 : exceptId);
        return count != null && count > 0;
    }

    public boolean existsBySlug(String slug) {
        String sql = "select count(1) from blog_category where slug = ? and is_deleted = 0";
        Long count = jdbcTemplate.queryForObject(sql, Long.class, slug);
        return count != null && count > 0;
    }

    public boolean existsBySlugExceptId(String slug, Long exceptId) {
        String sql = "select count(1) from blog_category where slug = ? and id <> ? and is_deleted = 0";
        Long count = jdbcTemplate.queryForObject(sql, Long.class, slug, exceptId == null ? 0 : exceptId);
        return count != null && count > 0;
    }

    public Long create(CategoryCreateDTO dto) {
        String sql = """
            insert into blog_category (
              name, slug, description, sort_order, status, gmt_create, gmt_modified, is_deleted
            ) values (?, ?, ?, ?, ?, now(), now(), 0)
            """;
        jdbcTemplate.update(sql, trim(dto.getName()), trim(dto.getSlug()), trimToEmpty(dto.getDescription()), dto.getSortOrder(), dto.getStatus());
        return jdbcTemplate.queryForObject("select last_insert_id()", Long.class);
    }

    public int update(Long id, CategoryUpdateDTO dto) {
        String sql = """
            update blog_category
            set name = ?, slug = ?, description = ?, sort_order = ?, status = ?, gmt_modified = now()
            where id = ? and is_deleted = 0
            """;
        return jdbcTemplate.update(sql, trim(dto.getName()), trim(dto.getSlug()), trimToEmpty(dto.getDescription()), dto.getSortOrder(), dto.getStatus(), id);
    }

    public int delete(Long id) {
        String sql = "update blog_category set is_deleted = 1, gmt_modified = now() where id = ? and is_deleted = 0";
        return jdbcTemplate.update(sql, id);
    }

    private QueryParts buildQueryParts(CategoryQueryDTO queryDTO) {
        StringBuilder whereSql = new StringBuilder();
        List<Object> args = new ArrayList<>();
        if (queryDTO.getName() != null && !queryDTO.getName().trim().isEmpty()) {
          whereSql.append(" and name like ? ");
          args.add(queryDTO.getName().trim() + "%");
        }
        if (queryDTO.getStatus() != null) {
          whereSql.append(" and status = ? ");
          args.add(queryDTO.getStatus());
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

    private String trimToEmpty(String value) {
        return value == null ? "" : value.trim();
    }

    private record QueryParts(String whereSql, List<Object> args) {
    }

    private static class CategoryRowMapper implements RowMapper<Category> {

        @Override
        public Category mapRow(ResultSet resultSet, int rowNum) throws SQLException {
            Category category = new Category();
            category.setId(resultSet.getLong("id"));
            category.setName(resultSet.getString("name"));
            category.setSlug(resultSet.getString("slug"));
            category.setDescription(resultSet.getString("description"));
            category.setSortOrder(resultSet.getInt("sort_order"));
            category.setStatus(resultSet.getInt("status"));
            category.setGmtCreate(toLocalDateTime(resultSet.getTimestamp("gmt_create")));
            category.setGmtModified(toLocalDateTime(resultSet.getTimestamp("gmt_modified")));
            return category;
        }

        private java.time.LocalDateTime toLocalDateTime(Timestamp timestamp) {
            return timestamp == null ? null : timestamp.toLocalDateTime();
        }
    }
}
