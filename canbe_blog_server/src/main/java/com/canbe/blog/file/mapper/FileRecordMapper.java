package com.canbe.blog.file.mapper;

import com.canbe.blog.file.dto.FileQueryDTO;
import com.canbe.blog.file.entity.FileRecord;
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
public class FileRecordMapper {

    private final JdbcTemplate jdbcTemplate;

    public FileRecordMapper(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<FileRecord> list(FileQueryDTO queryDTO) {
        QueryParts queryParts = buildQueryParts(queryDTO);
        String sql = """
            select id, filename, stored_name, relative_path, url, size, content_type, gmt_create, gmt_modified
            from blog_file_record
            where is_deleted = 0
            """ + queryParts.whereSql() + """
            order by gmt_create desc, id desc
            limit ? offset ?
            """;
        int page = normalizePage(queryDTO.getPage());
        int pageSize = normalizePageSize(queryDTO.getPageSize());
        List<Object> args = new ArrayList<>(queryParts.args());
        args.add(pageSize);
        args.add((page - 1) * pageSize);
        return jdbcTemplate.query(sql, new FileRecordRowMapper(), args.toArray());
    }

    public long count(FileQueryDTO queryDTO) {
        QueryParts queryParts = buildQueryParts(queryDTO);
        String sql = "select count(1) from blog_file_record where is_deleted = 0" + queryParts.whereSql();
        Long total = jdbcTemplate.queryForObject(sql, Long.class, queryParts.args().toArray());
        return total == null ? 0 : total;
    }

    public Optional<FileRecord> findById(Long id) {
        String sql = """
            select id, filename, stored_name, relative_path, url, size, content_type, gmt_create, gmt_modified
            from blog_file_record
            where id = ? and is_deleted = 0
            limit 1
            """;
        List<FileRecord> records = jdbcTemplate.query(sql, new FileRecordRowMapper(), id);
        return records.stream().findFirst();
    }

    public Long create(String filename, String storedName, String relativePath, String url, long size, String contentType) {
        String sql = """
            insert into blog_file_record (
              filename, stored_name, relative_path, url, size, content_type, gmt_create, gmt_modified, is_deleted
            ) values (?, ?, ?, ?, ?, ?, now(), now(), 0)
            """;
        jdbcTemplate.update(sql, filename, storedName, relativePath, url, size, contentType);
        return jdbcTemplate.queryForObject("select last_insert_id()", Long.class);
    }

    public int delete(Long id) {
        String sql = "update blog_file_record set is_deleted = 1, gmt_modified = now() where id = ? and is_deleted = 0";
        return jdbcTemplate.update(sql, id);
    }

    private QueryParts buildQueryParts(FileQueryDTO queryDTO) {
        StringBuilder whereSql = new StringBuilder();
        List<Object> args = new ArrayList<>();
        if (queryDTO.getFilename() != null && !queryDTO.getFilename().trim().isEmpty()) {
            whereSql.append(" and filename like ? ");
            args.add(queryDTO.getFilename().trim() + "%");
        }
        if (queryDTO.getContentType() != null && !queryDTO.getContentType().trim().isEmpty()) {
            whereSql.append(" and content_type = ? ");
            args.add(queryDTO.getContentType().trim());
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

    private static class FileRecordRowMapper implements RowMapper<FileRecord> {

        @Override
        public FileRecord mapRow(ResultSet resultSet, int rowNum) throws SQLException {
            FileRecord record = new FileRecord();
            record.setId(resultSet.getLong("id"));
            record.setFilename(resultSet.getString("filename"));
            record.setStoredName(resultSet.getString("stored_name"));
            record.setRelativePath(resultSet.getString("relative_path"));
            record.setUrl(resultSet.getString("url"));
            record.setSize(resultSet.getLong("size"));
            record.setContentType(resultSet.getString("content_type"));
            record.setGmtCreate(toLocalDateTime(resultSet.getTimestamp("gmt_create")));
            record.setGmtModified(toLocalDateTime(resultSet.getTimestamp("gmt_modified")));
            return record;
        }

        private java.time.LocalDateTime toLocalDateTime(Timestamp timestamp) {
            return timestamp == null ? null : timestamp.toLocalDateTime();
        }
    }
}
