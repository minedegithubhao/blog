package com.canbe.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.canbe.pojo.Result;
import com.canbe.pojo.SysUser;
import com.canbe.service.SysUserService;
import jakarta.annotation.Resource;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

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
                                              @RequestParam(defaultValue = "10") Integer pageSize
    ) {
        Page<SysUser> page = new Page<>(pageNum, pageSize);
        IPage<SysUser> sysUserPage = sysUserService.page(page);
        return Result.success(sysUserPage);
    }
}
