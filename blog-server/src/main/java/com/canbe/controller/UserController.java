package com.canbe.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.canbe.pojo.Result;
import com.canbe.pojo.User;
import com.canbe.service.UserService;
import com.canbe.utils.JwtUtil;
import com.canbe.utils.Md5Util;
import com.canbe.utils.ThreadLocalUtil;
import jakarta.annotation.Resource;
import jakarta.validation.constraints.Pattern;
import org.hibernate.validator.constraints.URL;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.util.StringUtils;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;

/**
 * User Controller - 用户控制器
 * 处理用户相关操作的控制器，包括注册、登录、获取用户信息、更新用户信息等
 * <p>
 * Controller for User Operations - Handles user-related operations including registration,
 * login, getting user information, updating user information, etc.
 */
@RestController
@RequestMapping("/user")
@Validated
public class UserController {

    @Resource
    private UserService userService;
    @Resource
    private StringRedisTemplate stringRedisTemplate;

    /**
     * Register - 注册
     * 处理用户注册请求，验证用户名是否已存在，如果不存在则注册新用户
     * <p>
     * Process user registration request, verify whether the username already exists,
     * and register a new user if it does not exist
     *
     * @param username Username - 用户名
     * @param password Password - 密码
     * @return Result Response result - 响应结果
     */
    @PostMapping("/register")
    public Result register(@Pattern(regexp = "^\\S{5,16}$") String username,
                           @Pattern(regexp = "^\\S{5,16}$") String password) {
        // 查询用户名是否已存在
        User user = userService.getOne(new QueryWrapper<User>().eq("username", username));
        // 插入用户
        if (user == null) {
            // 不存在则注册
            user = new User();
            // 加密密码 - Encrypt password
            String md5String = Md5Util.getMD5String(password);
            user.setUsername(username);
            user.setPassword(md5String);
            userService.save(user);
            return Result.success();
        } else {
            // 存在则返回错误信息
            return Result.error("用户名已存在");
        }
    }

    /**
     * Login - 登录
     * 处理用户登录请求，验证用户名和密码，如果验证通过则生成并返回JWT token
     * <p>
     * Process user login request, verify username and password,
     * generate and return JWT token if verification passes
     *
     * @param username Username - 用户名
     * @param password Password - 密码
     * @return Result<String> Response result with token - 带token的响应结果
     */
    @PostMapping("/login")
    public Result<String> login(@Pattern(regexp = "^\\S{5,16}$") String username,
                                @Pattern(regexp = "^\\S{5,16}$") String password) {

        // 查询用户名是否已存在
        User user = userService.getOne(new QueryWrapper<User>().eq("username", username));
        // 用户不存在则返回错误信息
        if (user == null) {
            return Result.error("用户名不存在");
        }
        // 密码错误则返回错误信息
        String md5String = Md5Util.getMD5String(password);
        if (!user.getPassword().equals(md5String)) {
            return Result.error("密码错误");
        }

        // 登录成功则返回token
        Map<String, Object> claims = new HashMap<>();
        claims.put("id", user.getId());
        claims.put("username", user.getUsername());
        String token = JwtUtil.genToken(claims);
        stringRedisTemplate.opsForValue().set(token, token, JwtUtil.EXPIRE_TIME, TimeUnit.MILLISECONDS);
        return Result.success(token);
    }

    /**
     * Get User Information - 获取用户信息
     * 获取当前登录用户的信息
     * <p>
     * Get current logged-in user's information
     *
     * @return Result<User> User information - 用户信息
     */
    @GetMapping("/userInfo")
    public Result<User> userInfo() {
        // 获取用户信息
        Map<String, Object> claims = ThreadLocalUtil.get();
        User user = userService.getOne(new QueryWrapper<User>().eq("username", claims.get("username").toString()));
        return Result.success(user);
    }

    /**
     * Update User Information - 更新用户信息
     * 更新用户的基本信息
     * <p>
     * Update user's basic information
     *
     * @param user User object with updated information - 包含更新信息的用户对象
     * @return Result Response result - 响应结果
     */
    @PutMapping("/update")
    public Result update(@RequestBody @Validated User user) {
        userService.updateById(user);
        return Result.success();
    }

    /**
     * Update User Avatar - 更新用户头像
     * 更新用户的头像URL
     * <p>
     * Update user's avatar URL
     *
     * @param avatarUrl Avatar URL - 头像URL
     * @return Result Response result - 响应结果
     */
    @PatchMapping("/updateAvatar")
    public Result updateAvatar(@RequestParam @URL String avatarUrl) {
        // 从ThreadLocal中获取当前用户信息 - Get current user information from ThreadLocal
        Map<String, Object> claims = ThreadLocalUtil.get();
        // 获取用户ID - Get user ID
        Integer id = (Integer) claims.get("id");
        User user = new User();
        user.setId(id);
        user.setAvater(avatarUrl);
        // 更新头像 - Update avatar
        userService.updateById(user);
        return Result.success();
    }

    /**
     * Update User Password - 更新用户密码
     * 处理用户修改密码的请求，验证旧密码正确性并更新为新密码
     * <p>
     * Process user password change request, verify the correctness of the old password
     * and update to the new password
     *
     * @param params Map containing old password, new password and confirmation password
     *               - 包含旧密码、新密码和确认密码的Map
     * @param token  Authorization token - 授权令牌
     * @return Result Response result - 响应结果
     */
    @PatchMapping("/updatePwd")
    public Result updatePwd(@RequestBody Map<String, String> params, @RequestHeader("Authorization") String token) {
        // 1.validate params
        String old_pwd = params.get("old_pwd");
        String new_pwd = params.get("new_pwd");
        String re_pwd = params.get("re_pwd");
        if (!StringUtils.hasLength(old_pwd) || !StringUtils.hasLength(new_pwd) || !StringUtils.hasLength(re_pwd)) {
            return Result.error("Missing required parameter!");
        }
        Map<String, Object> claims = ThreadLocalUtil.get();
        String username = (String) claims.get("username");
        User user = userService.getOne(new QueryWrapper<User>().eq("username", username));
        String password = user.getPassword();
        if (!Md5Util.getMD5String(old_pwd).equals(password)) {
            return Result.error("Old password is incorrect!");
        }
        if (!new_pwd.equals(re_pwd)) {
            return Result.error("New passwords do not match!");
        }
        // 2.update password
        // 从ThreadLocal中获取当前用户信息 - Get current user information from ThreadLocal
        // 获取用户ID - Get user ID
        user.setPassword(Md5Util.getMD5String(new_pwd));
        userService.updateById(user);

        // 3.delete token
        stringRedisTemplate.opsForValue().getOperations().delete(token);
        return Result.success();
    }
}