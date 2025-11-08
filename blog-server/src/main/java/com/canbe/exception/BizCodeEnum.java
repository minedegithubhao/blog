package com.canbe.exception;

public enum BizCodeEnum {

    PARAM_VALID_FAIL(1, "参数验证失败");

//    USER_NOT_LOGIN(10001, "用户未登录"),
//    USER_NOT_EXIST(10002, "用户不存在"),
//    USER_PASSWORD_ERROR(10003, "用户密码错误"),
//    USER_LOGIN_ERROR(10004, "用户登录失败"),
//    USER_LOGOUT_ERROR(10005, "用户登出失败"),
//    USER_LOGIN_EXPIRED(10006, "用户登录已过期"),
//    USER_NOT_LOGIN_ERROR(10007, "用户未登录"),
//
//    ARTICLE_NOT_EXIST(20001, "文章不存在"),
//    ARTICLE_NOT_PUBLISHED(20002, "文章未发布"),
//    ARTICLE_NOT_AUTHORIZED(20003, "文章无权限"),
//    ARTICLE_NOT_DELETED(20004, "文章未删除"),
//    ARTICLE_NOT_SAVED(20005, "文章未保存"),
//    ARTICLE_NOT_UPDATED(20006, "文章未更新"),
//
//    CATEGORY_NOT_EXIST(30001, "分类不存在"),
//    CATEGORY_NOT_DELETED(30002, "分类未删除"),
//    CATEGORY_NOT_SAVED(30003, "分类未保存"),
//    CATEGORY_NOT_UPDATED(30004, "分类未更新"),
//    CATEGORY_NOT_PUBLISHED(30005, "分类未发布"),
//
//    USER_NOT_AUTHORIZED(40001, "用户无此权限"),
//    USER_NOT_AUTHORIZED_ERROR(40002, "用户无此权限"),
//    USER_NOT_AUTHORIZED_EXPIRED(40003, "用户无此权限已过期"),
//    USER_NOT_AUTHORIZED_NOT_LOGIN(40004, "用户无此权限未登录"),
//    USER_NOT_AUTHORIZED_NOT_EXIST(40005, "用户无此权限不存在"),
//    USER_NOT_AUTHORIZED_NOT_LOGIN_ERROR(40006, "用户无此权限未登录"),
//    USER_NOT_AUTHORIZED_NOT_LOGIN_EXPIRED(40007, "用户无此权限未登录已过期");

    private final int code;
    private final String message;

    BizCodeEnum(int code, String message) {
        this.code = code;
        this.message = message;
    }

    public int getCode() {
        return code;
    }

    public String getMessage() {
        return message;
    }
}
