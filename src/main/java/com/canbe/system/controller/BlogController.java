package com.canbe.system.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.canbe.system.entity.BlogArticle;
import com.canbe.system.service.IBlogArticleService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
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

    /**
     * restful,如何传递分页信息，/1/20这种吗？ 还是？current=1&size=20这种
     * @param pageNo
     * @param pageSize
     * @param req
     * @return
     */
    @GetMapping("/list")
    public String list(@RequestParam(name = "pageNo", defaultValue = "1") Integer pageNo, @RequestParam(name = "pageSize", defaultValue = "10") Integer pageSize,
                             HttpServletRequest req){
        QueryWrapper<BlogArticle> queryWrapper = new QueryWrapper<>();
        Page<BlogArticle> page = new Page<>(pageNo, pageSize);
        Page<BlogArticle> articlePage = iBlogArticleService.page(page, queryWrapper);
        return "OK";
    }

    /**
     * 详情页
     * @param id 博客ID
     * @return modelAndView
     */
    @ApiImplicitParam(name = "id",value = "id",required = true)
    @ApiOperation(value = "博客详情页")
    @GetMapping(value = "/detail/{id}")
    public ModelAndView detail(@PathVariable("id") String id, ModelAndView modelAndView){
        BlogArticle blogArticle = iBlogArticleService.getById(id);
        modelAndView.setViewName("news-detail");
        modelAndView.addObject(blogArticle);
        return modelAndView;
    }

    @GetMapping("/news-grid-2")
    public String grid2(){
        return "news-grid-2";
    }

    @GetMapping("/news-grid-3")
    public String grid3(){
        return "news-grid-3";
    }

    @GetMapping("/news-detail")
    public String newsDetail(){
        return "news-detail";
    }

    @GetMapping("/news-list")
    public String newsList(){
        return "news-list";
    }
}
