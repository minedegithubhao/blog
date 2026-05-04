set @embed_url_column_exists = (
  select count(1)
  from information_schema.columns
  where table_schema = database()
    and table_name = 'blog_agent'
    and column_name = 'embed_url'
);

set @add_embed_url_sql = if(
  @embed_url_column_exists = 0,
  'alter table blog_agent add column embed_url varchar(500) not null default '''' after runtime_url',
  'select 1'
);

prepare add_embed_url_stmt from @add_embed_url_sql;
execute add_embed_url_stmt;
deallocate prepare add_embed_url_stmt;

set @provider_type_column_exists = (
  select count(1)
  from information_schema.columns
  where table_schema = database()
    and table_name = 'blog_agent'
    and column_name = 'provider_type'
);

set @add_provider_type_sql = if(
  @provider_type_column_exists = 0,
  'alter table blog_agent add column provider_type varchar(32) not null default ''CUSTOM'' after embed_url',
  'select 1'
);

prepare add_provider_type_stmt from @add_provider_type_sql;
execute add_provider_type_stmt;
deallocate prepare add_provider_type_stmt;

set @api_url_column_exists = (
  select count(1)
  from information_schema.columns
  where table_schema = database()
    and table_name = 'blog_agent'
    and column_name = 'api_url'
);

set @add_api_url_sql = if(
  @api_url_column_exists = 0,
  'alter table blog_agent add column api_url varchar(500) not null default '''' after provider_type',
  'select 1'
);

prepare add_api_url_stmt from @add_api_url_sql;
execute add_api_url_stmt;
deallocate prepare add_api_url_stmt;

set @api_key_column_exists = (
  select count(1)
  from information_schema.columns
  where table_schema = database()
    and table_name = 'blog_agent'
    and column_name = 'api_key'
);

set @add_api_key_sql = if(
  @api_key_column_exists = 0,
  'alter table blog_agent add column api_key varchar(500) not null default '''' after api_url',
  'select 1'
);

prepare add_api_key_stmt from @add_api_key_sql;
execute add_api_key_stmt;
deallocate prepare add_api_key_stmt;

set @response_mode_column_exists = (
  select count(1)
  from information_schema.columns
  where table_schema = database()
    and table_name = 'blog_agent'
    and column_name = 'response_mode'
);

set @add_response_mode_sql = if(
  @response_mode_column_exists = 0,
  'alter table blog_agent add column response_mode varchar(32) not null default ''blocking'' after api_key',
  'select 1'
);

prepare add_response_mode_stmt from @add_response_mode_sql;
execute add_response_mode_stmt;
deallocate prepare add_response_mode_stmt;

insert into blog_agent (
  name,
  code,
  description,
  avatar_url,
  runtime_url,
  embed_url,
  provider_type,
  api_url,
  api_key,
  response_mode,
  status,
  sort_order,
  gmt_create,
  gmt_modified,
  is_deleted
) values (
  'Dify 智能体',
  'DIFY_AGENT',
  '基于 Dify API 的智能体，由后端代理调用并纳入登录、额度和调用记录。',
  '',
  '',
  '',
  'DIFY',
  'http://192.168.11.21/v1/chat-messages',
  '',
  'blocking',
  1,
  20,
  now(),
  now(),
  0
) on duplicate key update
  name = values(name),
  description = values(description),
  runtime_url = values(runtime_url),
  embed_url = values(embed_url),
  provider_type = values(provider_type),
  api_url = values(api_url),
  response_mode = values(response_mode),
  status = values(status),
  sort_order = values(sort_order),
  is_deleted = 0,
  gmt_modified = now();

set @dify_agent_id = (
  select id
  from blog_agent
  where code = 'DIFY_AGENT'
    and is_deleted = 0
  limit 1
);

insert into role_agent_policy (
  role_code,
  agent_id,
  enabled,
  total_quota,
  gmt_create,
  gmt_modified,
  is_deleted
)
select
  code,
  @dify_agent_id,
  1,
  10,
  now(),
  now(),
  0
from blog_role
where is_deleted = 0
  and @dify_agent_id is not null
on duplicate key update
  enabled = values(enabled),
  total_quota = values(total_quota),
  is_deleted = 0,
  gmt_modified = now();

insert into user_agent_quota (
  user_id,
  agent_id,
  total_quota,
  used_quota,
  remaining_quota,
  gmt_create,
  gmt_modified,
  is_deleted
)
select
  id,
  @dify_agent_id,
  10,
  0,
  10,
  now(),
  now(),
  0
from blog_account
where is_deleted = 0
  and status = 1
  and @dify_agent_id is not null
on duplicate key update
  is_deleted = 0,
  gmt_modified = now();
