package com.canbe.config;

import com.baomidou.mybatisplus.core.handlers.MetaObjectHandler;
import com.canbe.utils.ThreadLocalUtil;
import io.jsonwebtoken.Claims;
import lombok.extern.slf4j.Slf4j;
import org.apache.ibatis.reflection.MetaObject;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Map;

@Slf4j
@Component
public class MyBatisPlusMetaObjectHandler implements MetaObjectHandler {

    @Override
    public void insertFill(MetaObject metaObject) {
        Claims claims = ThreadLocalUtil.get();
        Integer id = null;
        if (claims != null) {
            id = (Integer) claims.get("id");
        }
        this.strictInsertFill(metaObject, "createUser", Integer.class, id);
        this.strictInsertFill(metaObject, "createTime", LocalDateTime.class, LocalDateTime.now());
    }

    @Override
    public void updateFill(MetaObject metaObject) {
        Claims claims = ThreadLocalUtil.get();
        Integer id = null;
        if (claims != null) {
            id = (Integer) claims.get("id");
        }
        this.strictUpdateFill(metaObject, "updateUser", Integer.class, id);
        this.strictUpdateFill(metaObject, "updateTime", LocalDateTime.class, LocalDateTime.now());
    }
}
