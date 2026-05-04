package com.canbe.blog.user.mapper;

import com.canbe.blog.user.dto.RoleCreateDTO;
import com.canbe.blog.user.dto.RoleQueryDTO;
import com.canbe.blog.user.dto.RoleUpdateDTO;
import com.canbe.blog.user.entity.Role;
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
public class RoleMapper {

    private final JdbcTemplate jdbcTemplate;

    public RoleMapper(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Role> list(RoleQueryDTO queryDTO) {
        QueryParts queryParts = buildQueryParts(queryDTO);
        String sql = """
            select id, name, code, description, status, gmt_create, gmt_modified
            from blog_role
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
        return jdbcTemplate.query(sql, new RoleRowMapper(), args.toArray());
    }

    public long count(RoleQueryDTO queryDTO) {
        QueryParts queryParts = buildQueryParts(queryDTO);
        String sql = "select count(1) from blog_role where is_deleted = 0" + queryParts.whereSql();
        Long total = jdbcTemplate.queryForObject(sql, Long.class, queryParts.args().toArray());
        return total == null ? 0 : total;
    }

    public Optional<Role> findById(Long id) {
        String sql = """
            select id, name, code, description, status, gmt_create, gmt_modified
            from blog_role
            where id = ? and is_deleted = 0
            limit 1
            """;
        List<Role> roles = jdbcTemplate.query(sql, new RoleRowMapper(), id);
        return roles.stream().findFirst();
    }

    public Optional<Role> findByCode(String code) {
        String sql = """
            select id, name, code, description, status, gmt_create, gmt_modified
            from blog_role
            where code = ? and is_deleted = 0
            limit 1
            """;
        List<Role> roles = jdbcTemplate.query(sql, new RoleRowMapper(), code);
        return roles.stream().findFirst();
    }

    public List<String> listAllCodes() {
        String sql = "select code from blog_role where is_deleted = 0 order by id asc";
        return jdbcTemplate.query(sql, (resultSet, rowNum) -> resultSet.getString("code"));
    }

    public boolean existsByName(String name) {
        String sql = "select count(1) from blog_role where name = ? and is_deleted = 0";
        Long count = jdbcTemplate.queryForObject(sql, Long.class, name);
        return count != null && count > 0;
    }

    public boolean existsByNameExceptId(String name, Long exceptId) {
        String sql = "select count(1) from blog_role where name = ? and id <> ? and is_deleted = 0";
        Long count = jdbcTemplate.queryForObject(sql, Long.class, name, exceptId == null ? 0 : exceptId);
        return count != null && count > 0;
    }

    public boolean existsByCode(String code) {
        String sql = "select count(1) from blog_role where code = ? and is_deleted = 0";
        Long count = jdbcTemplate.queryForObject(sql, Long.class, code);
        return count != null && count > 0;
    }

    public boolean existsByCodeExceptId(String code, Long exceptId) {
        String sql = "select count(1) from blog_role where code = ? and id <> ? and is_deleted = 0";
        Long count = jdbcTemplate.queryForObject(sql, Long.class, code, exceptId == null ? 0 : exceptId);
        return count != null && count > 0;
    }

    public Long create(RoleCreateDTO dto) {
        String sql = """
            insert into blog_role (
              name, code, description, status, gmt_create, gmt_modified, is_deleted
            ) values (?, ?, ?, ?, now(), now(), 0)
            """;
        jdbcTemplate.update(sql, trim(dto.getName()), trim(dto.getCode()), trimToEmpty(dto.getDescription()), dto.getStatus());
        return jdbcTemplate.queryForObject("select last_insert_id()", Long.class);
    }

    public int update(Long id, RoleUpdateDTO dto) {
        String sql = """
            update blog_role
            set name = ?, code = ?, description = ?, status = ?, gmt_modified = now()
            where id = ? and is_deleted = 0
            """;
        return jdbcTemplate.update(sql, trim(dto.getName()), trim(dto.getCode()), trimToEmpty(dto.getDescription()), dto.getStatus(), id);
    }

    public int delete(Long id) {
        String sql = "update blog_role set is_deleted = 1, gmt_modified = now() where id = ? and is_deleted = 0";
        return jdbcTemplate.update(sql, id);
    }

    private QueryParts buildQueryParts(RoleQueryDTO queryDTO) {
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

    private static class RoleRowMapper implements RowMapper<Role> {

        @Override
        public Role mapRow(ResultSet resultSet, int rowNum) throws SQLException {
            Role role = new Role();
            role.setId(resultSet.getLong("id"));
            role.setName(resultSet.getString("name"));
            role.setCode(resultSet.getString("code"));
            role.setDescription(resultSet.getString("description"));
            role.setStatus(resultSet.getInt("status"));
            role.setGmtCreate(toLocalDateTime(resultSet.getTimestamp("gmt_create")));
            role.setGmtModified(toLocalDateTime(resultSet.getTimestamp("gmt_modified")));
            return role;
        }

        private java.time.LocalDateTime toLocalDateTime(Timestamp timestamp) {
            return timestamp == null ? null : timestamp.toLocalDateTime();
        }
    }
}
