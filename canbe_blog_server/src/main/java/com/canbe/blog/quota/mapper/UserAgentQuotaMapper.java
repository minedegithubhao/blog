package com.canbe.blog.quota.mapper;

import com.canbe.blog.quota.dto.UserAgentQuotaQueryDTO;
import com.canbe.blog.quota.entity.UserAgentQuota;
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
public class UserAgentQuotaMapper {

    private final JdbcTemplate jdbcTemplate;

    public UserAgentQuotaMapper(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<UserAgentQuota> list(UserAgentQuotaQueryDTO queryDTO) {
        QueryParts queryParts = buildQueryParts(queryDTO);
        String sql = """
            select q.id, q.user_id, q.agent_id, q.total_quota, q.used_quota, q.remaining_quota,
                   q.gmt_create, q.gmt_modified, a.username, g.name as agent_name
            from user_agent_quota q
            join blog_account a on a.id = q.user_id and a.is_deleted = 0
            join blog_agent g on g.id = q.agent_id and g.is_deleted = 0
            where q.is_deleted = 0
            """ + queryParts.whereSql() + """
            order by q.id desc
            limit ? offset ?
            """;
        int page = normalizePage(queryDTO.getPage());
        int pageSize = normalizePageSize(queryDTO.getPageSize());
        List<Object> args = new ArrayList<>(queryParts.args());
        args.add(pageSize);
        args.add((page - 1) * pageSize);
        return jdbcTemplate.query(sql, new UserAgentQuotaRowMapper(), args.toArray());
    }

    public long count(UserAgentQuotaQueryDTO queryDTO) {
        QueryParts queryParts = buildQueryParts(queryDTO);
        String sql = "select count(1) from user_agent_quota q where q.is_deleted = 0" + queryParts.whereSql();
        Long total = jdbcTemplate.queryForObject(sql, Long.class, queryParts.args().toArray());
        return total == null ? 0 : total;
    }

    public Optional<UserAgentQuota> findById(Long id) {
        String sql = """
            select q.id, q.user_id, q.agent_id, q.total_quota, q.used_quota, q.remaining_quota,
                   q.gmt_create, q.gmt_modified, a.username, g.name as agent_name
            from user_agent_quota q
            join blog_account a on a.id = q.user_id and a.is_deleted = 0
            join blog_agent g on g.id = q.agent_id and g.is_deleted = 0
            where q.id = ? and q.is_deleted = 0
            limit 1
            """;
        List<UserAgentQuota> quotas = jdbcTemplate.query(sql, new UserAgentQuotaRowMapper(), id);
        return quotas.stream().findFirst();
    }

    public Optional<UserAgentQuota> findByUserAndAgent(Long userId, Long agentId) {
        String sql = """
            select q.id, q.user_id, q.agent_id, q.total_quota, q.used_quota, q.remaining_quota,
                   q.gmt_create, q.gmt_modified, a.username, g.name as agent_name
            from user_agent_quota q
            join blog_account a on a.id = q.user_id and a.is_deleted = 0
            join blog_agent g on g.id = q.agent_id and g.is_deleted = 0
            where q.user_id = ? and q.agent_id = ? and q.is_deleted = 0
            limit 1
            """;
        List<UserAgentQuota> quotas = jdbcTemplate.query(sql, new UserAgentQuotaRowMapper(), userId, agentId);
        return quotas.stream().findFirst();
    }

    public Long create(Long userId, Long agentId, int totalQuota, int usedQuota, int remainingQuota) {
        String sql = """
            insert into user_agent_quota (
              user_id, agent_id, total_quota, used_quota, remaining_quota, gmt_create, gmt_modified, is_deleted
            ) values (?, ?, ?, ?, ?, now(), now(), 0)
            """;
        jdbcTemplate.update(sql, userId, agentId, totalQuota, usedQuota, remainingQuota);
        return jdbcTemplate.queryForObject("select last_insert_id()", Long.class);
    }

    public void createIfAbsent(Long userId, Long agentId, int totalQuota, int usedQuota, int remainingQuota) {
        String sql = """
            insert ignore into user_agent_quota (
              user_id, agent_id, total_quota, used_quota, remaining_quota, gmt_create, gmt_modified, is_deleted
            ) values (?, ?, ?, ?, ?, now(), now(), 0)
            """;
        jdbcTemplate.update(sql, userId, agentId, totalQuota, usedQuota, remainingQuota);
    }

    public int update(Long id, int totalQuota, int remainingQuota) {
        String sql = """
            update user_agent_quota
            set total_quota = ?, remaining_quota = ?, gmt_modified = now()
            where id = ? and is_deleted = 0
            """;
        return jdbcTemplate.update(sql, totalQuota, remainingQuota, id);
    }

    public int consumeOne(Long userId, Long agentId) {
        String sql = """
            update user_agent_quota
            set used_quota = used_quota + 1,
                remaining_quota = remaining_quota - 1,
                gmt_modified = now()
            where user_id = ? and agent_id = ? and remaining_quota > 0 and is_deleted = 0
            """;
        return jdbcTemplate.update(sql, userId, agentId);
    }

    private QueryParts buildQueryParts(UserAgentQuotaQueryDTO queryDTO) {
        StringBuilder whereSql = new StringBuilder();
        List<Object> args = new ArrayList<>();
        if (queryDTO.getUserId() != null && queryDTO.getUserId() > 0) {
            whereSql.append(" and q.user_id = ? ");
            args.add(queryDTO.getUserId());
        }
        if (queryDTO.getAgentId() != null && queryDTO.getAgentId() > 0) {
            whereSql.append(" and q.agent_id = ? ");
            args.add(queryDTO.getAgentId());
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

    private record QueryParts(String whereSql, List<Object> args) {
    }

    private static class UserAgentQuotaRowMapper implements RowMapper<UserAgentQuota> {

        @Override
        public UserAgentQuota mapRow(ResultSet resultSet, int rowNum) throws SQLException {
            UserAgentQuota quota = new UserAgentQuota();
            quota.setId(resultSet.getLong("id"));
            quota.setUserId(resultSet.getLong("user_id"));
            quota.setAgentId(resultSet.getLong("agent_id"));
            quota.setTotalQuota(resultSet.getInt("total_quota"));
            quota.setUsedQuota(resultSet.getInt("used_quota"));
            quota.setRemainingQuota(resultSet.getInt("remaining_quota"));
            quota.setUsername(resultSet.getString("username"));
            quota.setAgentName(resultSet.getString("agent_name"));
            quota.setGmtCreate(toLocalDateTime(resultSet.getTimestamp("gmt_create")));
            quota.setGmtModified(toLocalDateTime(resultSet.getTimestamp("gmt_modified")));
            return quota;
        }

        private java.time.LocalDateTime toLocalDateTime(Timestamp timestamp) {
            return timestamp == null ? null : timestamp.toLocalDateTime();
        }
    }
}
