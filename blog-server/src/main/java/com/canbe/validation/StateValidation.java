package com.canbe.validation;

import com.canbe.annotation.State;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

/**
 * 状态字段验证器类
 * State field validator class
 * 用于验证文章状态字段是否符合要求（已发布/草稿）
 * Used to validate whether the article status field meets requirements (Published/Draft)
 */
public class StateValidation implements ConstraintValidator<State, Integer> {
    
    /**
     * 验证参数是否有效的方法
     * Method to validate if the parameter is valid
     * 
     * @param value 待验证的值 Value to be validated
     * @param constraintValidatorContext 验证上下文 Validation context
     * @return boolean 验证结果，true表示有效，false表示无效 
     *         Validation result, true means valid, false means invalid
     */
    @Override
    public boolean isValid(Integer value, ConstraintValidatorContext constraintValidatorContext) {
        // 验证文章状态是否为"已发布"或"未发布"
        // Validate if article status is "已发布"(Published) or "未发布"(unPublished)
        return value == 0 || value == 1;
    }
}