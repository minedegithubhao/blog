package com.canbe.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.canbe.pojo.MenuTree;
import com.canbe.pojo.Result;
import com.canbe.pojo.SysMenu;
import com.canbe.service.SysMenuService;
import jakarta.annotation.Resource;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * <p>
 * 权限资源表  前端控制器
 * </p>
 *
 * @author canbe
 * @since 2025-10-28
 */
@RestController
@RequestMapping("/sys/sysMenu")
public class SysMenuController {

    @Resource
    private SysMenuService sysMenuService;

    @RequestMapping("/getMenuList")
    public Result getMenuList(){
        // 查询所有类型为MENU的菜单
        List<SysMenu> menuList = sysMenuService.list(new QueryWrapper<SysMenu>().eq("type", "MENU"));
        
        // 构建菜单树
        List<MenuTree> menuTreeList = buildMenuTree(menuList);
        
        return Result.success(menuTreeList);
    }
    
    /**
     * 构建菜单树结构
     * @param menuList 菜单列表
     * @return 菜单树
     */
    private List<MenuTree> buildMenuTree(List<SysMenu> menuList) {
        // 将菜单列表转换为Map，以parentId为键，方便查找子菜单
        Map<String, List<SysMenu>> menuMap = menuList.stream()
                .collect(Collectors.groupingBy(menu -> menu.getParentId() == null ? "0" : menu.getParentId()));
        
        // 从根节点开始构建菜单树（假设根节点的parentId为"0"）
        return buildMenuTreeRecursive(menuMap, "0");
    }
    
    /**
     * 递归构建菜单树
     * @param menuMap 菜单映射
     * @param parentId 父级ID
     * @return 菜单树
     */
    private List<MenuTree> buildMenuTreeRecursive(Map<String, List<SysMenu>> menuMap, String parentId) {
        List<MenuTree> menuTreeList = new ArrayList<>();
        
        // 获取指定parentId的菜单列表
        List<SysMenu> children = menuMap.get(parentId);
        if (children != null) {
            for (SysMenu menu : children) {
                MenuTree menuTree = new MenuTree();
                menuTree.setKey(menu.getPath());
                menuTree.setLabel(menu.getTitle());
                menuTree.setIcon(menu.getIcon());
                
                // 递归构建子菜单树
                List<MenuTree> childMenuTree = buildMenuTreeRecursive(menuMap, String.valueOf(menu.getId()));
                if (!childMenuTree.isEmpty()) {
                    menuTree.setChildren(childMenuTree); // 设置子菜单
                }
                
                menuTreeList.add(menuTree);
            }
        }
        
        return menuTreeList;
    }
}