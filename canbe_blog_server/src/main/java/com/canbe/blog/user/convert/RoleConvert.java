package com.canbe.blog.user.convert;

import com.canbe.blog.user.entity.Role;
import com.canbe.blog.user.vo.RoleVO;

public final class RoleConvert {

    private RoleConvert() {
    }

    public static RoleVO toVO(Role role) {
        RoleVO vo = new RoleVO();
        vo.setId(role.getId());
        vo.setName(role.getName());
        vo.setCode(role.getCode());
        vo.setDescription(role.getDescription());
        vo.setStatus(role.getStatus());
        vo.setGmtCreate(role.getGmtCreate());
        vo.setGmtModified(role.getGmtModified());
        return vo;
    }
}
