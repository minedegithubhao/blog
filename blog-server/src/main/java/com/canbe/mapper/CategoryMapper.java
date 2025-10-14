package com.canbe.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.canbe.pojo.Category;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface CategoryMapper extends BaseMapper<Category> {

}