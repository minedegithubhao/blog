package com.canbe.blog.user.service;

import com.canbe.blog.common.PageResult;
import com.canbe.blog.user.dto.AdminAccountCreateDTO;
import com.canbe.blog.user.dto.AdminAccountQueryDTO;
import com.canbe.blog.user.dto.AdminAccountUpdateDTO;
import com.canbe.blog.user.vo.AdminAccountVO;

public interface AdminAccountService {

    PageResult<AdminAccountVO> list(AdminAccountQueryDTO queryDTO);

    Long create(AdminAccountCreateDTO createDTO);

    void update(Long id, AdminAccountUpdateDTO updateDTO);

    void delete(Long id);
}
