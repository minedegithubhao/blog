package com.canbe.blog.system.mapper;

import com.canbe.blog.system.dto.MenuCreateDTO;
import com.canbe.blog.system.dto.MenuQueryDTO;
import com.canbe.blog.system.dto.MenuUpdateDTO;
import com.canbe.blog.system.entity.Menu;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

@Repository
public class MenuMapper {

    private final JdbcTemplate jdbcTemplate;

    public MenuMapper(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Menu> list(MenuQueryDTO queryDTO) {
        QueryParts queryParts = buildQueryParts(queryDTO);
        String sql = """
            select id, parent_id, name, title, path, component, icon, type, permission,
                   sort_order, visible, status, gmt_create, gmt_modified
            from blog_menu
            where is_deleted = 0
            """ + queryParts.whereSql() + """
            order by sort_order asc, id asc
            limit ? offset ?
            """;
        int page = normalizePage(queryDTO.getPage());
        int pageSize = normalizePageSize(queryDTO.getPageSize());
        List<Object> args = new ArrayList<>(queryParts.args());
        args.add(pageSize);
        args.add((page - 1) * pageSize);
        return jdbcTemplate.query(sql, new MenuRowMapper(), args.toArray());
    }

    public List<Menu> listAll() {
        String sql = """
            select id, parent_id, name, title, path, component, icon, type, permission,
                   sort_order, visible, status, gmt_create, gmt_modified
            from blog_menu
            where is_deleted = 0
            order by sort_order asc, id asc
            """;
        return jdbcTemplate.query(sql, new MenuRowMapper());
    }

    public long count(MenuQueryDTO queryDTO) {
        QueryParts queryParts = buildQueryParts(queryDTO);
        String sql = "select count(1) from blog_menu where is_deleted = 0" + queryParts.whereSql();
        Long total = jdbcTemplate.queryForObject(sql, Long.class, queryParts.args().toArray());
        return total == null ? 0 : total;
    }

    public Optional<Menu> findById(Long id) {
        String sql = """
            select id, parent_id, name, title, path, component, icon, type, permission,
                   sort_order, visible, status, gmt_create, gmt_modified
            from blog_menu
            where id = ? and is_deleted = 0
            limit 1
            """;
        List<Menu> menus = jdbcTemplate.query(sql, new MenuRowMapper(), id);
        return menus.stream().findFirst();
    }

    public boolean existsByParentId(Long parentId) {
        String sql = "select count(1) from blog_menu where parent_id = ? and is_deleted = 0";
        Long count = jdbcTemplate.queryForObject(sql, Long.class, parentId);
        return count != null && count > 0;
    }

    public Long create(MenuCreateDTO dto) {
        String sql = """
            insert into blog_menu (
              parent_id, name, title, path, component, icon, type, permission,
              sort_order, visible, status, gmt_create, gmt_modified, is_deleted
            ) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, now(), now(), 0)
            """;
        jdbcTemplate.update(
            sql,
            dto.getParentId(),
            trim(dto.getName()),
            trim(dto.getTitle()),
            trim(dto.getPath()),
            trimToEmpty(dto.getComponent()),
            trimToEmpty(dto.getIcon()),
            trim(dto.getType()),
            trimToEmpty(dto.getPermission()),
            dto.getSortOrder(),
            dto.getVisible(),
            dto.getStatus()
        );
        return jdbcTemplate.queryForObject("select last_insert_id()", Long.class);
    }

    public int update(Long id, MenuUpdateDTO dto) {
        String sql = """
            update blog_menu
            set parent_id = ?, name = ?, title = ?, path = ?, component = ?, icon = ?,
                type = ?, permission = ?, sort_order = ?, visible = ?, status = ?,
                gmt_modified = now()
            where id = ? and is_deleted = 0
            """;
        return jdbcTemplate.update(
            sql,
            dto.getParentId(),
            trim(dto.getName()),
            trim(dto.getTitle()),
            trim(dto.getPath()),
            trimToEmpty(dto.getComponent()),
            trimToEmpty(dto.getIcon()),
            trim(dto.getType()),
            trimToEmpty(dto.getPermission()),
            dto.getSortOrder(),
            dto.getVisible(),
            dto.getStatus(),
            id
        );
    }

    public int delete(Long id) {
        String sql = "update blog_menu set is_deleted = 1, gmt_modified = now() where id = ? and is_deleted = 0";
        return jdbcTemplate.update(sql, id);
    }

    private QueryParts buildQueryParts(MenuQueryDTO queryDTO) {
        StringBuilder whereSql = new StringBuilder();
        List<Object> args = new ArrayList<>();
        if (queryDTO.getTitle() != null && !queryDTO.getTitle().trim().isEmpty()) {
            whereSql.append(" and title like ? ");
            args.add(queryDTO.getTitle().trim() + "%");
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

    private static class MenuRowMapper implements RowMapper<Menu> {

        @Override
        public Menu mapRow(ResultSet rs, int rowNum) throws SQLException {
            Menu menu = new Menu();
            menu.setId(rs.getLong("id"));
            menu.setParentId(rs.getLong("parent_id"));
            menu.setName(rs.getString("name"));
            menu.setTitle(rs.getString("title"));
            menu.setPath(rs.getString("path"));
            menu.setComponent(rs.getString("component"));
            menu.setIcon(rs.getString("icon"));
            menu.setType(rs.getString("type"));
            menu.setPermission(rs.getString("permission"));
            menu.setSortOrder(rs.getInt("sort_order"));
            menu.setVisible(rs.getInt("visible"));
            menu.setStatus(rs.getInt("status"));
            menu.setGmtCreate(rs.getTimestamp("gmt_create").toLocalDateTime());
            menu.setGmtModified(rs.getTimestamp("gmt_modified").toLocalDateTime());
            return menu;
        }
    }
}
