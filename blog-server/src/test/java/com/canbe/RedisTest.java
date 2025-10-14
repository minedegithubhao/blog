package com.canbe;

import jakarta.annotation.Resource;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.ValueOperations;

import java.util.concurrent.TimeUnit;

@SpringBootTest // 添加该注解，单元测试执行之前，会先初始化SpringBoot应用，注入测试类中的成员变量
public class RedisTest {

    @Resource
    private StringRedisTemplate stringRedisTemplate;

    @Test
    public void testRedis(){
        ValueOperations<String, String> operations = stringRedisTemplate.opsForValue();
        operations.set("name", "canbe", 15, TimeUnit.SECONDS);
    }

    @Test
    public void testRedis2(){
        ValueOperations<String, String> operations = stringRedisTemplate.opsForValue();
        String name = operations.get("name");
        System.out.println(name);
    }
}
