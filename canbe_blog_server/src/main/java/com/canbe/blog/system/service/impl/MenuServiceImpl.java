package com.canbe.blog.system.service.impl;

import com.canbe.blog.common.BusinessException;
import com.canbe.blog.common.PageResult;
import com.canbe.blog.security.AuthenticatedUser;
import com.canbe.blog.system.convert.MenuConvert;
import com.canbe.blog.system.dto.MenuCreateDTO;
import com.canbe.blog.system.dto.MenuQueryDTO;
import com.canbe.blog.system.dto.MenuUpdateDTO;
import com.canbe.blog.system.entity.Menu;
import com.canbe.blog.system.mapper.MenuMapper;
import com.canbe.blog.system.service.MenuService;
import com.canbe.blog.system.vo.MenuTreeVO;
import com.canbe.blog.system.vo.MenuVO;
import com.canbe.blog.user.vo.CurrentUserNavigationVO;
import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class MenuServiceImpl implements MenuService {

    private static final String MENU_TYPE_CATALOG = "CATALOG";
    private static final String MENU_TYPE_MENU = "MENU";
    private static final String MENU_TYPE_BUTTON = "BUTTON";
    private static final String ADMIN_ROLE = "ADMIN";

    private final MenuMapper menuMapper;

    public MenuServiceImpl(MenuMapper menuMapper) {
        this.menuMapper = menuMapper;
    }

    @Override
    public PageResult<MenuVO> list(MenuQueryDTO queryDTO) {
        int page = normalizePage(queryDTO.getPage());
        int pageSize = normalizePageSize(queryDTO.getPageSize());
        queryDTO.setPage(page);
        queryDTO.setPageSize(pageSize);
        List<MenuVO> list = menuMapper.list(queryDTO).stream()
            .map(MenuConvert::toVO)
            .toList();
        return new PageResult<>(list, menuMapper.count(queryDTO), page, pageSize);
    }

    @Override
    public List<MenuTreeVO> listTree() {
        return buildTree(menuMapper.listAll(), true);
    }

    @Override
    public CurrentUserNavigationVO getCurrentUserNavigation(AuthenticatedUser user) {
        CurrentUserNavigationVO navigationVO = new CurrentUserNavigationVO();
        if (user == null || !ADMIN_ROLE.equals(user.getRoleCode())) {
            return navigationVO;
        }

        List<Menu> allMenus = menuMapper.listAll();
        List<Menu> activeMenus = allMenus.stream()
            .filter(menu -> Integer.valueOf(1).equals(menu.getStatus()))
            .toList();

        navigationVO.setMenus(
            buildTree(
                activeMenus.stream()
                    .filter(menu -> Integer.valueOf(1).equals(menu.getVisible()))
                    .filter(menu -> !MENU_TYPE_BUTTON.equals(menu.getType()))
                    .toList(),
                false
            )
        );
        navigationVO.setPermissions(
            activeMenus.stream()
                .map(Menu::getPermission)
                .filter(Objects::nonNull)
                .map(String::trim)
                .filter(permission -> !permission.isEmpty())
                .distinct()
                .toList()
        );
        return navigationVO;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Long create(MenuCreateDTO createDTO) {
        validateParent(createDTO.getParentId());
        validateByType(createDTO.getType(), createDTO.getPath(), createDTO.getComponent());
        return menuMapper.create(createDTO);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void update(Long id, MenuUpdateDTO updateDTO) {
        Menu menu = menuMapper.findById(id)
            .orElseThrow(() -> new BusinessException(7001, "菜单不存在"));
        if (id.equals(updateDTO.getParentId())) {
            throw new BusinessException(7002, "上级菜单不能是自己");
        }
        validateParent(updateDTO.getParentId());
        validateNotDescendant(id, updateDTO.getParentId());
        validateByType(updateDTO.getType(), updateDTO.getPath(), updateDTO.getComponent());
        if (menuMapper.update(menu.getId(), updateDTO) == 0) {
            throw new BusinessException(7001, "菜单不存在");
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void delete(Long id) {
        menuMapper.findById(id).orElseThrow(() -> new BusinessException(7001, "菜单不存在"));
        if (menuMapper.existsByParentId(id)) {
            throw new BusinessException(7003, "存在子菜单，不能删除");
        }
        menuMapper.delete(id);
    }

    private void validateParent(Long parentId) {
        if (parentId == null || parentId == 0) {
            return;
        }
        Menu parent = menuMapper.findById(parentId).orElseThrow(() -> new BusinessException(7004, "上级菜单不存在"));
        if (MENU_TYPE_BUTTON.equals(parent.getType())) {
            throw new BusinessException(7005, "按钮类型不能作为上级菜单");
        }
    }

    private void validateNotDescendant(Long id, Long parentId) {
        if (parentId == null || parentId == 0) {
            return;
        }
        Map<Long, List<Long>> childrenMap = new LinkedHashMap<>();
        for (Menu menu : menuMapper.listAll()) {
            childrenMap.computeIfAbsent(menu.getParentId(), ignored -> new ArrayList<>()).add(menu.getId());
        }
        ArrayDeque<Long> queue = new ArrayDeque<>(childrenMap.getOrDefault(id, Collections.emptyList()));
        while (!queue.isEmpty()) {
            Long currentId = queue.removeFirst();
            if (currentId.equals(parentId)) {
                throw new BusinessException(7006, "上级菜单不能选择自己的子孙节点");
            }
            queue.addAll(childrenMap.getOrDefault(currentId, Collections.emptyList()));
        }
    }

    private void validateByType(String type, String path, String component) {
        String normalizedType = type == null ? "" : type.trim();
        String normalizedPath = path == null ? "" : path.trim();
        String normalizedComponent = component == null ? "" : component.trim();

        switch (normalizedType) {
            case MENU_TYPE_CATALOG -> {
                if (normalizedPath.isEmpty()) {
                    throw new BusinessException(7007, "目录类型必须填写路由地址");
                }
            }
            case MENU_TYPE_MENU -> {
                if (normalizedPath.isEmpty()) {
                    throw new BusinessException(7008, "菜单类型必须填写路由地址");
                }
                if (normalizedComponent.isEmpty()) {
                    throw new BusinessException(7009, "菜单类型必须填写组件路径");
                }
            }
            case MENU_TYPE_BUTTON -> {
                if (!normalizedComponent.isEmpty()) {
                    throw new BusinessException(7010, "按钮类型不能填写组件路径");
                }
            }
            default -> throw new BusinessException(7011, "菜单类型不正确");
        }
    }

    private List<MenuTreeVO> buildTree(List<Menu> menus, boolean includeButtons) {
        Map<Long, MenuTreeVO> menuMap = menus.stream()
            .map(MenuConvert::toTreeVO)
            .collect(Collectors.toMap(MenuTreeVO::getId, item -> item, (left, right) -> left, LinkedHashMap::new));

        List<MenuTreeVO> roots = new ArrayList<>();
        for (MenuTreeVO menu : menuMap.values()) {
            if (!includeButtons && MENU_TYPE_BUTTON.equals(menu.getType())) {
                continue;
            }
            if (menu.getParentId() == null || menu.getParentId() == 0 || !menuMap.containsKey(menu.getParentId())) {
                roots.add(menu);
                continue;
            }
            MenuTreeVO parent = menuMap.get(menu.getParentId());
            if (!includeButtons && parent != null && MENU_TYPE_BUTTON.equals(parent.getType())) {
                roots.add(menu);
                continue;
            }
            parent.getChildren().add(menu);
        }

        sortTree(roots);
        return roots;
    }

    private void sortTree(List<MenuTreeVO> menus) {
        menus.sort((left, right) -> {
            int sortCompare = Integer.compare(left.getSortOrder(), right.getSortOrder());
            if (sortCompare != 0) {
                return sortCompare;
            }
            return Long.compare(left.getId(), right.getId());
        });
        for (MenuTreeVO menu : menus) {
            sortTree(menu.getChildren());
        }
    }

    private int normalizePage(Integer page) {
        return page == null || page < 1 ? 1 : page;
    }

    private int normalizePageSize(Integer pageSize) {
        if (pageSize == null || pageSize < 1) {
            return 20;
        }
        return Math.min(pageSize, 100);
    }
}
