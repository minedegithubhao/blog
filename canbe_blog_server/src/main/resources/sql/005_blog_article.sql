create table if not exists blog_article (
  id bigint unsigned not null auto_increment primary key,
  title varchar(128) not null,
  summary varchar(500) not null default '',
  content longtext not null,
  cover_url varchar(255) not null default '',
  category_id bigint unsigned not null,
  status tinyint unsigned not null default 0,
  gmt_create datetime not null default current_timestamp,
  gmt_modified datetime not null default current_timestamp on update current_timestamp,
  is_deleted tinyint unsigned not null default 0,
  key idx_article_category (category_id),
  key idx_article_status_modified (status, gmt_modified)
) engine=InnoDB default charset=utf8mb4 collate=utf8mb4_0900_ai_ci;

create table if not exists blog_article_tag (
  id bigint unsigned not null auto_increment primary key,
  article_id bigint unsigned not null,
  tag_id bigint unsigned not null,
  gmt_create datetime not null default current_timestamp,
  unique key uk_article_tag (article_id, tag_id),
  key idx_article_tag_article (article_id),
  key idx_article_tag_tag (tag_id)
) engine=InnoDB default charset=utf8mb4 collate=utf8mb4_0900_ai_ci;
