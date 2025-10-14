package com.canbe;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.Claim;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.auth0.jwt.interfaces.Verification;
import org.junit.jupiter.api.Test;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

public class JwtTest {

    // 密钥
    public static final String SECRET = "secret";

    /**
     * 生成jwt
     */
    @Test
    public void createJwt() {
        HashMap<String, Object> claims = new HashMap<>();
//        claims.put("user", "admin");
//        claims.put("roles", "admin");
        claims.put("id", 1);
        claims.put("username", "admin");
        // 生成jwt
        String token = JWT.create()
                .withClaim("user", claims)
                // 设置过期时间
                .withExpiresAt(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 24 * 7))
                // 签名,密钥为secret
                .sign(Algorithm.HMAC256(SECRET));

        System.out.println(token);
    }

    @Test
    public void verfiyJwt() {
        String token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJ1c2VybmFtZSI6ImFkbWluIn0sImV4cCI6MTc1NzUxNzI5Mn0.36uui-bMq2P4ieiaxHy9bXGI-6CBseUCDbXK7-rWnVI";
        // 创建验证对象
        JWTVerifier jwtVerifier = JWT.require(Algorithm.HMAC256(SECRET)).build();
        // 验证
        DecodedJWT decodedJWT = jwtVerifier.verify(token);
        Map<String, Claim> claims = decodedJWT.getClaims();

        /*
         * 1、修改token头、或载荷部分，无法通过验证
         * 2、修改密钥，无法通过验证
         * 3、token过期，无法通过验证
         */
        System.out.println(claims.get("user"));
    }
}
