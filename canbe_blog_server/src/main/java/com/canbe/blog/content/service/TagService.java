package com.canbe.blog.content.service;

import com.canbe.blog.common.PageResult;
import com.canbe.blog.content.dto.TagCreateDTO;
import com.canbe.blog.content.dto.TagQueryDTO;
import com.canbe.blog.content.dto.TagUpdateDTO;
import com.canbe.blog.content.vo.TagVO;

public interface TagService {

    PageResult<TagVO> list(TagQueryDTO queryDTO);

    Long create(TagCreateDTO createDTO);

    void update(Long id, TagUpdateDTO updateDTO);

    void delete(Long id);
}
