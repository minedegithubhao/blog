create table if not exists blog_account (
  id bigint unsigned not null auto_increment primary key,
  username varchar(64) not null,
  email varchar(128) null,
  password_hash varchar(255) not null,
  nickname varchar(64) not null default '',
  role_code varchar(32) not null default 'USER',
  status tinyint unsigned not null default 1,
  last_login_at datetime null,
  gmt_create datetime not null default current_timestamp,
  gmt_modified datetime not null default current_timestamp on update current_timestamp,
  is_deleted tinyint unsigned not null default 0,
  unique key uk_username (username),
  unique key uk_email (email),
  key idx_status (status)
) engine=InnoDB default charset=utf8mb4 collate=utf8mb4_0900_ai_ci;

insert into blog_account (
  username,
  email,
  password_hash,
  nickname,
  role_code,
  status
) values (
  'canbe',
  null,
  'pbkdf2$120000$728gYszMDFniYrWo+Up11Q==$G403UR53iJEoZiwuOXSyPXx5ss5PumjsEuO+0HkZUvU=',
  'Canbe',
  'ADMIN',
  1
) on duplicate key update
  password_hash = values(password_hash),
  nickname = values(nickname),
  role_code = values(role_code),
  status = values(status);
