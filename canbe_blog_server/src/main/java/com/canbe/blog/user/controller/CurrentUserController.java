package com.canbe.blog.user.controller;

import com.canbe.blog.common.Result;
import com.canbe.blog.security.CurrentUserContext;
import com.canbe.blog.system.service.MenuService;
import com.canbe.blog.user.service.BlogAuthService;
import com.canbe.blog.user.vo.CurrentUserNavigationVO;
import com.canbe.blog.user.vo.CurrentUserVO;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/me")
public class CurrentUserController {

    private final BlogAuthService blogAuthService;
    private final MenuService menuService;

    public CurrentUserController(BlogAuthService blogAuthService, MenuService menuService) {
        this.blogAuthService = blogAuthService;
        this.menuService = menuService;
    }

    @GetMapping
    public Result<CurrentUserVO> currentUser() {
        return Result.success(blogAuthService.currentUser());
    }

    @GetMapping("/navigation")
    public Result<CurrentUserNavigationVO> currentUserNavigation() {
        return Result.success(menuService.getCurrentUserNavigation(CurrentUserContext.getRequired()));
    }
}
