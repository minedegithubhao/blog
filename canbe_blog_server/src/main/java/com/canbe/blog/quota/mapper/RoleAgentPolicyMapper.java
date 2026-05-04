package com.canbe.blog.quota.mapper;

import com.canbe.blog.quota.dto.RoleAgentPolicyQueryDTO;
import com.canbe.blog.quota.entity.RoleAgentPolicy;
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
public class RoleAgentPolicyMapper {

    private final JdbcTemplate jdbcTemplate;

    public RoleAgentPolicyMapper(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<RoleAgentPolicy> list(RoleAgentPolicyQueryDTO queryDTO) {
        QueryParts queryParts = buildQueryParts(queryDTO);
        String sql = """
            select p.id, p.role_code, p.agent_id, p.enabled, p.total_quota, p.gmt_create, p.gmt_modified, g.name as agent_name
            from role_agent_policy p
            join blog_agent g on g.id = p.agent_id and g.is_deleted = 0
            where p.is_deleted = 0
            """ + queryParts.whereSql() + """
            order by p.role_code asc, p.agent_id asc
            limit ? offset ?
            """;
        int page = normalizePage(queryDTO.getPage());
        int pageSize = normalizePageSize(queryDTO.getPageSize());
        List<Object> args = new ArrayList<>(queryParts.args());
        args.add(pageSize);
        args.add((page - 1) * pageSize);
        return jdbcTemplate.query(sql, new RoleAgentPolicyRowMapper(), args.toArray());
    }

    public long count(RoleAgentPolicyQueryDTO queryDTO) {
        QueryParts queryParts = buildQueryParts(queryDTO);
        String sql = "select count(1) from role_agent_policy p where p.is_deleted = 0" + queryParts.whereSql();
        Long total = jdbcTemplate.queryForObject(sql, Long.class, queryParts.args().toArray());
        return total == null ? 0 : total;
    }

    public Optional<RoleAgentPolicy> findById(Long id) {
        String sql = """
            select p.id, p.role_code, p.agent_id, p.enabled, p.total_quota, p.gmt_create, p.gmt_modified, g.name as agent_name
            from role_agent_policy p
            join blog_agent g on g.id = p.agent_id and g.is_deleted = 0
            where p.id = ? and p.is_deleted = 0
            limit 1
            """;
        List<RoleAgentPolicy> policies = jdbcTemplate.query(sql, new RoleAgentPolicyRowMapper(), id);
        return policies.stream().findFirst();
    }

    public Optional<RoleAgentPolicy> findByRoleAndAgent(String roleCode, Long agentId) {
        String sql = """
            select p.id, p.role_code, p.agent_id, p.enabled, p.total_quota, p.gmt_create, p.gmt_modified, g.name as agent_name
            from role_agent_policy p
            join blog_agent g on g.id = p.agent_id and g.is_deleted = 0
            where p.role_code = ? and p.agent_id = ? and p.is_deleted = 0
            limit 1
            """;
        List<RoleAgentPolicy> policies = jdbcTemplate.query(sql, new RoleAgentPolicyRowMapper(), roleCode, agentId);
        return policies.stream().findFirst();
    }

    public List<RoleAgentPolicy> listEnabledByRoleCode(String roleCode) {
        String sql = """
            select p.id, p.role_code, p.agent_id, p.enabled, p.total_quota, p.gmt_create, p.gmt_modified, g.name as agent_name
            from role_agent_policy p
            join blog_agent g on g.id = p.agent_id and g.is_deleted = 0
            where p.role_code = ? and p.enabled = 1 and p.is_deleted = 0
            order by p.agent_id asc
            """;
        return jdbcTemplate.query(sql, new RoleAgentPolicyRowMapper(), roleCode);
    }

    public Long create(String roleCode, Long agentId, int enabled, int totalQuota) {
        String sql = """
            insert into role_agent_policy (
              role_code, agent_id, enabled, total_quota, gmt_create, gmt_modified, is_deleted
            ) values (?, ?, ?, ?, now(), now(), 0)
            """;
        jdbcTemplate.update(sql, roleCode, agentId, enabled, totalQuota);
        return jdbcTemplate.queryForObject("select last_insert_id()", Long.class);
    }

    public void createIfAbsent(String roleCode, Long agentId, int enabled, int totalQuota) {
        String sql = """
            insert ignore into role_agent_policy (
              role_code, agent_id, enabled, total_quota, gmt_create, gmt_modified, is_deleted
            ) values (?, ?, ?, ?, now(), now(), 0)
            """;
        jdbcTemplate.update(sql, roleCode, agentId, enabled, totalQuota);
    }

    public int update(Long id, int enabled, int totalQuota) {
        String sql = """
            update role_agent_policy
            set enabled = ?, total_quota = ?, gmt_modified = now()
            where id = ? and is_deleted = 0
            """;
        return jdbcTemplate.update(sql, enabled, totalQuota, id);
    }

    private QueryParts buildQueryParts(RoleAgentPolicyQueryDTO queryDTO) {
        StringBuilder whereSql = new StringBuilder();
        List<Object> args = new ArrayList<>();
        if (queryDTO.getRoleCode() != null && !queryDTO.getRoleCode().trim().isEmpty()) {
            whereSql.append(" and p.role_code = ? ");
            args.add(queryDTO.getRoleCode().trim());
        }
        if (queryDTO.getAgentId() != null && queryDTO.getAgentId() > 0) {
            whereSql.append(" and p.agent_id = ? ");
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

    private static class RoleAgentPolicyRowMapper implements RowMapper<RoleAgentPolicy> {

        @Override
        public RoleAgentPolicy mapRow(ResultSet resultSet, int rowNum) throws SQLException {
            RoleAgentPolicy policy = new RoleAgentPolicy();
            policy.setId(resultSet.getLong("id"));
            policy.setRoleCode(resultSet.getString("role_code"));
            policy.setAgentId(resultSet.getLong("agent_id"));
            policy.setEnabled(resultSet.getInt("enabled"));
            policy.setTotalQuota(resultSet.getInt("total_quota"));
            policy.setAgentName(resultSet.getString("agent_name"));
            policy.setGmtCreate(toLocalDateTime(resultSet.getTimestamp("gmt_create")));
            policy.setGmtModified(toLocalDateTime(resultSet.getTimestamp("gmt_modified")));
            return policy;
        }

        private java.time.LocalDateTime toLocalDateTime(Timestamp timestamp) {
            return timestamp == null ? null : timestamp.toLocalDateTime();
        }
    }
}
