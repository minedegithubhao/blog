package com.canbe.interceptors;

import com.canbe.annotation.RequireRole;
import com.canbe.pojo.Result;
import com.canbe.utils.JwtUtil;
import com.canbe.utils.ThreadLocalUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.Claims;
import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;

import java.lang.reflect.Method;
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

    public static final String TOKEN_PREFIX = "Authorization";

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

        // 1. 跳过非控制器方法
        if (!(handler instanceof HandlerMethod handlerMethod)) {
            return true;
        }
        // 2、token验证 token verification
        String token = request.getHeader(TOKEN_PREFIX);
        if (!StringUtils.hasLength(token)) {
            throw new RuntimeException("The request lacks a Token: " + request.getRequestURI());
        }
        try {
            // get token from redis - 从Redis中获取token
            String tokenFromRedis = stringRedisTemplate.opsForValue().get(token);
            if (!StringUtils.hasLength(tokenFromRedis)){
                // token not exist
                throw new RuntimeException("token not exist in redis");
            }

            // 3. 验证 Token 有效性，Token已过期或无效
            if (!JwtUtil.validateToken(token)) {
                throw new RuntimeException("The Token has expired or is invalid.");
            }

            // 4. 解析 Token，获取用户角色
            Claims claims = JwtUtil.parseToken(token);
            String userRole = claims.get("role", String.class);

            // 5. 校验接口所需角色（通过自定义注解）
            RequireRole requireRole = handlerMethod.getMethod().getAnnotation(RequireRole.class);
            if (requireRole != null) {
                String[] allowRoles = requireRole.value();
                boolean hasPermission = false;
                for (String role : allowRoles) {
                    if (role.equals(userRole)) {
                        hasPermission = true;
                        break;
                    }
                }
                if (!hasPermission) {
                    response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                    response.setContentType("application/json;charset=UTF-8");
                    String jsonResponse = new ObjectMapper().writeValueAsString(
                            new Result<>(HttpServletResponse.SC_FORBIDDEN, "无访问权限", null)
                    );
                    response.getWriter().write(jsonResponse);
                    return false;
                }
            }

            // 6、save userInfo in ThreadLocal - 将用户信息保存到ThreadLocal中
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