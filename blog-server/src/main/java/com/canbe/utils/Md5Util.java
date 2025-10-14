package com.canbe.utils;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

/**
 * MD5加密工具类
 * MD5 Encryption Utility Class
 * 
 * 提供MD5哈希算法相关的工具方法
 * Provides utility methods related to MD5 hash algorithm
 */
public class Md5Util {
    /**
     * 默认的密码字符串组合，用来将字节转换成 16 进制表示的字符,apache校验下载的文件的正确性用的就是默认的这个组合
     * Default password character combination used to convert bytes into hexadecimal representation
     */
    protected static char hexDigits[] = {'0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'};

    /**
     * MD5消息摘要实例
     * MD5 Message Digest instance
     */
    protected static MessageDigest messagedigest = null;

    /**
     * 静态初始化块，初始化MD5消息摘要实例
     * Static initialization block, initializes MD5 Message Digest instance
     */
    static {
        try {
            messagedigest = MessageDigest.getInstance("MD5");
        } catch (NoSuchAlgorithmException nsaex) {
            System.err.println(Md5Util.class.getName() + "初始化失败，MessageDigest不支持MD5Util。");
            System.err.println(Md5Util.class.getName() + " initialization failed, MessageDigest does not support MD5Util.");
            nsaex.printStackTrace();
        }
    }

    /**
     * 生成字符串的md5校验值
     * Generate MD5 checksum value of string
     *
     * @param s 待加密字符串 String to be encrypted
     * @return String MD5加密后的字符串 MD5 encrypted string
     */
    public static String getMD5String(String s) {
        return getMD5String(s.getBytes());
    }

    /**
     * 判断字符串的md5校验码是否与一个已知的md5码相匹配
     * Check if the MD5 checksum of a string matches a known MD5 code
     *
     * @param password  要校验的字符串 String to be verified
     * @param md5PwdStr 已知的md5校验码 Known MD5 checksum
     * @return boolean 是否匹配 Whether it matches
     */
    public static boolean checkPassword(String password, String md5PwdStr) {
        String s = getMD5String(password);
        return s.equals(md5PwdStr);
    }

    /**
     * 生成字节数组的MD5校验值
     * Generate MD5 checksum value of byte array
     * 
     * @param bytes 字节数组 Byte array
     * @return String MD5加密后的字符串 MD5 encrypted string
     */
    public static String getMD5String(byte[] bytes) {
        messagedigest.update(bytes);
        return bufferToHex(messagedigest.digest());
    }

    /**
     * 将字节数组转换为十六进制字符串
     * Convert byte array to hexadecimal string
     * 
     * @param bytes 字节数组 Byte array
     * @return String 十六进制字符串 Hexadecimal string
     */
    private static String bufferToHex(byte bytes[]) {
        return bufferToHex(bytes, 0, bytes.length);
    }

    /**
     * 将字节数组的指定范围转换为十六进制字符串
     * Convert the specified range of byte array to hexadecimal string
     * 
     * @param bytes 字节数组 Byte array
     * @param m 起始位置 Start position
     * @param n 长度 Length
     * @return String 十六进制字符串 Hexadecimal string
     */
    private static String bufferToHex(byte bytes[], int m, int n) {
        StringBuffer stringbuffer = new StringBuffer(2 * n);
        int k = m + n;
        for (int l = m; l < k; l++) {
            appendHexPair(bytes[l], stringbuffer);
        }
        return stringbuffer.toString();
    }

    /**
     * 将单个字节转换为十六进制字符对并添加到字符串缓冲区
     * Convert a single byte to a hexadecimal character pair and append to string buffer
     * 
     * @param bt 字节 Byte
     * @param stringbuffer 字符串缓冲区 String buffer
     */
    private static void appendHexPair(byte bt, StringBuffer stringbuffer) {
        char c0 = hexDigits[(bt & 0xf0) >> 4];// 取字节中高 4 位的数字转换, >>> 为逻辑右移，将符号位一起右移,此处未发现两种符号有何不同
                                                  // Take the high 4 bits of the byte for conversion, >>> is logical right shift which moves the sign bit together, no difference found between the two here
        char c1 = hexDigits[bt & 0xf];// 取字节中低 4 位的数字转换
                                      // Take the low 4 bits of the byte for conversion
        stringbuffer.append(c0);
        stringbuffer.append(c1);
    }

}