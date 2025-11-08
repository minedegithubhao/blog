package com.canbe.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.canbe.pojo.Result;
import com.canbe.pojo.SysTag;
import com.canbe.service.SysTagService;
import jakarta.annotation.Resource;
import org.apache.commons.lang3.StringUtils;
import org.springframework.web.bind.annotation.*;

/**
 * <p>
 * 标签表 前端控制器
 * </p>
 *
 * @author canbe
 * @since 2025-11-08
 */
@RestController
@RequestMapping("/sys/sysTag")
public class SysTagController {

    @Resource
    private SysTagService sysTagService;

    @RequestMapping("/list")
    public Result<Page<SysTag>> list(@RequestParam(defaultValue = "1") Integer pageNum, @RequestParam(defaultValue = "10") Integer pageSize, SysTag sysTag) {
        // 构建分页参数
        Page<SysTag> page = new Page<>(pageNum, pageSize);
        // 构建查询参数
        LambdaQueryWrapper<SysTag> queryWrapper = new LambdaQueryWrapper<>();
        if (StringUtils.isNotEmpty(sysTag.getName())) {
            queryWrapper.like(SysTag::getName, sysTag.getName());
        }
        // 查询
        Page<SysTag> result = sysTagService.page(page, queryWrapper);
        return Result.success(result);
    }

    @DeleteMapping("/delete/{id}")
    public Result<String> delete(@PathVariable Integer id) {
        return sysTagService.removeById(id) ? Result.success() : Result.error("删除标签失败");
    }

    @PostMapping("/saveOrUpdate")
    public Result<String> save(@RequestBody SysTag sysTag) {
        return sysTagService.saveOrUpdate(sysTag) ? Result.success() : Result.error("保存标签失败");
    }

}
