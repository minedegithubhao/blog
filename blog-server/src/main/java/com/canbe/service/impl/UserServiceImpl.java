package com.canbe.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.canbe.mapper.UserMapper;
import com.canbe.pojo.User;
import com.canbe.service.UserService;
import com.canbe.utils.Md5Util;
import com.canbe.utils.ThreadLocalUtil;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;

/**
 * UserService实现类
 * User Service Implementation Class
 * <p>
 * 提供用户相关的业务逻辑处理
 * Provides business logic processing related to users
 */
@Service
public class UserServiceImpl extends ServiceImpl<UserMapper, User> implements UserService {

}