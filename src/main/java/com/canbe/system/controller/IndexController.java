package com.canbe.system.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.canbe.system.entity.BlogArticle;
import com.canbe.system.service.IBlogArticleService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;

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

    @GetMapping("/index")
    @ApiOperation(value = "首页")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "pageNo", value = "当前页", defaultValue = "1", required = true, dataType = "int"),
            @ApiImplicitParam(name = "pageSize", value = "每页记录数", defaultValue = "12", required = true, dataType = "int")
    })
    public ModelAndView index(@RequestParam(name = "pageNo", defaultValue = "1") Integer pageNo,
                              @RequestParam(name = "pageSize", defaultValue = "12") Integer pageSize,
                              HttpServletRequest req){
        ModelAndView modelAndView = new ModelAndView();
        Page<BlogArticle> page = new Page<>(pageNo, pageSize);
        Page<BlogArticle> articleList = iBlogArticleService.page(page);
        modelAndView.setViewName("news-grid-3");
        modelAndView.addObject("articles", articleList.getRecords());
        return modelAndView;
    }

    @ApiImplicitParam(name = "name",value = "姓名",required = true, dataType = "string", paramType = "query")
    @ApiOperation(value = "向客人问好")
    @GetMapping("/sayHi")
    @ResponseBody
    public ResponseEntity<String> sayHi(@RequestParam(value = "name")String name){
        return ResponseEntity.ok("Hi:"+name);
    }
}
