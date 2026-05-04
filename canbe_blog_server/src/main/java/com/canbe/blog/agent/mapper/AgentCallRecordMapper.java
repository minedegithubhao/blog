package com.canbe.blog.agent.mapper;

import com.canbe.blog.agent.dto.AgentCallRecordQueryDTO;
import com.canbe.blog.agent.entity.AgentCallRecord;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

@Repository
public class AgentCallRecordMapper {

    private final JdbcTemplate jdbcTemplate;

    public AgentCallRecordMapper(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<AgentCallRecord> list(AgentCallRecordQueryDTO queryDTO) {
        QueryParts queryParts = buildQueryParts(queryDTO);
        String sql = """
            select id, user_id, agent_id, username, agent_name, prompt, response_text,
                   status, error_code, error_message, duration_ms, gmt_create, gmt_modified
            from blog_agent_call_record
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
        return jdbcTemplate.query(sql, new AgentCallRecordRowMapper(), args.toArray());
    }

    public long count(AgentCallRecordQueryDTO queryDTO) {
        QueryParts queryParts = buildQueryParts(queryDTO);
        String sql = "select count(1) from blog_agent_call_record where is_deleted = 0" + queryParts.whereSql();
        Long total = jdbcTemplate.queryForObject(sql, Long.class, queryParts.args().toArray());
        return total == null ? 0 : total;
    }

    public Long create(AgentCallRecord record) {
        String sql = """
            insert into blog_agent_call_record (
              user_id, agent_id, username, agent_name, prompt, response_text,
              status, error_code, error_message, duration_ms, gmt_create, gmt_modified, is_deleted
            ) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, now(), now(), 0)
            """;
        jdbcTemplate.update(
            sql,
            record.getUserId(),
            record.getAgentId(),
            trimToEmpty(record.getUsername()),
            trimToEmpty(record.getAgentName()),
            trimToEmpty(record.getPrompt()),
            record.getResponseText(),
            trimToEmpty(record.getStatus()),
            trimToEmpty(record.getErrorCode()),
            trimToEmpty(record.getErrorMessage()),
            record.getDurationMs() == null ? 0L : record.getDurationMs()
        );
        return jdbcTemplate.queryForObject("select last_insert_id()", Long.class);
    }

    private QueryParts buildQueryParts(AgentCallRecordQueryDTO queryDTO) {
        StringBuilder whereSql = new StringBuilder();
        List<Object> args = new ArrayList<>();
        if (queryDTO.getUserId() != null && queryDTO.getUserId() > 0) {
            whereSql.append(" and user_id = ? ");
            args.add(queryDTO.getUserId());
        }
        if (queryDTO.getAgentId() != null && queryDTO.getAgentId() > 0) {
            whereSql.append(" and agent_id = ? ");
            args.add(queryDTO.getAgentId());
        }
        if (queryDTO.getStatus() != null && !queryDTO.getStatus().trim().isEmpty()) {
            whereSql.append(" and status = ? ");
            args.add(queryDTO.getStatus().trim());
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

    private String trimToEmpty(String value) {
        return value == null ? "" : value.trim();
    }

    private record QueryParts(String whereSql, List<Object> args) {
    }

    private static class AgentCallRecordRowMapper implements RowMapper<AgentCallRecord> {

        @Override
        public AgentCallRecord mapRow(ResultSet resultSet, int rowNum) throws SQLException {
            AgentCallRecord record = new AgentCallRecord();
            record.setId(resultSet.getLong("id"));
            record.setUserId(resultSet.getLong("user_id"));
            record.setAgentId(resultSet.getLong("agent_id"));
            record.setUsername(resultSet.getString("username"));
            record.setAgentName(resultSet.getString("agent_name"));
            record.setPrompt(resultSet.getString("prompt"));
            record.setResponseText(resultSet.getString("response_text"));
            record.setStatus(resultSet.getString("status"));
            record.setErrorCode(resultSet.getString("error_code"));
            record.setErrorMessage(resultSet.getString("error_message"));
            record.setDurationMs(resultSet.getLong("duration_ms"));
            record.setGmtCreate(toLocalDateTime(resultSet.getTimestamp("gmt_create")));
            record.setGmtModified(toLocalDateTime(resultSet.getTimestamp("gmt_modified")));
            return record;
        }

        private java.time.LocalDateTime toLocalDateTime(Timestamp timestamp) {
            return timestamp == null ? null : timestamp.toLocalDateTime();
        }
    }
}
