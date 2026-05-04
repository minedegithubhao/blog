package com.canbe.blog.system.mapper;

import com.canbe.blog.system.dto.DictItemCreateDTO;
import com.canbe.blog.system.dto.DictItemQueryDTO;
import com.canbe.blog.system.dto.DictItemUpdateDTO;
import com.canbe.blog.system.entity.DictItem;
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
public class DictItemMapper {

    private final JdbcTemplate jdbcTemplate;

    public DictItemMapper(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<DictItem> list(DictItemQueryDTO queryDTO) {
        QueryParts queryParts = buildQueryParts(queryDTO);
        String sql = """
            select id, type_code, type_name, item_label, item_value, sort_order, status, remark, gmt_create, gmt_modified
            from blog_dict_item
            where is_deleted = 0
            """ + queryParts.whereSql() + """
            order by type_code asc, sort_order asc, id desc
            limit ? offset ?
            """;
        int page = normalizePage(queryDTO.getPage());
        int pageSize = normalizePageSize(queryDTO.getPageSize());
        List<Object> args = new ArrayList<>(queryParts.args());
        args.add(pageSize);
        args.add((page - 1) * pageSize);
        return jdbcTemplate.query(sql, new DictItemRowMapper(), args.toArray());
    }

    public long count(DictItemQueryDTO queryDTO) {
        QueryParts queryParts = buildQueryParts(queryDTO);
        String sql = "select count(1) from blog_dict_item where is_deleted = 0" + queryParts.whereSql();
        Long total = jdbcTemplate.queryForObject(sql, Long.class, queryParts.args().toArray());
        return total == null ? 0 : total;
    }

    public Optional<DictItem> findById(Long id) {
        String sql = """
            select id, type_code, type_name, item_label, item_value, sort_order, status, remark, gmt_create, gmt_modified
            from blog_dict_item
            where id = ? and is_deleted = 0
            limit 1
            """;
        List<DictItem> items = jdbcTemplate.query(sql, new DictItemRowMapper(), id);
        return items.stream().findFirst();
    }

    public boolean existsByTypeAndValue(String typeCode, String itemValue) {
        String sql = "select count(1) from blog_dict_item where type_code = ? and item_value = ? and is_deleted = 0";
        Long count = jdbcTemplate.queryForObject(sql, Long.class, typeCode, itemValue);
        return count != null && count > 0;
    }

    public boolean existsByTypeAndValueExceptId(String typeCode, String itemValue, Long exceptId) {
        String sql = "select count(1) from blog_dict_item where type_code = ? and item_value = ? and id <> ? and is_deleted = 0";
        Long count = jdbcTemplate.queryForObject(sql, Long.class, typeCode, itemValue, exceptId == null ? 0 : exceptId);
        return count != null && count > 0;
    }

    public Long create(DictItemCreateDTO dto) {
        String sql = """
            insert into blog_dict_item (
              type_code, type_name, item_label, item_value, sort_order, status, remark, gmt_create, gmt_modified, is_deleted
            ) values (?, ?, ?, ?, ?, ?, ?, now(), now(), 0)
            """;
        jdbcTemplate.update(
            sql,
            trim(dto.getTypeCode()),
            trim(dto.getTypeName()),
            trim(dto.getItemLabel()),
            trim(dto.getItemValue()),
            dto.getSortOrder(),
            dto.getStatus(),
            trimToEmpty(dto.getRemark())
        );
        return jdbcTemplate.queryForObject("select last_insert_id()", Long.class);
    }

    public int update(Long id, DictItemUpdateDTO dto) {
        String sql = """
            update blog_dict_item
            set type_code = ?, type_name = ?, item_label = ?, item_value = ?, sort_order = ?, status = ?, remark = ?, gmt_modified = now()
            where id = ? and is_deleted = 0
            """;
        return jdbcTemplate.update(
            sql,
            trim(dto.getTypeCode()),
            trim(dto.getTypeName()),
            trim(dto.getItemLabel()),
            trim(dto.getItemValue()),
            dto.getSortOrder(),
            dto.getStatus(),
            trimToEmpty(dto.getRemark()),
            id
        );
    }

    public int delete(Long id) {
        String sql = "update blog_dict_item set is_deleted = 1, gmt_modified = now() where id = ? and is_deleted = 0";
        return jdbcTemplate.update(sql, id);
    }

    private QueryParts buildQueryParts(DictItemQueryDTO queryDTO) {
        StringBuilder whereSql = new StringBuilder();
        List<Object> args = new ArrayList<>();
        if (queryDTO.getTypeCode() != null && !queryDTO.getTypeCode().trim().isEmpty()) {
            whereSql.append(" and type_code = ? ");
            args.add(queryDTO.getTypeCode().trim());
        }
        if (queryDTO.getItemLabel() != null && !queryDTO.getItemLabel().trim().isEmpty()) {
            whereSql.append(" and item_label like ? ");
            args.add(queryDTO.getItemLabel().trim() + "%");
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

    private static class DictItemRowMapper implements RowMapper<DictItem> {

        @Override
        public DictItem mapRow(ResultSet resultSet, int rowNum) throws SQLException {
            DictItem item = new DictItem();
            item.setId(resultSet.getLong("id"));
            item.setTypeCode(resultSet.getString("type_code"));
            item.setTypeName(resultSet.getString("type_name"));
            item.setItemLabel(resultSet.getString("item_label"));
            item.setItemValue(resultSet.getString("item_value"));
            item.setSortOrder(resultSet.getInt("sort_order"));
            item.setStatus(resultSet.getInt("status"));
            item.setRemark(resultSet.getString("remark"));
            item.setGmtCreate(toLocalDateTime(resultSet.getTimestamp("gmt_create")));
            item.setGmtModified(toLocalDateTime(resultSet.getTimestamp("gmt_modified")));
            return item;
        }

        private java.time.LocalDateTime toLocalDateTime(Timestamp timestamp) {
            return timestamp == null ? null : timestamp.toLocalDateTime();
        }
    }
}
