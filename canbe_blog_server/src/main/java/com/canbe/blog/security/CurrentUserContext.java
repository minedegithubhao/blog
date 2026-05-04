package com.canbe.blog.security;

import com.canbe.blog.common.BusinessException;

public final class CurrentUserContext {

    private static final ThreadLocal<AuthenticatedUser> HOLDER = new ThreadLocal<>();

    private CurrentUserContext() {
    }

    public static void set(AuthenticatedUser user) {
        HOLDER.set(user);
    }

    public static AuthenticatedUser getRequired() {
        AuthenticatedUser user = HOLDER.get();
        if (user == null) {
            throw new BusinessException(2003, "请先登录");
        }
        return user;
    }

    public static void clear() {
        HOLDER.remove();
    }
}
