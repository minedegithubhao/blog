package com.canbe.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.canbe.pojo.User;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

@Mapper
public interface UserMapper extends BaseMapper<User> {

}