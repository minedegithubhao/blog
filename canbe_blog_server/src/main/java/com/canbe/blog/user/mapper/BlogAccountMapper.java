package com.canbe.blog.user.mapper;

import com.canbe.blog.user.dto.AdminAccountCreateDTO;
import com.canbe.blog.user.dto.AdminAccountQueryDTO;
import com.canbe.blog.user.dto.AdminAccountUpdateDTO;
import com.canbe.blog.user.entity.BlogAccount;
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
public class BlogAccountMapper {

    private final JdbcTemplate jdbcTemplate;

    public BlogAccountMapper(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<BlogAccount> list(AdminAccountQueryDTO queryDTO) {
        QueryParts queryParts = buildQueryParts(queryDTO);
        String sql = """
            select id, username, email, password_hash, nickname, role_code, status,
                   last_login_at, gmt_create, gmt_modified
            from blog_account
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
        return jdbcTemplate.query(sql, new BlogAccountRowMapper(), args.toArray());
    }

    public long count(AdminAccountQueryDTO queryDTO) {
        QueryParts queryParts = buildQueryParts(queryDTO);
        String sql = "select count(1) from blog_account where is_deleted = 0" + queryParts.whereSql();
        Long total = jdbcTemplate.queryForObject(sql, Long.class, queryParts.args().toArray());
        return total == null ? 0 : total;
    }

    public Optional<BlogAccount> findByUsernameOrEmail(String accountName) {
        String sql = """
            select id, username, email, password_hash, nickname, role_code, status,
                   last_login_at, gmt_create, gmt_modified
            from blog_account
            where is_deleted = 0 and (username = ? or email = ?)
            limit 1
            """;
        List<BlogAccount> accounts = jdbcTemplate.query(sql, new BlogAccountRowMapper(), accountName, accountName);
        return accounts.stream().findFirst();
    }

    public Optional<BlogAccount> findById(Long id) {
        String sql = """
            select id, username, email, password_hash, nickname, role_code, status,
                   last_login_at, gmt_create, gmt_modified
            from blog_account
            where id = ? and is_deleted = 0
            limit 1
            """;
        List<BlogAccount> accounts = jdbcTemplate.query(sql, new BlogAccountRowMapper(), id);
        return accounts.stream().findFirst();
    }

    public List<BlogAccount> listEnabledAccounts() {
        String sql = """
            select id, username, email, password_hash, nickname, role_code, status,
                   last_login_at, gmt_create, gmt_modified
            from blog_account
            where is_deleted = 0 and status = 1
            order by id asc
            """;
        return jdbcTemplate.query(sql, new BlogAccountRowMapper());
    }

    public boolean existsByUsername(String username) {
        String sql = "select count(1) from blog_account where username = ? and is_deleted = 0";
        Long count = jdbcTemplate.queryForObject(sql, Long.class, username);
        return count != null && count > 0;
    }

    public boolean existsByEmailExceptId(String email, Long exceptId) {
        if (email == null || email.isBlank()) {
            return false;
        }
        String sql = "select count(1) from blog_account where email = ? and id <> ? and is_deleted = 0";
        Long count = jdbcTemplate.queryForObject(sql, Long.class, email, exceptId == null ? 0 : exceptId);
        return count != null && count > 0;
    }

    public boolean existsByRoleCode(String roleCode) {
        String sql = "select count(1) from blog_account where role_code = ? and is_deleted = 0";
        Long count = jdbcTemplate.queryForObject(sql, Long.class, roleCode);
        return count != null && count > 0;
    }

    public Long create(AdminAccountCreateDTO dto, String passwordHash) {
        String sql = """
            insert into blog_account (
              username, email, password_hash, nickname, role_code, status,
              gmt_create, gmt_modified, is_deleted
            ) values (?, ?, ?, ?, ?, ?, now(), now(), 0)
            """;
        jdbcTemplate.update(
            sql,
            trim(dto.getUsername()),
            trimToNull(dto.getEmail()),
            passwordHash,
            trim(dto.getNickname()),
            trim(dto.getRoleCode()),
            dto.getStatus()
        );
        return jdbcTemplate.queryForObject("select last_insert_id()", Long.class);
    }

    public Long createRegisteredAccount(String username, String passwordHash, String nickname) {
        String sql = """
            insert into blog_account (
              username, email, password_hash, nickname, role_code, status,
              gmt_create, gmt_modified, is_deleted
            ) values (?, null, ?, ?, 'USER', 1, now(), now(), 0)
            """;
        jdbcTemplate.update(sql, trim(username), passwordHash, trim(nickname));
        return jdbcTemplate.queryForObject("select last_insert_id()", Long.class);
    }

    public int update(Long id, AdminAccountUpdateDTO dto) {
        String sql = """
            update blog_account
            set email = ?, nickname = ?, role_code = ?, status = ?, gmt_modified = now()
            where id = ? and is_deleted = 0
            """;
        return jdbcTemplate.update(
            sql,
            trimToNull(dto.getEmail()),
            trim(dto.getNickname()),
            trim(dto.getRoleCode()),
            dto.getStatus(),
            id
        );
    }

    public int delete(Long id) {
        String sql = "update blog_account set is_deleted = 1, gmt_modified = now() where id = ? and is_deleted = 0";
        return jdbcTemplate.update(sql, id);
    }

    public void updateLastLoginAt(Long accountId) {
        String sql = "update blog_account set last_login_at = now() where id = ? and is_deleted = 0";
        jdbcTemplate.update(sql, accountId);
    }

    private QueryParts buildQueryParts(AdminAccountQueryDTO queryDTO) {
        StringBuilder whereSql = new StringBuilder();
        List<Object> args = new ArrayList<>();
        if (queryDTO.getUsername() != null && !queryDTO.getUsername().trim().isEmpty()) {
            whereSql.append(" and username like ? ");
            args.add(queryDTO.getUsername().trim() + "%");
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

    private String trimToNull(String value) {
        if (value == null || value.trim().isEmpty()) {
            return null;
        }
        return value.trim();
    }

    private record QueryParts(String whereSql, List<Object> args) {
    }

    private static class BlogAccountRowMapper implements RowMapper<BlogAccount> {

        @Override
        public BlogAccount mapRow(ResultSet resultSet, int rowNum) throws SQLException {
            BlogAccount account = new BlogAccount();
            account.setId(resultSet.getLong("id"));
            account.setUsername(resultSet.getString("username"));
            account.setEmail(resultSet.getString("email"));
            account.setPasswordHash(resultSet.getString("password_hash"));
            account.setNickname(resultSet.getString("nickname"));
            account.setRoleCode(resultSet.getString("role_code"));
            account.setStatus(resultSet.getInt("status"));
            account.setLastLoginAt(toLocalDateTime(resultSet.getTimestamp("last_login_at")));
            account.setGmtCreate(toLocalDateTime(resultSet.getTimestamp("gmt_create")));
            account.setGmtModified(toLocalDateTime(resultSet.getTimestamp("gmt_modified")));
            return account;
        }

        private java.time.LocalDateTime toLocalDateTime(Timestamp timestamp) {
            return timestamp == null ? null : timestamp.toLocalDateTime();
        }
    }
}
