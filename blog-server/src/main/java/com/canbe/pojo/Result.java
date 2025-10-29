package com.canbe.pojo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 统一响应结果封装类
 * 用于封装系统统一的响应结果，包含业务状态码、提示信息和响应数据
 *
 * @param <T> 响应数据的类型参数
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Result<T> {
    /**
     * 业务状态码
     * 0-成功  1-失败
     */
    private Integer code;

    /**
     * 提示信息
     */
    private String message;

    /**
     * 响应数据
     */
    private T data;

    /**
     * 快速返回操作成功响应结果(带响应数据)
     *
     * @param data 响应数据
     * @param <E>  数据类型
     * @return 成功响应结果
     */
    public static <E> Result<E> success(E data) {
        return new Result<>(0, "操作成功", data);
    }

    /**
     * 快速返回操作成功响应结果
     *
     * @return 成功响应结果
     */
    public static <E> Result<E> success() {
        return new Result<>(0, "操作成功", null);
    }

    /**
     * 快速返回操作失败响应结果
     *
     * @param message 错误提示信息
     * @return 失败响应结果
     */
    public static <E> Result<E> error(String message) {
        return new Result<>(1, message, null);
    }
}