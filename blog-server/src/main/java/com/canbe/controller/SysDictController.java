package com.canbe.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.canbe.pojo.Result;
import com.canbe.pojo.SysDict;
import com.canbe.service.SysDictService;
import jakarta.annotation.Resource;
import org.apache.commons.lang3.StringUtils;
import org.springframework.web.bind.annotation.*;

/**
 * <p>
 * 字典表 前端控制器
 * </p>
 *
 * @author canbe
 * @since 2025-11-09
 */
@RestController
@RequestMapping("/sys/sysDict")
public class SysDictController {

    @Resource
    private SysDictService sysDictService;

    @GetMapping("/page")
    public Result<Page<SysDict>> getDictList(@RequestParam(defaultValue = "1") Integer pageNum,
                                              @RequestParam(defaultValue = "10") Integer pageSize,
                                              SysDict sysDict) {
        Page<SysDict> page = new Page<>(pageNum, pageSize);
        LambdaQueryWrapper<SysDict> queryWrapper = new LambdaQueryWrapper<>();
        if (StringUtils.isNotBlank(sysDict.getName())){
            queryWrapper.like(SysDict::getName, sysDict.getName());
        }
        if (StringUtils.isNotBlank(sysDict.getType())){
            queryWrapper.eq(SysDict::getType, sysDict.getType());
        }
        Page<SysDict> result = sysDictService.page(page, queryWrapper);
        return Result.success(result);
    }

    @DeleteMapping("/delete/{id}")
    public Result<String> delete(@PathVariable Integer id) {
        return sysDictService.removeById(id) ? Result.success():Result.error("删除字典失败");
    }

    @PostMapping("/saveOrUpdate")
    public Result<String> save(@RequestBody SysDict sysDict) {
        boolean b = sysDictService.saveOrUpdate(sysDict);
        return sysDictService.saveOrUpdate(sysDict) ? Result.success():Result.error("保存字典失败");
    }

}
