create table if not exists blog_category (
  id bigint unsigned not null auto_increment primary key,
  name varchar(64) not null,
  slug varchar(64) not null,
  description varchar(255) not null default '',
  sort_order int not null default 0,
  status tinyint unsigned not null default 1,
  gmt_create datetime not null default current_timestamp,
  gmt_modified datetime not null default current_timestamp on update current_timestamp,
  is_deleted tinyint unsigned not null default 0,
  unique key uk_category_name (name),
  unique key uk_category_slug (slug),
  key idx_category_status_sort (status, sort_order)
) engine=InnoDB default charset=utf8mb4 collate=utf8mb4_0900_ai_ci;

create table if not exists blog_tag (
  id bigint unsigned not null auto_increment primary key,
  name varchar(64) not null,
  slug varchar(64) not null,
  gmt_create datetime not null default current_timestamp,
  gmt_modified datetime not null default current_timestamp on update current_timestamp,
  is_deleted tinyint unsigned not null default 0,
  unique key uk_tag_name (name),
  unique key uk_tag_slug (slug)
) engine=InnoDB default charset=utf8mb4 collate=utf8mb4_0900_ai_ci;
