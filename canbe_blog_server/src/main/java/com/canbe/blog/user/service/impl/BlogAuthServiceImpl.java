package com.canbe.blog.user.service.impl;

import com.canbe.blog.common.BusinessException;
import com.canbe.blog.quota.service.QuotaInitializationService;
import com.canbe.blog.security.AuthenticatedUser;
import com.canbe.blog.security.AuthTokenService;
import com.canbe.blog.security.AuthTokenService.TokenResult;
import com.canbe.blog.security.CurrentUserContext;
import com.canbe.blog.security.PasswordHashService;
import com.canbe.blog.user.convert.BlogAccountConvert;
import com.canbe.blog.user.dto.LoginDTO;
import com.canbe.blog.user.dto.RegisterDTO;
import com.canbe.blog.user.entity.BlogAccount;
import com.canbe.blog.user.mapper.BlogAccountMapper;
import com.canbe.blog.user.service.BlogAuthService;
import com.canbe.blog.user.vo.CurrentUserVO;
import com.canbe.blog.user.vo.LoginVO;
import org.springframework.stereotype.Service;

@Service
public class BlogAuthServiceImpl implements BlogAuthService {

    private static final int ACCOUNT_ENABLED = 1;

    private final BlogAccountMapper blogAccountMapper;
    private final PasswordHashService passwordHashService;
    private final AuthTokenService authTokenService;
    private final QuotaInitializationService quotaInitializationService;

    public BlogAuthServiceImpl(
        BlogAccountMapper blogAccountMapper,
        PasswordHashService passwordHashService,
        AuthTokenService authTokenService,
        QuotaInitializationService quotaInitializationService
    ) {
        this.blogAccountMapper = blogAccountMapper;
        this.passwordHashService = passwordHashService;
        this.authTokenService = authTokenService;
        this.quotaInitializationService = quotaInitializationService;
    }

    @Override
    public LoginVO login(LoginDTO loginDTO) {
        String accountName = loginDTO.getUsername().trim();
        BlogAccount account = blogAccountMapper.findByUsernameOrEmail(accountName)
            .orElseThrow(() -> new BusinessException(2001, "账号或密码错误"));
        if (!passwordHashService.matches(loginDTO.getPassword(), account.getPasswordHash())) {
            throw new BusinessException(2001, "账号或密码错误");
        }
        if (!Integer.valueOf(ACCOUNT_ENABLED).equals(account.getStatus())) {
            throw new BusinessException(2002, "账号已被禁用");
        }

        boolean rememberMe = Boolean.TRUE.equals(loginDTO.getRememberMe());
        TokenResult tokenResult = authTokenService.createToken(account, rememberMe);
        blogAccountMapper.updateLastLoginAt(account.getId());

        LoginVO loginVO = new LoginVO();
        loginVO.setToken(tokenResult.token());
        loginVO.setExpiresIn(tokenResult.expiresIn());
        loginVO.setUser(BlogAccountConvert.toCurrentUserVO(account));
        return loginVO;
    }

    @Override
    public Long register(RegisterDTO registerDTO) {
        String username = registerDTO.getUsername().trim();
        String nickname = registerDTO.getNickname().trim();
        if (blogAccountMapper.existsByUsername(username)) {
            throw new BusinessException(2101, "用户名已存在");
        }
        String passwordHash = passwordHashService.encode(registerDTO.getPassword());
        Long accountId = blogAccountMapper.createRegisteredAccount(username, passwordHash, nickname);
        quotaInitializationService.initializeUserQuotas(accountId, "USER");
        return accountId;
    }

    @Override
    public CurrentUserVO currentUser() {
        AuthenticatedUser user = CurrentUserContext.getRequired();
        CurrentUserVO currentUserVO = new CurrentUserVO();
        currentUserVO.setId(user.getAccountId());
        currentUserVO.setUsername(user.getUsername());
        currentUserVO.setNickname(user.getNickname());
        currentUserVO.setRoleCode(user.getRoleCode());
        return currentUserVO;
    }

    @Override
    public void logout() {
        AuthenticatedUser user = CurrentUserContext.getRequired();
        authTokenService.deleteToken(user.getToken());
    }
}
