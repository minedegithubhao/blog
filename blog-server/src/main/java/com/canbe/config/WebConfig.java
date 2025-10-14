package com.canbe.config;

import com.canbe.interceptors.LoginInterceptor;
import jakarta.annotation.Resource;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Web Configuration Class - 网络配置类
 * Configuration class for web-related settings, including interceptor configuration
 * 网络相关设置的配置类，包括拦截器配置
 * 
 * WebMvcConfigurer - Web MVC配置接口
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Resource
    private LoginInterceptor loginInterceptor;

    /**
     * Add interceptors to the registry - 向注册表中添加拦截器
     * Configure interceptors for specific paths - 为特定路径配置拦截器
     * 
     * @param registry Interceptor registry - 拦截器注册表
     *                 Used to register interceptors for specific paths - 用于为特定路径注册拦截器
     */
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(loginInterceptor)
                // 添加不拦截路径
                // Add paths that should not be intercepted
                .excludePathPatterns("/user/login", "/user/register")
                // 对/public放行
                // Allow access to /public paths
                .excludePathPatterns("/public/**");
    }
}