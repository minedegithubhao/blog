package com.canbe.system.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiOperation;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

/**
 * @author cxd
 * @description: 博客模块
 * @create: 2022-07-17 19:36
 */
@Api(tags = "博客模块")
@Controller
@RequestMapping("/blog")
public class BlogController {

    /**
     * 详情页
     * @param id 博客ID
     * @return modelAndView
     */
    @ApiImplicitParam(name = "id",value = "id",required = true)
    @ApiOperation(value = "博客详情页")
    @GetMapping(value = "/detail/{id}")
    public String detail(@PathVariable("id") String id){
        System.out.println(id);
        return "news-detail";
    }
}
