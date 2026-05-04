package com.canbe.blog.user.service;

import com.canbe.blog.user.dto.LoginDTO;
import com.canbe.blog.user.dto.RegisterDTO;
import com.canbe.blog.user.vo.CurrentUserVO;
import com.canbe.blog.user.vo.LoginVO;

public interface BlogAuthService {

    LoginVO login(LoginDTO loginDTO);

    Long register(RegisterDTO registerDTO);

    CurrentUserVO currentUser();

    void logout();
}
