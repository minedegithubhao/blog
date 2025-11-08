package com.canbe.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.canbe.pojo.Result;
import com.canbe.pojo.SysDictData;
import com.canbe.service.SysDictDataService;
import jakarta.annotation.Resource;
import org.apache.commons.lang3.StringUtils;
import org.springframework.web.bind.annotation.*;

/**
 * <p>
 * 字典数据表 前端控制器
 * </p>
 *
 * @author canbe
 * @since 2025-11-09
 */
@RestController
@RequestMapping("/sys/sysDictData")
public class SysDictDataController {

    @Resource
    private SysDictDataService sysDictDataService;

    @GetMapping("/page")
    public Result<Page<SysDictData>> getDictDataList(@RequestParam(defaultValue = "1") Integer pageNum,
                                                     @RequestParam(defaultValue = "10") Integer pageSize,
                                                     SysDictData sysDictData) {
        // 分页查询
        Page<SysDictData> page = new Page<>(pageNum, pageSize);
        LambdaQueryWrapper<SysDictData> queryWrapper = new LambdaQueryWrapper<>();
        if (sysDictData.getDictId() != null){
            queryWrapper.eq(SysDictData::getDictId, sysDictData.getDictId());
        }
        if (StringUtils.isNotEmpty(sysDictData.getLabel())) {
            queryWrapper.like(SysDictData::getLabel, sysDictData.getLabel());
        }
        Page<SysDictData> result = sysDictDataService.page(page, queryWrapper);
        return Result.success(result);
    }

    @DeleteMapping("/delete/{id}")
    public Result<String> delete(@PathVariable Integer id) {
        boolean result = sysDictDataService.removeById(id);
        return result ? Result.success("删除成功") : Result.error("删除失败");
    }

    @PostMapping("/saveOrUpdate")
    public Result<String> save(@RequestBody SysDictData sysDictData) {
        boolean result = sysDictDataService.saveOrUpdate(sysDictData);
        return result ? Result.success("保存成功") : Result.error("保存失败");
    }
}