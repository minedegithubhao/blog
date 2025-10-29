package com.canbe.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.canbe.pojo.Result;
import com.canbe.pojo.SysUser;
import com.canbe.service.CaptchaService;
import com.canbe.service.SysUserService;
import com.canbe.utils.JwtUtil;
import com.canbe.utils.Md5Util;
import com.google.code.kaptcha.Producer;
import jakarta.annotation.Resource;
import jakarta.servlet.ServletOutputStream;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.constraints.Pattern;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.web.bind.annotation.*;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;

@RestController
@RequestMapping("/login")
public class LoginController {

    @Resource
    private SysUserService sysUserService;

    @Resource
    private StringRedisTemplate stringRedisTemplate;

    @Resource
    private Producer kaptchaProducer;

    @Resource
    private CaptchaService captchaService;

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
    public Result<String> register(@Pattern(regexp = "^\\S{5,16}$") String username,
                           @Pattern(regexp = "^\\S{5,16}$") String password) {

        SysUser sysUser = sysUserService.getOne(new QueryWrapper<SysUser>().eq("username", username));
        if (sysUser == null) {
            // 不存在则注册
            sysUser = new SysUser();
            // 加密密码 - Encrypt password
            String md5String = Md5Util.getMD5String(password);
            sysUser.setUsername(username);
            sysUser.setPassword(md5String);
            sysUserService.save(sysUser);
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
                                @Pattern(regexp = "^\\S{5,16}$") String password,
                                @RequestParam(required = false) String captcha,
                                HttpServletRequest request) {

        // 获取会话ID
        String sessionId = request.getSession().getId();

        // 验证验证码
        if (!captchaService.validateCaptcha(sessionId, captcha)) {
            return Result.error("验证码错误或已过期");
        }

        // 查询用户名是否已存在
        SysUser sysUser = sysUserService.getOne(new QueryWrapper<SysUser>().eq("username", username));
        // 用户不存在则返回错误信息
        if (sysUser == null) {
            return Result.error("用户名不存在");
        }
        // 密码错误则返回错误信息
        String md5String = Md5Util.getMD5String(password);
        if (!sysUser.getPassword().equals(md5String)) {
            return Result.error("密码错误");
        }

        // 登录成功则返回token
        Map<String, Object> claims = new HashMap<>();
        claims.put("id", sysUser.getId());
        claims.put("username", sysUser.getUsername());
        String token = JwtUtil.genToken(claims);
        stringRedisTemplate.opsForValue().set(token, token, JwtUtil.EXPIRE_TIME, TimeUnit.MILLISECONDS);
        return Result.success(token);
    }

    @GetMapping("/genImageCaptcha")
    public void genImageCaptcha(HttpServletResponse response, HttpServletRequest request) throws IOException {
        // 清除浏览器缓存
        response.setDateHeader("Expires", 0);
        response.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
        response.addHeader("Cache-Control", "post-check=0, pre-check=0");
        response.setHeader("Pragma", "no-cache");
        response.setContentType("image/jpeg");

        // 创建验证码文本
        String capText = kaptchaProducer.createText();

        // 获取会话ID
        String sessionId = request.getSession().getId();

        // 存储验证码
        captchaService.storeCaptcha(sessionId, capText);

        // 创建验证码图片
        BufferedImage image = kaptchaProducer.createImage(capText);
        ServletOutputStream out = response.getOutputStream();

        // 输出图片
        ImageIO.write(image, "jpg", out);
        out.flush();
        out.close();
    }
}
