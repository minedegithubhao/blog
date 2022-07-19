package com.canbe.util;

import com.baomidou.mybatisplus.generator.FastAutoGenerator;
import com.baomidou.mybatisplus.generator.config.DataSourceConfig;

import java.sql.SQLException;

/**
 * 快速生成
 * @author cxd
 * @description: mybatis-plus-generator
 * @create: 2022-07-12 21:18
 */
public class MybatisPlusAutoGenerator {

    /**
     * 数据源配置
     */
    private static final DataSourceConfig.Builder DATA_SOURCE_CONFIG = new DataSourceConfig
            .Builder("jdbc:mysql://127.0.0.1:3306/canbe_blog?characterEncoding=UTF-8&useUnicode=true&useSSL=false&tinyInt1isBit=false&allowPublicKeyRetrieval=true&serverTimezone=Asia/Shanghai",
            "root",
            "root");

    /**
     * 执行 run
     * 1、swagger引入
     * 2、自动lombok
     * 3、启用builder模式
     * 4、使用相对路径
     * 5、从yaml中引入数据源配置
     */
    public static void main(String[] args) throws SQLException {
        // 初始化数据库脚本
//        initDataSource(DATA_SOURCE_CONFIG.build());
        FastAutoGenerator.create(DATA_SOURCE_CONFIG)
                // 全局配置
                .globalConfig((scanner, builder) -> builder
                        .author(scanner.apply("请输入作者名称")) //设置作者
                        .fileOverride() //覆盖生成的文件
                        .enableSwagger() //开启swagger模式
                        .outputDir("/Users/cxdpc/WorkSpace/blog/src/main/java") //文件输出路径绝对路径
                )
                // 包配置
                .packageConfig((scanner, builder) -> builder
                        .parent("com.canbe") //设置父包名
                        .moduleName("system")
                )
                // 策略配置
                .strategyConfig((scanner, builder) -> builder
                        .addInclude(scanner.apply("请输入表名，多个表名用,隔开"))
                        .mapperBuilder()//开启mapper策略
                        .enableBaseResultMap()//xml中添加字段映射，即<resultMap>
                        .enableMapperAnnotation()//添加@Mapper注解
                        .enableBaseColumnList()//xml中添加通用查询结果列Base_Column_List
                        .build()
                )
                /*
                    模板引擎配置，默认 Velocity 可选模板引擎 Beetl 或 Freemarker
                   .templateEngine(new BeetlTemplateEngine())
                    .templateEngine(new FreemarkerTemplateEngine())
                 */
                .execute();
    }
}
