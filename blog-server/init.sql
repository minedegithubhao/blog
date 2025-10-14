-- 创建数据库
drop database if exists canbe_blog;
create database canbe_blog;
-- 设置数据库编码（推荐使用UTF-8）
alter database canbe_blog character set utf8mb4 collate utf8mb4_unicode_ci;
-- 使用数据库
use canbe_blog;
-- 用户表
create table user
(
    id          int unsigned primary key auto_increment comment 'ID',
    username    varchar(20) not null unique comment '用户名',
    password    varchar(32) comment '密码',
    nickname    varchar(10)  default '' comment '昵称',
    email       varchar(128) default '' comment '邮箱',
    avater      varchar(128) default '' comment '头像',
    create_user int unsigned not null comment '创建人ID',
    create_time datetime    not null comment '创建时间',
    update_user int unsigned comment '修改人ID',
    update_time datetime comment '修改时间'
) comment '用户表';
-- 分类表
create table category
(
    id            int unsigned primary key auto_increment comment 'ID',
    category_name varchar(32) not null comment '分类名称',
    sortBy        int unsigned comment '排序',
    create_user   int unsigned not null comment '创建人ID',
    create_time   datetime    not null comment '创建时间',
    update_user   int unsigned comment '修改人ID',
    update_time   datetime comment '修改时间'
) comment '文章分类表';
-- 文章表
create table article
(
    id          int unsigned primary key auto_increment comment 'ID',
    title       varchar(100) not null comment '文章标题',
    img         varchar(128) comment '文章封面',
    summary     varchar(256) comment '文章简介',
    content     text comment '文章内容',
    contentMd   text comment '文章内容(MD格式)',
    keywords    varchar(128) comment '文章关键词',
    seowords    varchar(128) comment 'SEO关键词',
    create_user int unsigned not null comment '创建人ID',
    create_time datetime     not null comment '创建时间',
    update_user int unsigned comment '修改人ID',
    update_time datetime comment '修改时间',
    category_id int unsigned comment '文章分类ID',
    viewNum     int unsigned default 0 comment '浏览量',
    likeNum     int unsigned default 0 comment '点赞量',
    commentNum  int unsigned default 0 comment '评论量',
    isPublish   int unsigned comment '是否发布(1-已发布，0-未发布)',
    isDel       int unsigned default 0 comment '是否删除 (1-已删除，0-未删除)'
) comment '文章表';
-- 标签表
create table tag
(
    id          int unsigned primary key auto_increment comment 'ID',
    tag_name    varchar(32) not null comment '标签名称',
    create_user int unsigned not null comment '创建人ID',
    create_time datetime    not null comment '创建时间',
    update_user int unsigned comment '修改人ID',
    update_time datetime comment '修改时间'
) comment '标签表';