package com.canbe.blog.system.service;

import com.canbe.blog.common.PageResult;
import com.canbe.blog.security.AuthenticatedUser;
import com.canbe.blog.system.dto.MenuCreateDTO;
import com.canbe.blog.system.dto.MenuQueryDTO;
import com.canbe.blog.system.dto.MenuUpdateDTO;
import com.canbe.blog.system.vo.MenuTreeVO;
import com.canbe.blog.system.vo.MenuVO;
import com.canbe.blog.user.vo.CurrentUserNavigationVO;
import java.util.List;

public interface MenuService {

    PageResult<MenuVO> list(MenuQueryDTO queryDTO);

    List<MenuTreeVO> listTree();

    CurrentUserNavigationVO getCurrentUserNavigation(AuthenticatedUser user);

    Long create(MenuCreateDTO createDTO);

    void update(Long id, MenuUpdateDTO updateDTO);

    void delete(Long id);
}
