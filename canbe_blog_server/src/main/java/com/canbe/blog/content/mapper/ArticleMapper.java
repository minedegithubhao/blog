package com.canbe.blog.content.mapper;

import com.canbe.blog.content.dto.ArticleCreateDTO;
import com.canbe.blog.content.dto.ArticleQueryDTO;
import com.canbe.blog.content.dto.ArticleUpdateDTO;
import com.canbe.blog.content.entity.Article;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

@Repository
public class ArticleMapper {

    private final JdbcTemplate jdbcTemplate;

    public ArticleMapper(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Article> list(ArticleQueryDTO queryDTO) {
        QueryParts queryParts = buildQueryParts(queryDTO);
        String sql = """
            select a.id, a.title, a.summary, a.content, a.cover_url, a.category_id, a.status,
                   a.gmt_create, a.gmt_modified, c.name as category_name,
                   (
                     select group_concat(at.tag_id order by at.tag_id separator ',')
                     from blog_article_tag at
                     where at.article_id = a.id
                   ) as tag_ids_csv,
                   (
                     select group_concat(t.name order by t.id separator ',')
                     from blog_article_tag at
                     join blog_tag t on t.id = at.tag_id and t.is_deleted = 0
                     where at.article_id = a.id
                   ) as tag_names_csv
            from blog_article a
            left join blog_category c on c.id = a.category_id and c.is_deleted = 0
            where a.is_deleted = 0
            """ + queryParts.whereSql() + """
            order by a.gmt_modified desc, a.id desc
            limit ? offset ?
            """;
        int page = normalizePage(queryDTO.getPage());
        int pageSize = normalizePageSize(queryDTO.getPageSize());
        List<Object> args = new ArrayList<>(queryParts.args());
        args.add(pageSize);
        args.add((page - 1) * pageSize);
        return jdbcTemplate.query(sql, new ArticleRowMapper(), args.toArray());
    }

    public long count(ArticleQueryDTO queryDTO) {
        QueryParts queryParts = buildQueryParts(queryDTO);
        String sql = "select count(1) from blog_article a where a.is_deleted = 0" + queryParts.whereSql();
        Long total = jdbcTemplate.queryForObject(sql, Long.class, queryParts.args().toArray());
        return total == null ? 0 : total;
    }

    public Optional<Article> findById(Long id) {
        String sql = """
            select a.id, a.title, a.summary, a.content, a.cover_url, a.category_id, a.status,
                   a.gmt_create, a.gmt_modified, c.name as category_name,
                   (
                     select group_concat(at.tag_id order by at.tag_id separator ',')
                     from blog_article_tag at
                     where at.article_id = a.id
                   ) as tag_ids_csv,
                   (
                     select group_concat(t.name order by t.id separator ',')
                     from blog_article_tag at
                     join blog_tag t on t.id = at.tag_id and t.is_deleted = 0
                     where at.article_id = a.id
                   ) as tag_names_csv
            from blog_article a
            left join blog_category c on c.id = a.category_id and c.is_deleted = 0
            where a.id = ? and a.is_deleted = 0
            limit 1
            """;
        List<Article> articles = jdbcTemplate.query(sql, new ArticleRowMapper(), id);
        return articles.stream().findFirst();
    }

    public List<Article> listPublished(ArticleQueryDTO queryDTO) {
        queryDTO.setStatus(1);
        return list(queryDTO);
    }

    public long countPublished(ArticleQueryDTO queryDTO) {
        queryDTO.setStatus(1);
        return count(queryDTO);
    }

    public Optional<Article> findPublishedById(Long id) {
        return findById(id).filter(article -> Integer.valueOf(1).equals(article.getStatus()));
    }

    public Long create(ArticleCreateDTO dto) {
        String sql = """
            insert into blog_article (
              title, summary, content, cover_url, category_id, status,
              gmt_create, gmt_modified, is_deleted
            ) values (?, ?, ?, ?, ?, ?, now(), now(), 0)
            """;
        jdbcTemplate.update(
            sql,
            trim(dto.getTitle()),
            trimToEmpty(dto.getSummary()),
            trim(dto.getContent()),
            trimToEmpty(dto.getCoverUrl()),
            dto.getCategoryId(),
            dto.getStatus()
        );
        return jdbcTemplate.queryForObject("select last_insert_id()", Long.class);
    }

    public int update(Long id, ArticleUpdateDTO dto) {
        String sql = """
            update blog_article
            set title = ?, summary = ?, content = ?, cover_url = ?, category_id = ?, status = ?, gmt_modified = now()
            where id = ? and is_deleted = 0
            """;
        return jdbcTemplate.update(
            sql,
            trim(dto.getTitle()),
            trimToEmpty(dto.getSummary()),
            trim(dto.getContent()),
            trimToEmpty(dto.getCoverUrl()),
            dto.getCategoryId(),
            dto.getStatus(),
            id
        );
    }

    public int delete(Long id) {
        String sql = "update blog_article set is_deleted = 1, gmt_modified = now() where id = ? and is_deleted = 0";
        return jdbcTemplate.update(sql, id);
    }

    public void replaceTags(Long articleId, List<Long> tagIds) {
        jdbcTemplate.update("delete from blog_article_tag where article_id = ?", articleId);
        for (Long tagId : tagIds) {
            jdbcTemplate.update(
                "insert into blog_article_tag (article_id, tag_id, gmt_create) values (?, ?, now())",
                articleId,
                tagId
            );
        }
    }

    private QueryParts buildQueryParts(ArticleQueryDTO queryDTO) {
        StringBuilder whereSql = new StringBuilder();
        List<Object> args = new ArrayList<>();
        if (queryDTO.getTitle() != null && !queryDTO.getTitle().trim().isEmpty()) {
            whereSql.append(" and a.title like ? ");
            args.add(queryDTO.getTitle().trim() + "%");
        }
        if (queryDTO.getCategoryId() != null && queryDTO.getCategoryId() > 0) {
            whereSql.append(" and a.category_id = ? ");
            args.add(queryDTO.getCategoryId());
        }
        if (queryDTO.getTagId() != null && queryDTO.getTagId() > 0) {
            whereSql.append(" and exists (select 1 from blog_article_tag at where at.article_id = a.id and at.tag_id = ?) ");
            args.add(queryDTO.getTagId());
        }
        if (queryDTO.getStatus() != null) {
            whereSql.append(" and a.status = ? ");
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

    private static class ArticleRowMapper implements RowMapper<Article> {

        @Override
        public Article mapRow(ResultSet resultSet, int rowNum) throws SQLException {
            Article article = new Article();
            article.setId(resultSet.getLong("id"));
            article.setTitle(resultSet.getString("title"));
            article.setSummary(resultSet.getString("summary"));
            article.setContent(resultSet.getString("content"));
            article.setCoverUrl(resultSet.getString("cover_url"));
            article.setCategoryId(resultSet.getLong("category_id"));
            article.setStatus(resultSet.getInt("status"));
            article.setCategoryName(resultSet.getString("category_name"));
            article.setTagIds(parseLongCsv(resultSet.getString("tag_ids_csv")));
            article.setTagNames(parseStringCsv(resultSet.getString("tag_names_csv")));
            article.setGmtCreate(toLocalDateTime(resultSet.getTimestamp("gmt_create")));
            article.setGmtModified(toLocalDateTime(resultSet.getTimestamp("gmt_modified")));
            return article;
        }

        private List<Long> parseLongCsv(String value) {
            if (value == null || value.isBlank()) {
                return new ArrayList<>();
            }
            return Arrays.stream(value.split(","))
                .map(String::trim)
                .filter(item -> !item.isEmpty())
                .map(Long::valueOf)
                .collect(Collectors.toCollection(ArrayList::new));
        }

        private List<String> parseStringCsv(String value) {
            if (value == null || value.isBlank()) {
                return new ArrayList<>();
            }
            return Arrays.stream(value.split(","))
                .map(String::trim)
                .filter(item -> !item.isEmpty())
                .collect(Collectors.toCollection(ArrayList::new));
        }

        private java.time.LocalDateTime toLocalDateTime(Timestamp timestamp) {
            return timestamp == null ? null : timestamp.toLocalDateTime();
        }
    }
}
