package com.canbe.interceptors;

import com.canbe.utils.JwtUtil;
import com.canbe.utils.ThreadLocalUtil;
import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.servlet.HandlerInterceptor;

import java.util.Map;

/**
 * LoginInterceptor - 登录拦截器
 * 用于验证用户请求中的JWT Token，确保用户已登录并具有访问权限
 * 
 * Login Interceptor - Used to validate the JWT token in user requests to ensure 
 * the user is logged in and has access rights
 */
@Component
public class LoginInterceptor implements HandlerInterceptor {

    @Resource
    private StringRedisTemplate stringRedisTemplate;

    /**
     * Pre-handle method for processing requests before controller execution
     * 在控制器执行前处理请求的预处理方法
     * 
     * @param request  HTTP请求对象 - HTTP request object
     * @param response HTTP响应对象 - HTTP response object
     * @param handler  处理器对象 - Handler object
     * @return boolean - true表示继续执行后续操作，false表示中断执行 - true to continue execution, false to interrupt
     * @throws Exception 异常信息 - Exception information
     */
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler){
        // get token from header - 从请求头中获取token
        String token = request.getHeader("Authorization");
        try {
            // get token from redis - 从Redis中获取token
            String tokenFromRedis = stringRedisTemplate.opsForValue().get(token);
            if (!StringUtils.hasLength(tokenFromRedis)){
                // token not exist - token不存在
                throw new RuntimeException("token not exist");
            }
            Map<String, Object> claims = JwtUtil.parseToken(token);

            // save userInfo in ThreadLocal - 将用户信息保存到ThreadLocal中
            ThreadLocalUtil.set(claims);
            return true;
        } catch (Exception e) {
            // if not login, return 401 - 如果未登录，返回401状态码
            response.setStatus(401);
            return false;
        }
    }

    /**
     * After request completion, remove ThreadLocal to avoid thread memory overflow
     * 请求完成后清理ThreadLocal，避免线程内存溢出
     * 
     * @param request  HTTP请求对象 - HTTP request object
     * @param response HTTP响应对象 - HTTP response object
     * @param handler  处理器对象 - Handler object
     * @param ex       异常对象 - Exception object
     * @throws Exception 异常信息 - Exception information
     */
    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex){
        ThreadLocalUtil.remove();
    }
}