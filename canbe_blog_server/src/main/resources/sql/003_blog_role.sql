create table if not exists blog_role (
  id bigint unsigned not null auto_increment primary key,
  name varchar(64) not null,
  code varchar(32) not null,
  description varchar(255) not null default '',
  status tinyint unsigned not null default 1,
  gmt_create datetime not null default current_timestamp,
  gmt_modified datetime not null default current_timestamp on update current_timestamp,
  is_deleted tinyint unsigned not null default 0,
  unique key uk_role_name (name),
  unique key uk_role_code (code),
  key idx_role_status (status)
) engine=InnoDB default charset=utf8mb4 collate=utf8mb4_0900_ai_ci;

insert into blog_role (
  id, name, code, description, status
) values
  (1, '管理员', 'ADMIN', '后台管理员角色', 1),
  (2, '普通用户', 'USER', '前台注册用户角色', 1)
on duplicate key update
  name = values(name),
  description = values(description),
  status = values(status),
  is_deleted = 0;
