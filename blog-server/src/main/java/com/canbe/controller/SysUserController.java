package com.canbe.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.canbe.pojo.Result;
import com.canbe.pojo.SysUser;
import com.canbe.service.SysUserService;
import jakarta.annotation.Resource;
import org.apache.commons.lang3.StringUtils;
import org.springframework.web.bind.annotation.*;

/**
 * <p>
 * 用户信息表 前端控制器
 * </p>
 *
 * @author canbe
 * @since 2025-10-28
 */
@RestController
@RequestMapping("/sys/sysUser")
public class SysUserController {

    @Resource
    private SysUserService sysUserService;

    @GetMapping("/page")
    public Result<IPage<SysUser>> getUserList(@RequestParam(defaultValue = "1") Integer pageNum,
                                              @RequestParam(defaultValue = "10") Integer pageSize,
                                              SysUser sysUser
    ) {
        Page<SysUser> page = new Page<>(pageNum, pageSize);
        LambdaQueryWrapper<SysUser> queryWrapper = new LambdaQueryWrapper<>();
        if (StringUtils.isNotEmpty(sysUser.getUsername())) {
            queryWrapper.like(SysUser::getUsername, sysUser.getUsername());
        }
        if (sysUser.getStatus() != null) {
            queryWrapper.eq(SysUser::getStatus, sysUser.getStatus());
        }
        IPage<SysUser> sysUserPage = sysUserService.page(page, queryWrapper);
        return Result.success(sysUserPage);
    }

    @DeleteMapping("/delete/{id}")
    public Result<String> delete(@PathVariable Integer id) {
        return sysUserService.removeById(id) ? Result.success() : Result.error("删除文章失败");
    }

    @PostMapping("/saveOrUpdate")
    public Result<String> save(@RequestBody SysUser sysUser) {
        return sysUserService.saveOrUpdate(sysUser) ? Result.success() : Result.error("保存用户失败");
    }
}
