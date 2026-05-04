package com.canbe.blog.content.service;

import com.canbe.blog.common.PageResult;
import com.canbe.blog.content.dto.CategoryCreateDTO;
import com.canbe.blog.content.dto.CategoryQueryDTO;
import com.canbe.blog.content.dto.CategoryUpdateDTO;
import com.canbe.blog.content.vo.CategoryVO;

public interface CategoryService {

    PageResult<CategoryVO> list(CategoryQueryDTO queryDTO);

    Long create(CategoryCreateDTO createDTO);

    void update(Long id, CategoryUpdateDTO updateDTO);

    void delete(Long id);
}
