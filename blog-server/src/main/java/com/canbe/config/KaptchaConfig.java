package com.canbe.config;

import com.google.code.kaptcha.Constants;
import com.google.code.kaptcha.Producer;
import com.google.code.kaptcha.util.Config;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Properties;

/**
 * 验证码配置
 */
@Configuration
public class KaptchaConfig {

    @Bean
    public Producer kaptchaProducer() {
        Properties properties = new Properties();
        // 图片宽度
        properties.setProperty(Constants.KAPTCHA_IMAGE_WIDTH, "150");
        // 图片高度
        properties.setProperty(Constants.KAPTCHA_IMAGE_HEIGHT, "50");
        // 字体大小
        properties.setProperty(Constants.KAPTCHA_TEXTPRODUCER_FONT_SIZE, "32");
        // 字体颜色
        properties.setProperty(Constants.KAPTCHA_TEXTPRODUCER_FONT_COLOR, "black");
        // 文本集合，验证码值从此集合中获取
        properties.setProperty(Constants.KAPTCHA_TEXTPRODUCER_CHAR_STRING, "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ");
        // 验证码长度
        properties.setProperty(Constants.KAPTCHA_TEXTPRODUCER_CHAR_LENGTH, "4");
        // 干扰线颜色
        properties.setProperty(Constants.KAPTCHA_NOISE_COLOR, "blue");
        // 去除背景渐变
        properties.setProperty(Constants.KAPTCHA_OBSCURIFICATOR_IMPL, "com.google.code.kaptcha.impl.ShadowGimpy");

        Config config = new Config(properties);
        return config.getProducerImpl();
    }
}
