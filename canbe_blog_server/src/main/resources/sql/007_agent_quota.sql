create table if not exists blog_agent (
  id bigint unsigned not null auto_increment primary key,
  name varchar(64) not null,
  code varchar(32) not null,
  description varchar(500) not null default '',
  avatar_url varchar(255) not null default '',
  runtime_url varchar(255) not null default '',
  embed_url varchar(500) not null default '',
  provider_type varchar(32) not null default 'CUSTOM',
  api_url varchar(500) not null default '',
  api_key varchar(500) not null default '',
  response_mode varchar(32) not null default 'blocking',
  status tinyint unsigned not null default 1,
  sort_order int not null default 0,
  gmt_create datetime not null default current_timestamp,
  gmt_modified datetime not null default current_timestamp on update current_timestamp,
  is_deleted tinyint unsigned not null default 0,
  unique key uk_agent_name (name),
  unique key uk_agent_code (code),
  key idx_agent_status_sort (status, sort_order)
) engine=InnoDB default charset=utf8mb4 collate=utf8mb4_0900_ai_ci;

create table if not exists role_agent_policy (
  id bigint unsigned not null auto_increment primary key,
  role_code varchar(32) not null,
  agent_id bigint unsigned not null,
  enabled tinyint unsigned not null default 1,
  total_quota int not null default 10,
  gmt_create datetime not null default current_timestamp,
  gmt_modified datetime not null default current_timestamp on update current_timestamp,
  is_deleted tinyint unsigned not null default 0,
  unique key uk_role_agent (role_code, agent_id),
  key idx_role_policy_agent (agent_id),
  key idx_role_policy_role (role_code)
) engine=InnoDB default charset=utf8mb4 collate=utf8mb4_0900_ai_ci;

create table if not exists user_agent_quota (
  id bigint unsigned not null auto_increment primary key,
  user_id bigint unsigned not null,
  agent_id bigint unsigned not null,
  total_quota int not null default 10,
  used_quota int not null default 0,
  remaining_quota int not null default 10,
  gmt_create datetime not null default current_timestamp,
  gmt_modified datetime not null default current_timestamp on update current_timestamp,
  is_deleted tinyint unsigned not null default 0,
  unique key uk_user_agent (user_id, agent_id),
  key idx_user_quota_agent (agent_id),
  key idx_user_quota_user (user_id)
) engine=InnoDB default charset=utf8mb4 collate=utf8mb4_0900_ai_ci;

create table if not exists blog_agent_call_record (
  id bigint unsigned not null auto_increment primary key,
  user_id bigint unsigned not null,
  agent_id bigint unsigned not null,
  username varchar(64) not null default '',
  agent_name varchar(64) not null default '',
  prompt varchar(1000) not null default '',
  response_text text null,
  status varchar(32) not null,
  error_code varchar(64) not null default '',
  error_message varchar(500) not null default '',
  duration_ms bigint unsigned not null default 0,
  gmt_create datetime not null default current_timestamp,
  gmt_modified datetime not null default current_timestamp on update current_timestamp,
  is_deleted tinyint unsigned not null default 0,
  key idx_call_user (user_id, gmt_create),
  key idx_call_agent (agent_id, gmt_create),
  key idx_call_status (status)
) engine=InnoDB default charset=utf8mb4 collate=utf8mb4_0900_ai_ci;
