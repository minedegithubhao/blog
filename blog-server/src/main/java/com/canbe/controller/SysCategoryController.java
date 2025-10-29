package com.canbe.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.conditions.query.LambdaQueryChainWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.canbe.pojo.Result;
import com.canbe.pojo.SysArticle;
import com.canbe.pojo.SysCategory;
import com.canbe.service.SysCategoryService;
import jakarta.annotation.Resource;
import org.apache.commons.lang3.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * <p>
 * 分类表 前端控制器
 * </p>
 *
 * @author canbe
 * @since 2025-10-30
 */
@RestController
@RequestMapping("/sysCategory")
public class SysCategoryController {

    @Resource
    private SysCategoryService sysCategoryService;

    @RequestMapping("/page")
    public Result<Page<SysCategory>> page(@RequestParam Integer pageNum, @RequestParam Integer pageSize, SysCategory sysCategory) {
        Page<SysCategory> page = new Page<>(pageNum, pageSize);
        LambdaQueryWrapper<SysCategory> queryWrapper = new LambdaQueryWrapper<>();
        if (StringUtils.isNotBlank(sysCategory.getName())) {
            queryWrapper.like(SysCategory::getName, sysCategory.getName());
        }
        Page<SysCategory> sysCategoryPage = sysCategoryService.page(page, queryWrapper);
        return Result.success(sysCategoryPage);
    }

    @GetMapping("/list")
    public Result<List<SysCategory>> list() {
        List<SysCategory> list = sysCategoryService.list();
        return Result.success(list);
    }

    @PostMapping("/saveOrUpdate")
    public Result<String> save(@RequestBody SysCategory sysCategory) {
        sysCategoryService.saveOrUpdate(sysCategory);
        return Result.success();
    }

    @DeleteMapping("/delete/{id}")
    public Result<String> delete(@PathVariable Integer id) {
        sysCategoryService.removeById(id);
        return Result.success();
    }
}
