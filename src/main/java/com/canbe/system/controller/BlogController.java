package com.canbe.system.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.canbe.system.entity.BlogArticle;
import com.canbe.system.service.IBlogArticleService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;

/**
 * @author cxd
 * @description: 博客模块
 * @create: 2022-07-17 19:36
 */
@Api(tags = "博客模块")
@Controller
@RequestMapping("/blog")
public class BlogController {

    @Autowired
    IBlogArticleService iBlogArticleService;

    @GetMapping("/list")
    @ApiOperation(value = "列表")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "pageNo", value = "当前页", defaultValue = "1", required = true, dataType = "int"),
            @ApiImplicitParam(name = "pageSize", value = "每页记录数", defaultValue = "12", required = true, dataType = "int")
    })
    public String list(@RequestParam(name = "pageNo", defaultValue = "1") Integer pageNo, @RequestParam(name = "pageSize", defaultValue = "12") Integer pageSize,
                             HttpServletRequest req){
        QueryWrapper<BlogArticle> queryWrapper = new QueryWrapper<>();
        Page<BlogArticle> page = new Page<>(pageNo, pageSize);
        Page<BlogArticle> articlePage = iBlogArticleService.page(page, queryWrapper);
        return "OK";
    }

    @ApiImplicitParam(name = "id",value = "id",required = true)
    @ApiOperation(value = "详情")
    @GetMapping(value = "/detail/{id}")
    public ModelAndView detail(@PathVariable("id") String id){
        ModelAndView modelAndView = new ModelAndView();
        BlogArticle blogArticle = iBlogArticleService.getById(id);
        modelAndView.setViewName("news-detail");
        modelAndView.addObject(blogArticle);
        return modelAndView;
    }
}
