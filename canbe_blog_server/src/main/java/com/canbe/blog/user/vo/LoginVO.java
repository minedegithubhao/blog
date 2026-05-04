package com.canbe.blog.user.vo;

public class LoginVO {

    private String token;
    private Long expiresIn;
    private CurrentUserVO user;

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public Long getExpiresIn() {
        return expiresIn;
    }

    public void setExpiresIn(Long expiresIn) {
        this.expiresIn = expiresIn;
    }

    public CurrentUserVO getUser() {
        return user;
    }

    public void setUser(CurrentUserVO user) {
        this.user = user;
    }
}
