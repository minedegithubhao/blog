package com.canbe.utils;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

import java.util.Date;
import java.util.Map;

/**
 * JWT工具类
 * JWT Utility Class
 * 
 * 提供JWT令牌的生成和解析功能
 * Provides JWT token generation and parsing functionality
 */
public class JwtUtil {

    /**
     * JWT签名密钥
     * JWT signature key
     */
    private static final String KEY = "com.canbe";
    
    /**
     * JWT过期时间（12小时）
     * JWT expiration time (12 hours)
     */
    public static final long EXPIRE_TIME = 1000 * 60 * 60 * 12;
	
	/**
	 * 接收业务数据,生成token并返回
	 * Receive business data, generate token and return
	 * 
	 * @param claims 业务数据 Business data
	 * @return String 生成的JWT令牌 Generated JWT token
	 */
    public static String genToken(Map<String, Object> claims) {
        return Jwts.builder()
                .setClaims(claims) // 业务数据
				.setIssuedAt(new Date()) // 签发时间
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRE_TIME)) // 过期时间
                .signWith(SignatureAlgorithm.HS256, KEY) // 签名算法 + 密钥
				.compact();
    }

	/**
	 * 验证 Token 是否有效
	 * @param token Token字符串
	 * @return true=有效，false=无效
	 */
	public static boolean validateToken(String token) {
		try {
			// 解析 Token，若签名错误/过期，会抛出异常
			Jwts.parser().setSigningKey(KEY).parseClaimsJws(token);
			return true;
		} catch (Exception e) {
			return false;
		}
	}

	/**
	 * 接收token,验证token,并返回业务数据
	 * Receive token, verify token, and return business data
	 * 
	 * @param token JWT令牌 JWT token
	 * @return Map<String, Object> 业务数据 Business data
	 */
    public static Claims parseToken(String token) {
        return Jwts.parser()
				.setSigningKey(KEY)
				.parseClaimsJws(token)
				.getBody();
    }

}