package com.canbe.system.controller;

import com.canbe.system.entity.BlogArticle;
import com.canbe.system.service.IBlogArticleService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import java.time.LocalDate;
import java.util.List;

/**
 * @author cxd
 * @description: Swagger2 HelloWorld
 * @create: 2022-07-15 07:58
 */
@Api(tags = "首页模块")
@Controller
public class IndexController {

    @Autowired
    IBlogArticleService iBlogArticleService;

    @ApiImplicitParam(name = "name",value = "姓名",required = true)
    @ApiOperation(value = "向客人问好")
    @GetMapping("/sayHi")
    @ResponseBody
    public ResponseEntity<String> sayHi(@RequestParam(value = "name")String name){
        return ResponseEntity.ok("Hi:"+name);
    }

    /**
     * 列表
     * @return 列表
     */
    @ApiOperation(value = "首页")
    @GetMapping("/index")
    public ModelAndView index(ModelAndView modelAndView){
        List<BlogArticle> list = iBlogArticleService.list();
        modelAndView.setViewName("news-grid-3");
        modelAndView.addObject("articles", list);
        return modelAndView;
    }
}
