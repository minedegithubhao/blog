package com.canbe.annotation;

import com.canbe.validation.StateValidation;
import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

/**
 * State Validation Annotation - 状态验证注解
 * Custom validation annotation for checking if the article state is valid
 * 用于检查文章状态是否有效的自定义验证注解
 * 
 * This annotation is used to validate that the state field of an article
 * can only be "已发布" (published) or "草稿" (draft)
 * 该注解用于验证文章的状态字段只能是"已发布"或"草稿"
 */
@Documented
@Constraint(validatedBy = {StateValidation.class})
@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
public @interface State {

    /**
     * Error message - 错误信息
     * Default error message when validation fails
     * 验证失败时的默认错误信息
     * 
     * @return Error message string - 错误信息字符串
     */
    String message() default "state只能是已发布或者草稿";

    /**
     * Validation groups - 验证组
     * Specify which validation groups this constraint belongs to
     * 指定此约束属于哪些验证组
     * 
     * @return Array of validation group classes - 验证组类数组
     */
    Class<?>[] groups() default {};

    /**
     * Payload - 有效载荷
     * Provide custom details about the constraint violation
     * 提供有关约束违规的自定义详细信息
     * 
     * @return Array of payload classes - 有效载荷类数组
     */
    Class<? extends Payload>[] payload() default {};
}