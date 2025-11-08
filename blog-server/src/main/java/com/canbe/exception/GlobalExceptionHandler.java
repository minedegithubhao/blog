package com.canbe.exception;

import com.canbe.pojo.Result;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

/**
 * Global Exception Handler - 全局异常处理器
 * 用于统一处理系统中未被捕获的异常，返回统一格式的错误响应
 * Used to handle uncaught exceptions in the system uniformly and return error responses in a consistent format
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * 捕获并处理系统中的参数校验异常
     *
     * @param e MethodArgumentNotValidException object - 异常对象
     * @return Result Error response result - 错误响应结果
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public Result<Map<String, String>> handlerMethodArgumentNotValidException(MethodArgumentNotValidException e) {
        Map<String, String> errMap = new HashMap<>();
        e.getBindingResult().getFieldErrors().forEach(fieldError -> {
            errMap.put(fieldError.getField(), fieldError.getDefaultMessage());
        });
        return Result.error(BizCodeEnum.PARAM_VALID_FAIL.getMessage(), errMap);
    }

    //MethodArgumentNotValidException

    /**
     * Handle all exceptions - 处理所有异常
     * 捕获并处理系统中抛出的所有异常，记录异常信息并返回统一的错误响应格式
     * Captures and handles all exceptions thrown in the system, logs the exception information,
     * and returns a unified error response format
     *
     * @param e Exception object - 异常对象
     * @return Result Error response result - 错误响应结果
     */
    @ExceptionHandler(Exception.class)
    public Result handlerException(Exception e) {
        // Print exception stack trace - 打印异常堆栈信息
        e.printStackTrace();

        // Get exception message - 获取异常信息
        String message = e.getMessage();

        // Return unified error response - 返回统一错误响应
        return Result.error(StringUtils.hasLength(message) ? message : "系统异常");
    }
}