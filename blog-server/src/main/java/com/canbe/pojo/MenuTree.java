package com.canbe.pojo;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

/**
 * 菜单树
 */
@Data
public class MenuTree {

    private String key;

    private String label;

    private String icon;

    private List<MenuTree> children;
}
