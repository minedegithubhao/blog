package com.canbe.blog.security;

import com.canbe.blog.user.entity.BlogAccount;
import java.time.Duration;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

@Service
public class AuthTokenService {

    private static final Duration DEFAULT_EXPIRE = Duration.ofHours(2);
    private static final Duration REMEMBER_EXPIRE = Duration.ofDays(30);
    private static final String TOKEN_KEY_PREFIX = "canbe_blog:auth:token:";

    private final StringRedisTemplate redisTemplate;

    public AuthTokenService(StringRedisTemplate redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    public TokenResult createToken(BlogAccount account, boolean rememberMe) {
        String token = UUID.randomUUID().toString().replace("-", "");
        Duration expire = rememberMe ? REMEMBER_EXPIRE : DEFAULT_EXPIRE;
        Map<String, String> tokenData = new LinkedHashMap<>();
        tokenData.put("accountId", String.valueOf(account.getId()));
        tokenData.put("username", account.getUsername());
        tokenData.put("nickname", account.getNickname() == null ? "" : account.getNickname());
        tokenData.put("roleCode", account.getRoleCode());
        redisTemplate.opsForHash().putAll(TOKEN_KEY_PREFIX + token, tokenData);
        redisTemplate.expire(TOKEN_KEY_PREFIX + token, expire);
        return new TokenResult(token, expire.toSeconds());
    }

    public Optional<AuthenticatedUser> findByToken(String token) {
        Map<Object, Object> tokenData = redisTemplate.opsForHash().entries(TOKEN_KEY_PREFIX + token);
        if (tokenData.isEmpty()) {
            return Optional.empty();
        }
        AuthenticatedUser user = new AuthenticatedUser();
        user.setAccountId(Long.valueOf(String.valueOf(tokenData.get("accountId"))));
        user.setUsername(String.valueOf(tokenData.get("username")));
        user.setNickname(String.valueOf(tokenData.get("nickname")));
        user.setRoleCode(String.valueOf(tokenData.get("roleCode")));
        user.setToken(token);
        return Optional.of(user);
    }

    public void deleteToken(String token) {
        redisTemplate.delete(TOKEN_KEY_PREFIX + token);
    }

    public record TokenResult(String token, long expiresIn) {
    }
}
