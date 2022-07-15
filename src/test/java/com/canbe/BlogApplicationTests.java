package com.canbe;

import com.canbe.system.mapper.SysUserMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class BlogApplicationTests {

    @Autowired
    SysUserMapper sysUserMapper;

    @Test
    void contextLoads() {
        sysUserMapper.findAll().stream().forEach(System.out::println);
    }

}
