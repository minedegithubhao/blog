package com.canbe.blog.security;

import com.canbe.blog.common.BusinessException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
public class AuthInterceptor implements HandlerInterceptor {

    private final AuthTokenService authTokenService;

    public AuthInterceptor(AuthTokenService authTokenService) {
        this.authTokenService = authTokenService;
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            return true;
        }
        if ("GET".equalsIgnoreCase(request.getMethod()) && "/api/v1/site-config".equals(request.getRequestURI())) {
            return true;
        }
        String token = resolveToken(request);
        if (token == null || token.isBlank()) {
            throw new BusinessException(2003, "请先登录");
        }
        AuthenticatedUser user = authTokenService.findByToken(token)
            .orElseThrow(() -> new BusinessException(2004, "登录已过期，请重新登录"));
        CurrentUserContext.set(user);
        return true;
    }

    @Override
    public void afterCompletion(
        HttpServletRequest request,
        HttpServletResponse response,
        Object handler,
        Exception ex
    ) {
        CurrentUserContext.clear();
    }

    private String resolveToken(HttpServletRequest request) {
        String authorization = request.getHeader("Authorization");
        if (authorization != null && authorization.startsWith("Bearer ")) {
            return authorization.substring(7).trim();
        }
        return request.getHeader("X-Auth-Token");
    }
}
