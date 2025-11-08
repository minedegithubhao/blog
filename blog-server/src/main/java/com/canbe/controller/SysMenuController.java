package com.canbe.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.canbe.pojo.MenuTree;
import com.canbe.pojo.Result;
import com.canbe.pojo.SysMenu;
import com.canbe.service.SysMenuService;
import jakarta.annotation.Resource;
import org.apache.commons.lang3.StringUtils;
import org.springframework.web.bind.annotation.*;

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

    @RequestMapping("/getMenuTree")
    public Result getMenuList() {
        // 查询所有类型为MENU的菜单
        List<SysMenu> menuList = sysMenuService.list(new QueryWrapper<SysMenu>().eq("type", "MENU"));

        // 构建菜单树
        List<MenuTree> menuTreeList = buildMenuTree(menuList);

        return Result.success(menuTreeList);
    }

    /**
     * 构建菜单树结构
     *
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
     *
     * @param menuMap  菜单映射
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

    @GetMapping("/page")
    public Result<Page<SysMenu>> page(@RequestParam(defaultValue = "1") Integer pageNum,
                                      @RequestParam(defaultValue = "10") Integer pageSize,
                                      SysMenu sysMenu) {
        // 分页查询
        Page<SysMenu> page = new Page<>(pageNum, pageSize);
        LambdaQueryWrapper<SysMenu> queryWrapper = new LambdaQueryWrapper<>();
        if (StringUtils.isNotEmpty(sysMenu.getTitle())) {
            queryWrapper.like(SysMenu::getTitle, sysMenu.getTitle());
        }
        Page<SysMenu> result = sysMenuService.page(page, queryWrapper);
        return Result.success(result);
    }

    @DeleteMapping("/delete/{id}")
    public Result<String> delete(@PathVariable Integer id) {
        return sysMenuService.removeById(id) ? Result.success() : Result.error("删除文章失败");
    }

    @PostMapping("/saveOrUpdate")
    public Result<String> save(@RequestBody SysMenu sysMenu) {
        return sysMenuService.saveOrUpdate(sysMenu) ? Result.success() : Result.error("保存文章失败");
    }
}