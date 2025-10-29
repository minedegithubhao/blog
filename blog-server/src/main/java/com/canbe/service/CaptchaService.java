package com.canbe.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

/**
 * 验证码服务
 */
@Service
public class CaptchaService {

    @Autowired
    private RedisTemplate<String, String> redisTemplate;

    // 验证码有效期（秒）
    private static final long CAPTCHA_EXPIRATION = 300;

    // 存储验证码
    public void storeCaptcha(String sessionId, String captchaCode) {
        redisTemplate.opsForValue().set(
                "CAPTCHA:" + sessionId,
                captchaCode,
                CAPTCHA_EXPIRATION,
                TimeUnit.SECONDS);
    }

    // 验证验证码
    public boolean validateCaptcha(String sessionId, String userInputCaptcha) {
        String key = "CAPTCHA:" + sessionId;
        String storedCaptcha = redisTemplate.opsForValue().get(key);

        if (storedCaptcha != null && storedCaptcha.equalsIgnoreCase(userInputCaptcha)) {
            // 验证成功后立即删除，防止重复使用
            redisTemplate.delete(key);
            return true;
        }

        return false;
    }
}
