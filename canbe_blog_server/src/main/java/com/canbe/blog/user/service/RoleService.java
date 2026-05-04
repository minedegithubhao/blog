package com.canbe.blog.user.service;

import com.canbe.blog.common.PageResult;
import com.canbe.blog.user.dto.RoleCreateDTO;
import com.canbe.blog.user.dto.RoleQueryDTO;
import com.canbe.blog.user.dto.RoleUpdateDTO;
import com.canbe.blog.user.vo.RoleVO;

public interface RoleService {

    PageResult<RoleVO> list(RoleQueryDTO queryDTO);

    Long create(RoleCreateDTO createDTO);

    void update(Long id, RoleUpdateDTO updateDTO);

    void delete(Long id);
}
