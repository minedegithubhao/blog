package com.canbe.service;

import com.canbe.pojo.SysCategory;
import com.baomidou.mybatisplus.extension.service.IService;

import java.util.Map;

/**
 * <p>
 * 分类表 服务类
 * </p>
 *
 * @author canbe
 * @since 2025-10-30
 */
public interface SysCategoryService extends IService<SysCategory> {

    Map<Integer, String> categoryMap();

}
