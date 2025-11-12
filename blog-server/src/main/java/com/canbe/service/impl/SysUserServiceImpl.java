package com.canbe.service.impl;

import com.canbe.pojo.SysCategory;
import com.canbe.pojo.SysUser;
import com.canbe.mapper.SysUserMapper;
import com.canbe.service.SysUserService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.stream.Collectors;

/**
 * <p>
 * 用户信息表 服务实现类
 * </p>
 *
 * @author canbe
 * @since 2025-10-28
 */
@Service
public class SysUserServiceImpl extends ServiceImpl<SysUserMapper, SysUser> implements SysUserService {

    @Resource
    private SysUserMapper sysUserMapper;

    @Override
    public Map<Integer, String> userMap() {
        return sysUserMapper.selectList(null).stream().collect(Collectors.toMap(SysUser::getId, SysUser::getNickname));
    }
}
