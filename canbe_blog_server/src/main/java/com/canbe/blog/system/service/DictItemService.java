package com.canbe.blog.system.service;

import com.canbe.blog.common.PageResult;
import com.canbe.blog.system.dto.DictItemCreateDTO;
import com.canbe.blog.system.dto.DictItemQueryDTO;
import com.canbe.blog.system.dto.DictItemUpdateDTO;
import com.canbe.blog.system.vo.DictItemVO;

public interface DictItemService {

    PageResult<DictItemVO> list(DictItemQueryDTO queryDTO);

    Long create(DictItemCreateDTO createDTO);

    void update(Long id, DictItemUpdateDTO updateDTO);

    void delete(Long id);
}
