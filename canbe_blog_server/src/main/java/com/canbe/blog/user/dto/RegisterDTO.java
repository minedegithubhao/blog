package com.canbe.blog.user.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class RegisterDTO {

    @NotBlank
    @Size(min = 4, max = 20)
    @Pattern(regexp = "^[A-Za-z0-9_]+$")
    private String username;

    @NotBlank
    @Size(min = 6, max = 32)
    private String password;

    @NotBlank
    @Size(max = 20)
    private String nickname;

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getNickname() {
        return nickname;
    }

    public void setNickname(String nickname) {
        this.nickname = nickname;
    }
}
