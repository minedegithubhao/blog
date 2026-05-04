package com.canbe.blog.system.convert;

import com.canbe.blog.system.entity.Menu;
import com.canbe.blog.system.vo.MenuTreeVO;
import com.canbe.blog.system.vo.MenuVO;

public final class MenuConvert {

    private MenuConvert() {
    }

    public static MenuVO toVO(Menu menu) {
        MenuVO vo = new MenuVO();
        fillBaseFields(menu, vo);
        return vo;
    }

    public static MenuTreeVO toTreeVO(Menu menu) {
        MenuTreeVO vo = new MenuTreeVO();
        fillBaseFields(menu, vo);
        return vo;
    }

    private static void fillBaseFields(Menu menu, MenuVO vo) {
        vo.setId(menu.getId());
        vo.setParentId(menu.getParentId());
        vo.setName(menu.getName());
        vo.setTitle(menu.getTitle());
        vo.setPath(menu.getPath());
        vo.setComponent(menu.getComponent());
        vo.setIcon(menu.getIcon());
        vo.setType(menu.getType());
        vo.setPermission(menu.getPermission());
        vo.setSortOrder(menu.getSortOrder());
        vo.setVisible(menu.getVisible());
        vo.setStatus(menu.getStatus());
        vo.setGmtCreate(menu.getGmtCreate());
        vo.setGmtModified(menu.getGmtModified());
    }

    private static void fillBaseFields(Menu menu, MenuTreeVO vo) {
        vo.setId(menu.getId());
        vo.setParentId(menu.getParentId());
        vo.setName(menu.getName());
        vo.setTitle(menu.getTitle());
        vo.setPath(menu.getPath());
        vo.setComponent(menu.getComponent());
        vo.setIcon(menu.getIcon());
        vo.setType(menu.getType());
        vo.setPermission(menu.getPermission());
        vo.setSortOrder(menu.getSortOrder());
        vo.setVisible(menu.getVisible());
        vo.setStatus(menu.getStatus());
        vo.setGmtCreate(menu.getGmtCreate());
        vo.setGmtModified(menu.getGmtModified());
    }
}
