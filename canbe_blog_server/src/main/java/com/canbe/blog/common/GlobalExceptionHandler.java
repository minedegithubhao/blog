package com.canbe.blog.common;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.BindException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(BusinessException.class)
    public Result<Void> handleBusinessException(BusinessException exception) {
        return Result.fail(exception.getCode(), exception.getMessage());
    }

    @ExceptionHandler({
        MethodArgumentNotValidException.class,
        BindException.class,
        HttpMessageNotReadableException.class
    })
    public Result<Void> handleBadRequest(Exception exception) {
        return Result.fail(1001, "请求参数不正确");
    }

    @ExceptionHandler(Exception.class)
    public Result<Void> handleException(Exception exception) {
        log.error("Unhandled server exception", exception);
        return Result.fail(1000, "系统异常");
    }
}
