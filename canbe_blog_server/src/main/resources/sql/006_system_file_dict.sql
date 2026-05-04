create table if not exists blog_file_record (
  id bigint unsigned not null auto_increment primary key,
  filename varchar(255) not null,
  stored_name varchar(255) not null,
  relative_path varchar(255) not null,
  url varchar(255) not null,
  size bigint unsigned not null default 0,
  content_type varchar(100) not null default '',
  gmt_create datetime not null default current_timestamp,
  gmt_modified datetime not null default current_timestamp on update current_timestamp,
  is_deleted tinyint unsigned not null default 0,
  key idx_file_type_create (content_type, gmt_create)
) engine=InnoDB default charset=utf8mb4 collate=utf8mb4_0900_ai_ci;

create table if not exists blog_dict_item (
  id bigint unsigned not null auto_increment primary key,
  type_code varchar(64) not null,
  type_name varchar(64) not null,
  item_label varchar(64) not null,
  item_value varchar(64) not null,
  sort_order int not null default 0,
  status tinyint unsigned not null default 1,
  remark varchar(255) not null default '',
  gmt_create datetime not null default current_timestamp,
  gmt_modified datetime not null default current_timestamp on update current_timestamp,
  is_deleted tinyint unsigned not null default 0,
  unique key uk_dict_type_value (type_code, item_value),
  key idx_dict_type_sort (type_code, sort_order),
  key idx_dict_status_sort (status, sort_order)
) engine=InnoDB default charset=utf8mb4 collate=utf8mb4_0900_ai_ci;
