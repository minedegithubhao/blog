package com.canbe.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.canbe.pojo.Result;
import com.canbe.pojo.SysArticle;
import com.canbe.pojo.SysArticleDto;
import com.canbe.service.SysArticleService;
import com.canbe.service.SysCategoryService;
import com.canbe.utils.ThreadLocalUtil;
import jakarta.annotation.Resource;
import org.apache.commons.beanutils.BeanUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.lang.reflect.InvocationTargetException;
import java.util.Map;

/**
 * <p>
 * 博客文章表 前端控制器
 * </p>
 *
 * @author canbe
 * @since 2025-10-28
 */
@RestController
@RequestMapping("/sys/sysArticle")
public class SysArticleController {

    @Resource
    private SysArticleService sysArticleService;

    @Resource
    private SysCategoryService sysCategoryService;

    @GetMapping("/page")
    public Result<IPage<SysArticleDto>> page(@RequestParam(defaultValue = "1") Integer pageNum,
                                          @RequestParam(defaultValue = "10") Integer pageSize,
                                          SysArticle sysArticle) {
        // 分页查询
        Page<SysArticle> page = new Page<>(pageNum , pageSize);
        LambdaQueryWrapper<SysArticle> queryWrapper = new LambdaQueryWrapper<>();
        if (StringUtils.isNotEmpty(sysArticle.getTitle())) {
            queryWrapper.like(SysArticle::getTitle, sysArticle.getTitle());
        }
        if (sysArticle.getCategoryId() != null){
            queryWrapper.eq(SysArticle::getCategoryId, sysArticle.getCategoryId());
        }
        // 将分类转化为<key, value>形式
        Map<Integer, String> collect = sysCategoryService.categoryMap();

        IPage<SysArticle> sysArticlePage = sysArticleService.page(page,queryWrapper);

        // 将sysArticlePage转换为SysArticleDto分页对象
        IPage<SysArticleDto> sysArticleDtoPage = sysArticlePage.convert(article -> {
            SysArticleDto dto = new SysArticleDto();
            // 拷贝所有属性
            try {
                BeanUtils.copyProperties(dto, article);
            } catch (IllegalAccessException|InvocationTargetException e) {
                throw new RuntimeException(e);
            }
            // 设置分类名称
            dto.setCategoryName(collect.getOrDefault(article.getCategoryId(), "未知"));
            return dto;
        });

        return Result.success(sysArticleDtoPage);
    }

    @PostMapping("/saveOrUpdate")
    public Result<String> save(@Validated @RequestBody SysArticle sysArticle) {
        Map<String, Object> claims = ThreadLocalUtil.get();
        Integer id = (Integer) claims.get("id");
        sysArticle.setUserId(id);
        return sysArticleService.saveOrUpdate(sysArticle) ? Result.success() : Result.error("保存文章失败");
    }

    @DeleteMapping("/delete/{id}")
    public Result<String> delete(@PathVariable Integer id) {
        return sysArticleService.removeById(id) ? Result.success() : Result.error("删除文章失败");
    }

    @GetMapping("/get/{id}")
    public Result<SysArticle> get(@PathVariable Integer id) {
        return Result.success(sysArticleService.getById(id));
    }
}
