package com.canbe.utils;

import com.baomidou.mybatisplus.annotation.FieldFill;
import com.baomidou.mybatisplus.generator.FastAutoGenerator;
import com.baomidou.mybatisplus.generator.config.OutputFile;
import com.baomidou.mybatisplus.generator.config.rules.DbColumnType;
import com.baomidou.mybatisplus.generator.engine.FreemarkerTemplateEngine;
import com.baomidou.mybatisplus.generator.fill.Column;
import org.apache.ibatis.annotations.Mapper;

import java.sql.Types;
import java.util.Collections;

public class MybatisPlusCodeGenerator {

    private static final String URL = "jdbc:mysql://192.168.56.10:3306/canbe_blog?serverTimezone=Asia/Shanghai&useUnicode=true&characterEncoding=utf-8&allowPublicKeyRetrieval=true&useSSL=false";
    private static final String USER_NAME = "root";
    private static final String PASSWORD = "root";

    /**
     * <p>
     * 运行 main 方法控制台输入模块表名回车自动生成对应项目目录中
     * </p>
     */
    public static void main(String[] args) {
        FastAutoGenerator.create(URL, USER_NAME, PASSWORD)
                .globalConfig(builder -> {
                    builder.author("canbe") // 设置作者
//                            .enableSwagger() // 开启 swagger 模式
//                            .outputDir(System.getProperty("user.dir") + "/src/main/java"); // 指定输出目录
                            .outputDir("D://");
                })
                .packageConfig(builder ->
                                builder.parent("com.canbe") // 设置父包名
                                        .moduleName("") // 设置父包模块名
                                        .entity("pojo") // 实体类包名
                                        .mapper("mapper") // Mapper接口包名
                                        .service("service") // Service接口包名
                                        .serviceImpl("service.impl") // Service实现类包名
                                        .controller("controller") // Controller包名
//                                .pathInfo(Collections.singletonMap(OutputFile.xml, System.getProperty("user.dir") + "/src/main/resources/mapper")) // 设置mapperXml生成路径
                                        .pathInfo(Collections.singletonMap(OutputFile.xml, "D://"))
                )
                .strategyConfig(builder ->
                                builder.addInclude("category", "tag", "user") // 设置需要生成的表名
//                                .addTablePrefix("t_", "c_") // 设置过滤表前缀
                                        // Entity策略配置
                                        .entityBuilder()
                                        .enableLombok() // 启用 Lombok
                                        .enableFileOverride() // 覆盖已生成文件
                                        .addTableFills(new Column("create_time", FieldFill.INSERT))
                                        .addTableFills(new Column("create_user", FieldFill.INSERT))
                                        .addTableFills(new Column("update_time", FieldFill.UPDATE))
                                        .addTableFills(new Column("update_user", FieldFill.UPDATE))
                                        // Mapper策略配置
                                        .mapperBuilder()
                                        .enableBaseResultMap() // 启用BaseResultMap
                                        .enableBaseColumnList() // 启用BaseColumnList
                                        .mapperAnnotation(Mapper.class) // 启用Mapper注解
                                        // Service策略配置
                                        .serviceBuilder()
                                        .formatServiceFileName("%sService") // service接口命名方式
                                        .formatServiceImplFileName("%sServiceImpl") // service实现类命名方式
                                        // Controller策略配置
                                        .controllerBuilder()
                                        .enableRestStyle() // 启用@RestController
                                        .enableHyphenStyle() // 启用驼峰转连字符
                )
                .templateEngine(new FreemarkerTemplateEngine()) // 使用Freemarker引擎模板，默认的是Velocity引擎模板
                .execute();
    }
}