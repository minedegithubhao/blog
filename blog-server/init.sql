-- 创建数据库
drop database if exists canbe_blog;
create database canbe_blog;
-- 设置数据库编码（推荐使用UTF-8）
alter database canbe_blog character set utf8mb4 collate utf8mb4_unicode_ci;
-- 使用数据库
use canbe_blog;

-- 用户表
CREATE TABLE `user`
(
    `id`          int unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID',
    `username`    varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '用户名',
    `password`    varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '密码',
    `nickname`    varchar(10) COLLATE utf8mb4_unicode_ci                       DEFAULT '' COMMENT '昵称',
    `email`       varchar(128) COLLATE utf8mb4_unicode_ci                      DEFAULT '' COMMENT '邮箱',
    `avater`      varchar(128) COLLATE utf8mb4_unicode_ci                      DEFAULT '' COMMENT '头像',
    `create_user` int unsigned DEFAULT NULL COMMENT '创建人ID',
    `create_time` datetime                               NOT NULL COMMENT '创建时间',
    `update_user` int unsigned DEFAULT NULL COMMENT '修改人ID',
    `update_time` datetime                                                     DEFAULT NULL COMMENT '修改时间',
    PRIMARY KEY (`id`),
    UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';

-- 分类表
CREATE TABLE `category`
(
    `id`            int unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID',
    `category_name` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '分类名称',
    `sort_by`       int unsigned DEFAULT NULL COMMENT '排序',
    `create_user`   int unsigned NOT NULL COMMENT '创建人ID',
    `create_time`   datetime                               NOT NULL COMMENT '创建时间',
    `update_user`   int unsigned DEFAULT NULL COMMENT '修改人ID',
    `update_time`   datetime DEFAULT NULL COMMENT '修改时间',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='文章分类表';

-- 文章表
CREATE TABLE `article` (
   `id` int unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID',
   `title` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '文章标题',
   `img` varchar(128) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '文章封面',
   `summary` varchar(256) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '文章简介',
   `content` text COLLATE utf8mb4_unicode_ci COMMENT '文章内容',
   `content_md` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci COMMENT '文章内容(MD格式)',
   `keywords` varchar(128) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '文章关键词',
   `seowords` varchar(128) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'SEO关键词',
   `create_user` int unsigned NOT NULL COMMENT '创建人ID',
   `create_time` datetime NOT NULL COMMENT '创建时间',
   `update_user` int unsigned DEFAULT NULL COMMENT '修改人ID',
   `update_time` datetime DEFAULT NULL COMMENT '修改时间',
   `category_id` int unsigned DEFAULT NULL COMMENT '文章分类ID',
   `view_num` int unsigned DEFAULT '0' COMMENT '浏览量',
   `like_num` int unsigned DEFAULT '0' COMMENT '点赞量',
   `comment_num` int unsigned DEFAULT '0' COMMENT '评论量',
   `is_publish` int unsigned DEFAULT NULL COMMENT '是否发布(1-已发布，0-未发布)',
   `is_del` int unsigned DEFAULT '0' COMMENT '是否删除 (1-已删除，0-未删除)',
   PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='文章表';

-- 标签表
CREATE TABLE `tag` (
   `id` int unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID',
   `tag_name` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '标签名称',
   `create_user` int unsigned NOT NULL COMMENT '创建人ID',
   `create_time` datetime NOT NULL COMMENT '创建时间',
   `update_user` int unsigned DEFAULT NULL COMMENT '修改人ID',
   `update_time` datetime DEFAULT NULL COMMENT '修改时间',
   PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='标签表';