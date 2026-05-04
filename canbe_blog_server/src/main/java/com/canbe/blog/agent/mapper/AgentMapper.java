package com.canbe.blog.agent.mapper;

import com.canbe.blog.agent.dto.AgentCreateDTO;
import com.canbe.blog.agent.dto.AgentQueryDTO;
import com.canbe.blog.agent.dto.AgentUpdateDTO;
import com.canbe.blog.agent.entity.Agent;
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
public class AgentMapper {

    private final JdbcTemplate jdbcTemplate;

    public AgentMapper(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Agent> list(AgentQueryDTO queryDTO) {
        QueryParts queryParts = buildQueryParts(queryDTO);
        String sql = """
            select id, name, code, description, avatar_url, runtime_url, embed_url, provider_type, api_url, api_key, response_mode, status, sort_order, gmt_create, gmt_modified
            from blog_agent
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
        return jdbcTemplate.query(sql, new AgentRowMapper(), args.toArray());
    }

    public long count(AgentQueryDTO queryDTO) {
        QueryParts queryParts = buildQueryParts(queryDTO);
        String sql = "select count(1) from blog_agent where is_deleted = 0" + queryParts.whereSql();
        Long total = jdbcTemplate.queryForObject(sql, Long.class, queryParts.args().toArray());
        return total == null ? 0 : total;
    }

    public List<Agent> listPublished(AgentQueryDTO queryDTO) {
        queryDTO.setStatus(1);
        return list(queryDTO);
    }

    public long countPublished(AgentQueryDTO queryDTO) {
        queryDTO.setStatus(1);
        return count(queryDTO);
    }

    public Optional<Agent> findById(Long id) {
        String sql = """
            select id, name, code, description, avatar_url, runtime_url, embed_url, provider_type, api_url, api_key, response_mode, status, sort_order, gmt_create, gmt_modified
            from blog_agent
            where id = ? and is_deleted = 0
            limit 1
            """;
        List<Agent> agents = jdbcTemplate.query(sql, new AgentRowMapper(), id);
        return agents.stream().findFirst();
    }

    public boolean existsByName(String name) {
        String sql = "select count(1) from blog_agent where name = ? and is_deleted = 0";
        Long count = jdbcTemplate.queryForObject(sql, Long.class, name);
        return count != null && count > 0;
    }

    public boolean existsByNameExceptId(String name, Long exceptId) {
        String sql = "select count(1) from blog_agent where name = ? and id <> ? and is_deleted = 0";
        Long count = jdbcTemplate.queryForObject(sql, Long.class, name, exceptId == null ? 0 : exceptId);
        return count != null && count > 0;
    }

    public boolean existsByCode(String code) {
        String sql = "select count(1) from blog_agent where code = ? and is_deleted = 0";
        Long count = jdbcTemplate.queryForObject(sql, Long.class, code);
        return count != null && count > 0;
    }

    public boolean existsByCodeExceptId(String code, Long exceptId) {
        String sql = "select count(1) from blog_agent where code = ? and id <> ? and is_deleted = 0";
        Long count = jdbcTemplate.queryForObject(sql, Long.class, code, exceptId == null ? 0 : exceptId);
        return count != null && count > 0;
    }

    public List<Long> listAllIds() {
        return jdbcTemplate.query("select id from blog_agent where is_deleted = 0 order by id asc", (rs, rowNum) -> rs.getLong("id"));
    }

    public Long create(AgentCreateDTO dto) {
        String sql = """
            insert into blog_agent (
              name, code, description, avatar_url, runtime_url, embed_url, provider_type, api_url, api_key, response_mode, status, sort_order, gmt_create, gmt_modified, is_deleted
            ) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, now(), now(), 0)
            """;
        jdbcTemplate.update(
            sql,
            trim(dto.getName()),
            trim(dto.getCode()),
            trimToEmpty(dto.getDescription()),
            trimToEmpty(dto.getAvatarUrl()),
            trimToEmpty(dto.getRuntimeUrl()),
            trimToEmpty(dto.getEmbedUrl()),
            trimToEmpty(dto.getProviderType()),
            trimToEmpty(dto.getApiUrl()),
            trimToEmpty(dto.getApiKey()),
            trimToEmpty(dto.getResponseMode()),
            dto.getStatus(),
            dto.getSortOrder()
        );
        return jdbcTemplate.queryForObject("select last_insert_id()", Long.class);
    }

    public int update(Long id, AgentUpdateDTO dto) {
        String sql = """
            update blog_agent
            set name = ?, code = ?, description = ?, avatar_url = ?, runtime_url = ?, embed_url = ?, provider_type = ?, api_url = ?, api_key = ?, response_mode = ?, status = ?, sort_order = ?, gmt_modified = now()
            where id = ? and is_deleted = 0
            """;
        return jdbcTemplate.update(
            sql,
            trim(dto.getName()),
            trim(dto.getCode()),
            trimToEmpty(dto.getDescription()),
            trimToEmpty(dto.getAvatarUrl()),
            trimToEmpty(dto.getRuntimeUrl()),
            trimToEmpty(dto.getEmbedUrl()),
            trimToEmpty(dto.getProviderType()),
            trimToEmpty(dto.getApiUrl()),
            trimToEmpty(dto.getApiKey()),
            trimToEmpty(dto.getResponseMode()),
            dto.getStatus(),
            dto.getSortOrder(),
            id
        );
    }

    public int delete(Long id) {
        String sql = "update blog_agent set is_deleted = 1, gmt_modified = now() where id = ? and is_deleted = 0";
        return jdbcTemplate.update(sql, id);
    }

    private QueryParts buildQueryParts(AgentQueryDTO queryDTO) {
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

    private static class AgentRowMapper implements RowMapper<Agent> {

        @Override
        public Agent mapRow(ResultSet resultSet, int rowNum) throws SQLException {
            Agent agent = new Agent();
            agent.setId(resultSet.getLong("id"));
            agent.setName(resultSet.getString("name"));
            agent.setCode(resultSet.getString("code"));
            agent.setDescription(resultSet.getString("description"));
            agent.setAvatarUrl(resultSet.getString("avatar_url"));
            agent.setRuntimeUrl(resultSet.getString("runtime_url"));
            agent.setEmbedUrl(resultSet.getString("embed_url"));
            agent.setProviderType(resultSet.getString("provider_type"));
            agent.setApiUrl(resultSet.getString("api_url"));
            agent.setApiKey(resultSet.getString("api_key"));
            agent.setResponseMode(resultSet.getString("response_mode"));
            agent.setStatus(resultSet.getInt("status"));
            agent.setSortOrder(resultSet.getInt("sort_order"));
            agent.setGmtCreate(toLocalDateTime(resultSet.getTimestamp("gmt_create")));
            agent.setGmtModified(toLocalDateTime(resultSet.getTimestamp("gmt_modified")));
            return agent;
        }

        private java.time.LocalDateTime toLocalDateTime(Timestamp timestamp) {
            return timestamp == null ? null : timestamp.toLocalDateTime();
        }
    }
}
