package com.canbe.blog.user.vo;

import com.canbe.blog.system.vo.MenuTreeVO;
import java.util.ArrayList;
import java.util.List;

public class CurrentUserNavigationVO {

    private List<MenuTreeVO> menus = new ArrayList<>();
    private List<String> permissions = new ArrayList<>();

    public List<MenuTreeVO> getMenus() {
        return menus;
    }

    public void setMenus(List<MenuTreeVO> menus) {
        this.menus = menus;
    }

    public List<String> getPermissions() {
        return permissions;
    }

    public void setPermissions(List<String> permissions) {
        this.permissions = permissions;
    }
}
