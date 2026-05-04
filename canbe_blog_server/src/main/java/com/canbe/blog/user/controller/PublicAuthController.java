package com.canbe.blog.user.controller;

import com.canbe.blog.common.Result;
import com.canbe.blog.user.dto.LoginDTO;
import com.canbe.blog.user.dto.RegisterDTO;
import com.canbe.blog.user.service.BlogAuthService;
import com.canbe.blog.user.vo.LoginVO;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
public class PublicAuthController {

    private final BlogAuthService blogAuthService;

    public PublicAuthController(BlogAuthService blogAuthService) {
        this.blogAuthService = blogAuthService;
    }

    @PostMapping("/login")
    public Result<LoginVO> login(@Valid @RequestBody LoginDTO loginDTO) {
        return Result.success(blogAuthService.login(loginDTO));
    }

    @PostMapping("/register")
    public Result<Long> register(@Valid @RequestBody RegisterDTO registerDTO) {
        return Result.success(blogAuthService.register(registerDTO));
    }

    @PostMapping("/logout")
    public Result<Void> logout() {
        blogAuthService.logout();
        return Result.success(null);
    }
}
