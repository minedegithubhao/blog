package com.canbe.service.impl;

import com.canbe.pojo.SysCategory;
import com.canbe.mapper.SysCategoryMapper;
import com.canbe.service.SysCategoryService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.stream.Collectors;

/**
 * <p>
 * 分类表 服务实现类
 * </p>
 *
 * @author canbe
 * @since 2025-10-30
 */
@Service
public class SysCategoryServiceImpl extends ServiceImpl<SysCategoryMapper, SysCategory> implements SysCategoryService {

    @Override
    public Map<Integer, String> categoryMap() {
        return baseMapper.selectList(null).stream().collect(Collectors.toMap(SysCategory::getId, SysCategory::getName));
    }
}
