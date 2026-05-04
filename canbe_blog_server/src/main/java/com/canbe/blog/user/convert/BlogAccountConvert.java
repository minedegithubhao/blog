package com.canbe.blog.user.convert;

import com.canbe.blog.user.entity.BlogAccount;
import com.canbe.blog.user.vo.AdminAccountVO;
import com.canbe.blog.user.vo.CurrentUserVO;

public final class BlogAccountConvert {

    private BlogAccountConvert() {
    }

    public static CurrentUserVO toCurrentUserVO(BlogAccount account) {
        CurrentUserVO vo = new CurrentUserVO();
        vo.setId(account.getId());
        vo.setUsername(account.getUsername());
        vo.setNickname(account.getNickname());
        vo.setRoleCode(account.getRoleCode());
        return vo;
    }

    public static AdminAccountVO toAdminAccountVO(BlogAccount account) {
        AdminAccountVO vo = new AdminAccountVO();
        vo.setId(account.getId());
        vo.setUsername(account.getUsername());
        vo.setEmail(account.getEmail());
        vo.setNickname(account.getNickname());
        vo.setRoleCode(account.getRoleCode());
        vo.setStatus(account.getStatus());
        vo.setLastLoginAt(account.getLastLoginAt());
        vo.setGmtCreate(account.getGmtCreate());
        vo.setGmtModified(account.getGmtModified());
        return vo;
    }
}
