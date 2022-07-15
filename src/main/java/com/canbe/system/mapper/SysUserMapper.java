package com.canbe.system.mapper;

import com.canbe.system.entity.SysUser;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

/**
 * <p>
 * 用户表 Mapper 接口
 * </p>
 *
 * @author cxd
 * @since 2022-07-14
 */
@Mapper
public interface SysUserMapper extends BaseMapper<SysUser> {

    List<SysUser> findAll();
}
