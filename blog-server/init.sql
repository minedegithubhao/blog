-- 创建数据库
drop database if exists canbe_blog;
create database canbe_blog;
-- 设置数据库编码（推荐使用UTF-8）
alter database canbe_blog character set utf8mb4 collate utf8mb4_unicode_ci;
-- 使用数据库
use canbe_blog;

-- canbe_blog.article definition

CREATE TABLE `article` (
                           `id` int unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID',
                           `title` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '文章标题',
                           `img` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '文章封面',
                           `summary` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '文章简介',
                           `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci COMMENT '文章内容',
                           `content_md` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci COMMENT '文章内容(MD格式)',
                           `keywords` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '文章关键词',
                           `seowords` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'SEO关键词',
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


-- canbe_blog.category definition

CREATE TABLE `category` (
                            `id` int unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID',
                            `category_name` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '分类名称',
                            `sort_by` int unsigned DEFAULT NULL COMMENT '排序',
                            `create_user` int unsigned NOT NULL COMMENT '创建人ID',
                            `create_time` datetime NOT NULL COMMENT '创建时间',
                            `update_user` int unsigned DEFAULT NULL COMMENT '修改人ID',
                            `update_time` datetime DEFAULT NULL COMMENT '修改时间',
                            PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='文章分类表';


-- canbe_blog.sys_article definition

CREATE TABLE `sys_article` (
                               `id` bigint unsigned NOT NULL AUTO_INCREMENT COMMENT '主键id',
                               `user_id` int unsigned DEFAULT NULL COMMENT '用户id',
                               `category_id` int unsigned NOT NULL COMMENT '分类id',
                               `title` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '文章标题',
                               `cover` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '文章封面地址',
                               `summary` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '文章简介',
                               `content` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci COMMENT '文章内容',
                               `content_md` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '文章内容md格式',
                               `read_type` tinyint unsigned DEFAULT '0' COMMENT '阅读方式 0无需验证 1：评论阅读 2：点赞阅读 3：扫码阅读',
                               `is_stick` tinyint unsigned DEFAULT '0' COMMENT '是否置顶 0否 1是',
                               `status` tinyint unsigned DEFAULT '0' COMMENT '状态 0：发布 1：草稿',
                               `is_original` tinyint unsigned DEFAULT '1' COMMENT '是否原创 0：转载 1:原创',
                               `is_carousel` tinyint unsigned DEFAULT '0' COMMENT '是否首页轮播',
                               `is_recommend` tinyint unsigned DEFAULT '0' COMMENT '是否推荐',
                               `original_url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '转载地址',
                               `quantity` bigint unsigned DEFAULT '0' COMMENT '文章阅读量',
                               `keywords` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '关键词',
                               `ai_describe` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Ai生成的简短描述',
                               `create_time` datetime NOT NULL COMMENT '创建时间',
                               `update_time` datetime DEFAULT NULL COMMENT '修改时间',
                               PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='博客文章表';


-- canbe_blog.sys_category definition

CREATE TABLE `sys_category` (
                                `id` int unsigned NOT NULL AUTO_INCREMENT COMMENT '主键',
                                `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '分类名称',
                                `sort` int unsigned DEFAULT '0' COMMENT '排序',
                                `create_time` datetime NOT NULL COMMENT '创建时间',
                                `update_time` datetime DEFAULT NULL COMMENT '更新时间',
                                PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='分类表';


-- canbe_blog.sys_dict definition

CREATE TABLE `sys_dict` (
                            `id` bigint unsigned NOT NULL AUTO_INCREMENT COMMENT '主键',
                            `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '字典名称',
                            `type` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '字典类型',
                            `status` tinyint(1) DEFAULT '0' COMMENT '是否发布(1:是，0:否)',
                            `remark` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '备注',
                            `create_time` datetime NOT NULL COMMENT '创建时间',
                            `update_time` datetime DEFAULT NULL COMMENT '修改时间',
                            `sort` int unsigned DEFAULT '0' COMMENT '排序',
                            PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='字典表';


-- canbe_blog.sys_dict_data definition

CREATE TABLE `sys_dict_data` (
                                 `id` bigint unsigned NOT NULL AUTO_INCREMENT COMMENT '主键',
                                 `dict_id` bigint unsigned NOT NULL COMMENT '字典类型id',
                                 `label` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '字典标签',
                                 `value` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '字典键值',
                                 `style` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '回显样式',
                                 `is_default` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT '0' COMMENT '是否默认（1是 0否）',
                                 `sort` int unsigned DEFAULT '0' COMMENT '排序',
                                 `remark` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '备注',
                                 `status` tinyint(1) DEFAULT '0' COMMENT '状态',
                                 PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='字典数据表';


-- canbe_blog.sys_menu definition

CREATE TABLE `sys_menu` (
                            `id` int NOT NULL AUTO_INCREMENT,
                            `parent_id` int DEFAULT NULL,
                            `path` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
                            `component` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
                            `title` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
                            `sort` int DEFAULT NULL,
                            `icon` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
                            `type` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
                            `create_time` datetime DEFAULT NULL,
                            `update_time` datetime DEFAULT NULL,
                            `redirect` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
                            `name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
                            `hidden` int DEFAULT NULL,
                            `perm` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
                            `is_external` int DEFAULT NULL,
                            PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- canbe_blog.sys_tag definition

CREATE TABLE `sys_tag` (
                           `id` int unsigned NOT NULL AUTO_INCREMENT COMMENT '主键',
                           `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '标签名称',
                           `sort` int unsigned DEFAULT '0' COMMENT '排序',
                           `create_time` datetime NOT NULL COMMENT '创建时间',
                           `update_time` datetime DEFAULT NULL COMMENT '更新时间',
                           PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='标签表';


-- canbe_blog.sys_user definition

CREATE TABLE `sys_user` (
                            `id` int unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID',
                            `username` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '用户名',
                            `password` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '密码',
                            `nickname` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT '' COMMENT '昵称',
                            `email` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT '' COMMENT '邮箱',
                            `avatar` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT '' COMMENT '头像',
                            `create_user` int unsigned DEFAULT NULL COMMENT '创建人ID',
                            `create_time` datetime NOT NULL COMMENT '创建时间',
                            `update_user` int unsigned DEFAULT NULL COMMENT '修改人ID',
                            `update_time` datetime DEFAULT NULL COMMENT '修改时间',
                            `status` tinyint DEFAULT '1' COMMENT '状态',
                            `role` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
                            `ip` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
                            `ip_location` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
                            `os` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
                            `last_login_time` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
                            `browser` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
                            `mobile` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
                            `sex` tinyint DEFAULT NULL,
                            `login_type` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
                            `signature` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
                            PRIMARY KEY (`id`),
                            UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';


-- canbe_blog.tag definition

CREATE TABLE `tag` (
                       `id` int unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID',
                       `tag_name` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '标签名称',
                       `create_user` int unsigned NOT NULL COMMENT '创建人ID',
                       `create_time` datetime NOT NULL COMMENT '创建时间',
                       `update_user` int unsigned DEFAULT NULL COMMENT '修改人ID',
                       `update_time` datetime DEFAULT NULL COMMENT '修改时间',
                       PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='标签表';


INSERT INTO canbe_blog.sys_article (user_id,category_id,title,cover,summary,content,content_md,read_type,is_stick,status,is_original,is_carousel,is_recommend,original_url,quantity,keywords,ai_describe,create_time,update_time) VALUES
                                                                                                                                                                                                                                      (3,1,'资本抢滩区块链：泡沫还是技术？','301ab853-5119-44b4-9fb2-37f6271932e5.jpg','随着越来越多的上市公司将区块链作为转型的方向，具有区块链概念的上市公司持续增加。',NULL,'随着越来越多的上市公司将区块链作为转型的方向，具有区块链概念的上市公司持续增加。根据同花顺(42.920, -0.95, -2.17%)概念板块统计，截至6月13日，具有区块链概念的上市公司已达80家。

除了上市公司之外，各路资本也蜂拥进入区块链行业。据工信部信息中心发布的《2018中国区块链产业白皮书》数据显示，截至2018年涉及区块链公司股权投资事件数量为249起。从2016年开始，区块链领域的投资热度出现明显上升，投资事件达到60起，是2015年的五倍。2017年是近几年的区块链投资高峰期，投资事件数量接近100起。2018年第一季度，区块链领域的投资事件数量已达到68起。

在虚拟币热潮不断的同时，区块链也站在了舆论的风口浪尖。

落地虽难，发币热情高涨

资本抢滩区块链的过程中，国资系、风投系与上市系的身影隐现。IT桔子数据显示互联网创投市场上当41%获投项目聚焦区块链。而具有区块链概念的上市公司已达80家。

记者注意到，其实目前面临的现实问题——关于区块链真实应用场景和监管已经引起了行业大多数人的思考，在这个过程中，如何促进区块链与现实产业的结合、实现公链之间的连接与行业监管，都在等待全行业乃至监管层交出答卷。

据全球审计巨头德勤的报告显示，2017年，仅前6个月，在GitHub上新创建的区块链项目就达近25000个，与2016年全年的新建区块链项目量几乎持平。但是，目前阶段连主网上线的项目都寥若晨星，遑论具体落地的区块链应用。

“打个比方，没有主网的币是租别人的店面开店，上主网就是自己建一栋楼开店。”一名“币圈”人士对记者这样解释道，“但是除了主网上线问题，关于区块链能否走进生活，最至关重要的还是应用要落地。”

纸贵科技区块链架构师王昊近期在接受《中国经营报》记者采访时表示，区块链现在最大的落地应用是数字货币，但是数字货币具有完全虚拟的特点，落地应用就需要与现实相结合。他直言：“如何将现实中的问题做信息化、数字化处理，使得他们在线上进行流转，是影响区块链应用落地的很大难点。”

除了将从线下映射到线上的上链难点，还有目前区块链技术效率低也是引发落地难问题的原因之一。

据了解，区块链面对大规模的应用是非常吃力的，作为一个分布式账本，把账本分发到所有节点 ，需要耗费大量的资源和时间。2016年8月2日Gartner研究副总裁兼院士级分析师Ray Valdes曾公开表示，比特币区块链是现在现实世界上唯一可用的一种作业系统级别，它的执行速度受限于每秒只能做7个交易，还有数10分钟的延迟确认。

TAC溯源链创始人王鹏飞对记者表示：“应用落地第一个说的是技术。像比特币、以太坊均没有很好的TPS（系统吞度量，即每秒系统处理的数量），这一问题是区块链首先要解决的。以太坊所拥有的智能合约（运行在计算机里面的，用于保证让参与方执行承诺的代码）是一个基本的保证。”

落地应用停滞不前，公有链的竞争也愈发激烈。

根据公开资料显示，在市值排名前二十的数字货币中，公有链币种占据了很大一部分，比如以太坊、EOS、NEO、量子链等等。投资者往往觉得，区块链基础设施项目发行的通证相对于其他更加安全。

6月6日下午，中国最大的比特币（BTC）、莱特币（LTC）、以太坊（ETH）、以太坊经典（ETC）交易平台火币网宣布火币公链项目启动，对于这一消息，业界判定为火币在向转化为公链的征途已经正式起航，未来火币也将走在逐步成为公有链币种的路上。

可是公链开发火热的同时，其中区块链真正能够落地的场景寥寥无几。据统计，目前以太坊上面的Dapps应用（分布式/去中心化应用）已经超过了1252个，换言之，目前市场上95%的应用链都是基于以太坊（ETH）平台所开发的，使用以太坊（ETH）的智能合约。

与悬而未决的落地难题形成鲜明对比的是，在区块链行业蓬勃发展的过程中，ICO募资如日中天，发币热潮如烈火烹油，“往往应用未落实，就开始发币众筹圈钱的项目越来越多了。”一位业内人士这样对记者说道。

不乏可落地场景，但监管待同步

一个值得注意的趋势是，越来越多的行业人士已经开始聚焦于区块链应用的探索，一些区块链技术也开始找到了落地场景。

Goopal Group发起人、神州数字（08255.HK）CEO孙茳涛在接受记者采访时表示，区块链应用落地有四个可实现场景，孙茳涛称它为“1+3”。“1”指的是金融科技领域区块链技术的应用。 “3”具体是以下几个方向：第一个方向是信息确权，或者叫身份认证，在网络上通过技术建立信任关系，而非靠权威背书。第二个方向是物联网，因为物联网的P2P结构和区块链去中心化的P2P结构在网络架构上有天然大部分的重合。第三个方向是与知识产权相关的。包括图片、声音、视频及文字这四种可以彻底数据化的信息。其实，第三个方向最近已经有落地应用， 5月28日晚间，百度百科悄然上链，利用区块链不可篡改特性保持百科历史版本准确存留。另外根据食品溯源需求，已有许多溯源链应运而生，如将于6月30日主网上线的溯源公链TAC。

虽然区块链应用场景随着人们的讨论越来越丰富，但是目前区块链行业乱象丛生，区块链各种噱头和博眼球的事情已经毫无底线，区块链和炒币往往跟一夜暴富联系在了一起。

关于区块链监管的呼声越来越高。

在今年的外滩峰会上，中国平安(64.630, 0.19, 0.29%)集团首席创新执行官屠德言就表示，国外比较前沿的公司，已经在逐步与当地监管单位沟通，希望提供一种实时技术，能够允许监管部门看到他们想看到的东西，尽管这一技术并未成熟，但双方已经在考虑相关逻辑的设计与贯穿。此外，中国的底层技术如何与国外几个核心的底层技术融合，也是监管层关注的问题。

中央财经大学金融法研究所所长黄震教授表示，区块链目前的风险来自于几个方面，第一是技术研发本身的实现有风险；第二是区块链的技术应用有经营风险；第三是政策风险；第四是舆情风险。

针对这些风险，黄震表示：“在当前防风险成为第一要务的时候，必须要警惕我们并不能完全判断这些风险来源，在防风险的时候，可能更多的要借助一些新技术。区块链也是一种新技术，所以技术创新+制度创新+理性反思等不断的迭代，才可能防范这个风险。”',0,0,0,1,0,0,NULL,0,NULL,NULL,'2026-01-29 18:36:28','2026-01-29 19:46:28'),
                                                                                                                                                                                                                                      (3,2,'使用Vagrant搭建本地集群','978f90a3-a1d2-41c7-8c43-529beea2738c.jpg','Vagrant 是一款用于构建和管理虚拟化开发环境的命令行工具，由 HashiCorp 公司开发，核心作用是让开发者快速搭建、复用、分发一致的虚拟机环境，解决「在我电脑上能跑，在你电脑上不行」的环境一致性问题。',NULL,'1. 下载&安装Vagrant
https://www.vagrantup.com/downloads.html Vagrant下载
2. 验证Vagrant是否安装成功
使用vagrant命令，如果出现如下内容，则证明已经安装成功
C:\\Users\\82473>vagrant
Usage: vagrant [options] <command> [<args>]

    -h, --help                       Print this help.

Common commands:
     autocomplete    manages autocomplete installation on host
     box             manages boxes: installation, removal, etc.
     cloud           manages everything related to Vagrant Cloud
     destroy         stops and deletes all traces of the vagrant machine
     global-status   outputs status Vagrant environments for this user
     halt            stops the vagrant machine
     help            shows the help for a subcommand
     init            initializes a new Vagrant environment by creating a Vagrantfile
     login
     package         packages a running vagrant environment into a box
     plugin          manages plugins: install, uninstall, update, etc.
     port            displays information about guest port mappings
     powershell      connects to machine via powershell remoting
     provision       provisions the vagrant machine
     push            deploys code in this environment to a configured destination
     rdp             connects to machine via RDP
     reload          restarts vagrant machine, loads new Vagrantfile configuration
     resume          resume a suspended vagrant machine
     snapshot        manages snapshots: saving, restoring, etc.
     ssh             connects to machine via SSH
     ssh-config      outputs OpenSSH valid configuration to connect to the machine
     status          outputs status of the vagrant machine
     suspend         suspends the machine
     up              starts and provisions the vagrant environment
     upload          upload to machine via communicator
     validate        validates the Vagrantfile
     version         prints current and latest Vagrant version
     winrm           executes commands on a machine via WinRM
     winrm-config    outputs WinRM configuration to connect to the machine

For help on any individual command run `vagrant COMMAND -h`

Additional subcommands are available, but are either more advanced
or not commonly used. To see all subcommands, run the command
`vagrant list-commands`.
        --[no-]color                 Enable or disable color output
        --machine-readable           Enable machine readable output
    -v, --version                    Display Vagrant version
        --debug                      Enable debug output
        --timestamp                  Enable timestamps on log output
        --debug-timestamp            Enable debug output with timestamps
        --no-tty                     Enable non-interactive output
安装成功后会当前用户的根目录出生成一个Vagrantfile文件
3.  使用vagrant往VirtualBox中安装系统
在https://app.vagrantup.com/boxes/search Vagrant官方镜像仓库中找到要安装系统，比如centos

找到要安装的系统名称为centos/stream9，打开cmd窗口，运行
vagrant init centos/stream9，可初始化一个centos/stream9系统，
这里默认创建的磁盘大小是10G，1核，512M内存的虚拟机
vagrant up可以启动虚拟机，root用户的密码也是vagrant

启动之后我们可以使用ctrl + c退出到命令行，退出后不会关闭虚拟机，可放心ctrl + c
vagrant ssh使用创建好的ssh就可以链接上虚拟机

exit 退出与虚拟机的ssh链接

vagrant reload 重启虚拟机
vagrant halt停止虚拟机
 vagrantuploadsource[destination][name|id] 上传文件
4. 默认虚拟机的IP不是固定IP，不利于开发，我们需要给虚拟机配置一个固定的IP
  a. 使用ipconfig查看计算机网络配置

  b. 打开当前用户的根目录下的Vagrantfile文件，修改网络配置，修改完成后重启虚拟机vagrant reload


  c. 检查ip是否修改成功，重启虚拟机vagrant reload后使用vagrant ssh链接到虚拟机，查看网络配置ip addr，这里的IP与我们修改的一致则修改成功

  d. 测试主机和虚拟机网络是否能够ping通，在虚拟机中ping 主机ip，在主机中ping 虚拟机ip，发现都能ping通说明ok
命令汇总
● vagrant --help检查vagrant是否安装成功
● vagrant init centos/stream9往虚拟机安装系统
● vagrant up可以启动虚拟机
● vagrant ssh使用创建好的ssh就可以链接上虚拟机
● exit 退出与虚拟机的ssh链接
● vagrant reload 重启虚拟机
●  vagrantuploadsource[destination][name|id] 上传文件
● vagrant halt停止虚拟机
● vagrant global-status查看vagrant管理的所有虚拟机，并列出所有虚拟机id
● vagrant destroy 虚拟机id删除指定的虚拟机，如果果现有 Vagrantfile 已无用，需要生成新的配置文件（例如更换虚拟机系统、修改网络配置），需先删除原有文件del Vagrantfile，再执行 vagrant init。
● del Vagrantfile删除虚拟机配置文件
● vagrant box list列出所有虚拟机镜像
● vagrant box remove centos/stream9 --provider virtualbox移除虚拟机镜像centos/stream9是镜像名称--provider virtualbox要删除的是适用于 VirtualBox 的版本
● cp Vagrantfile Vagrantfile.bak备份虚拟机。',0,0,0,1,0,0,NULL,0,NULL,NULL,'2026-01-29 18:41:40',NULL),
                                                                                                                                                                                                                                      (3,3,'费曼学习法','2f05d303-2f3a-4208-8843-216f2b7d95fa.jpg','只有被海马体判定为与生存相关得信息，就会很容易得通过海马体的“检查',NULL,'费曼学习法
● 第一步：假装把它（知识、概念）教给一个小孩子。
你要把它教给一个8岁的孩子，他的词汇量和注意力刚好能够理解基本概念和关系，你会讲哪些，并写下来，使用复杂的词汇和行话来掩盖我们不明白的东西
● 第二步：回顾。
不可避免地会卡壳，忘记重要的点，不能解释，或者说不能将重要的概念联系起来，你就知道自己在哪里卡住了，那么就回到原始材料，重新学习，直到你可以用基本的术语解释这一概念。
● 第三步：将语言条理化，简化。
将这些知识用简单的语言组织成一个流畅的故事，将这个故事大声读出来，如果这些解释不够简单，或者听起来比较混乱，很好，这意味着你想要理解该领域，还需要做一些工作。
● 第四步（可选）：传授
如果你真的想确保你的理解没什么问题，就把它教给另一个人（理想状态下，这个人应该对这个话题知之甚少，或者就找个8岁的孩子）。检测知识最终的途径是你能有能力把它传播给另一个人。
学习黄金法则
为什么-怎么做-做什么
提高记忆效率得方式
只有被海马体判定为与生存相关得信息，就会很容易得通过海马体的“检查”
1. 反复记忆
2. 充分联想
3. 肉体刺激
4. 重点记忆
记忆的黄金时间
少玩手机、少卧谈
睡前、醒后',0,0,0,1,0,0,NULL,0,NULL,NULL,'2026-01-29 19:33:10',NULL);


INSERT INTO canbe_blog.sys_category (name,sort,create_time,update_time) VALUES
                                                                            ('营销推广',1,'2026-01-29 18:35:44','2026-01-30 11:09:19'),
                                                                            ('运维部署',2,'2026-01-29 18:39:28','2026-01-30 11:09:22'),
                                                                            ('生活随笔',3,'2026-01-29 19:30:41',NULL);


INSERT INTO canbe_blog.sys_dict (name,`type`,status,remark,create_time,update_time,sort) VALUES
                                                                                             ('性别','sex',1,NULL,'2026-01-29 19:06:59','2026-01-29 19:06:59',1),
                                                                                             ('用户状态','status',1,NULL,'2026-01-29 19:08:47','2026-01-29 19:08:47',2),
                                                                                             ('菜单类型','type',1,NULL,'2026-01-29 19:08:47','2026-01-29 19:08:47',3);

INSERT INTO canbe_blog.sys_dict_data (dict_id,label,value,`style`,is_default,sort,remark,status) VALUES
                                                                                                     (1,'男','0',NULL,'0',0,NULL,0),
                                                                                                     (1,'女','1',NULL,'0',0,NULL,0),
                                                                                                     (2,'禁用','0',NULL,'0',0,NULL,0),
                                                                                                     (2,'正常','1',NULL,'0',0,NULL,0),
                                                                                                     (3,'菜单','menu',NULL,'0',0,NULL,0),
                                                                                                     (3,'按钮','button',NULL,'0',0,NULL,0);


INSERT INTO canbe_blog.sys_menu (parent_id,`path`,component,title,sort,icon,`type`,create_time,update_time,redirect,name,hidden,perm,is_external) VALUES
                                                                                                                                                      (NULL,'/home','Index','系统管理',1,'AppstoreOutlined','menu',NULL,NULL,NULL,NULL,0,NULL,NULL),
                                                                                                                                                      (1,'/system/user','User','用户管理',1,'UserOutlined','menu',NULL,NULL,NULL,NULL,0,NULL,NULL),
                                                                                                                                                      (1,'/system/menu','Menu','菜单管理',2,'MenuOutlined','menu',NULL,NULL,NULL,NULL,0,NULL,NULL),
                                                                                                                                                      (1,'/system/role','Role','角色管理',3,NULL,'menu','2026-01-29 18:19:37',NULL,NULL,NULL,1,NULL,NULL),
                                                                                                                                                      (1,'/system/dict','Dict','字典管理',4,NULL,'menu',NULL,NULL,NULL,NULL,0,NULL,NULL),
                                                                                                                                                      (1,'/system/param','Param','参数管理',5,NULL,'menu',NULL,NULL,NULL,NULL,1,NULL,NULL),
                                                                                                                                                      (1,'/system/file','File','文件管理',6,NULL,'menu',NULL,NULL,NULL,NULL,1,NULL,NULL),
                                                                                                                                                      (11,'/blog/article','Article','文章管理',7,'LinkOutlined','menu',NULL,NULL,NULL,NULL,0,NULL,NULL),
                                                                                                                                                      (11,'/blog/tag','Tag','标签管理',8,NULL,'menu',NULL,NULL,NULL,NULL,0,NULL,NULL),
                                                                                                                                                      (11,'/blog/category','Category','分类管理',9,NULL,'menu',NULL,NULL,NULL,NULL,0,NULL,NULL);
INSERT INTO canbe_blog.sys_menu (parent_id,`path`,component,title,sort,icon,`type`,create_time,update_time,redirect,name,hidden,perm,is_external) VALUES
                                                                                                                                                      (NULL,'/blog',NULL,'博客管理',1,'FireOutlined','menu',NULL,NULL,NULL,NULL,0,NULL,NULL),
                                                                                                                                                      (NULL,'/about',NULL,'关于我们',1,NULL,'menu',NULL,NULL,NULL,NULL,0,NULL,NULL),
                                                                                                                                                      (NULL,'/web','BlogWeb','前端页面',1,NULL,'menu',NULL,NULL,NULL,NULL,0,NULL,NULL);

INSERT INTO canbe_blog.sys_user (username,password,nickname,email,avatar,create_user,create_time,update_user,update_time,status,`role`,ip,ip_location,os,last_login_time,browser,mobile,sex,login_type,signature) VALUES
                                                                                                                                                                                                                      ('admin','21232f297a57a5a743894a0e4a801fc3','admin','','',NULL,'2026-01-29 17:11:23',NULL,'2026-01-29 19:07:51',0,'admin',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL),
                                                                                                                                                                                                                      ('user','ee11cbb19052e40b07aac0ca060c23ee','','','',NULL,'2026-01-30 12:40:39',NULL,NULL,1,'user',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);

