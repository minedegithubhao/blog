package com.canbe.controller;

import com.canbe.pojo.Category;
import com.canbe.pojo.Result;
import com.canbe.service.CategoryService;
import com.canbe.utils.ThreadLocalUtil;
import jakarta.annotation.Resource;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * Category Controller - 分类控制器
 * 处理文章分类相关的CRUD操作
 * <p>
 * Controller for Category Operations - Handles CRUD operations related to article categories
 */
@RestController
@RequestMapping("/category")
public class CategoryController {

    @Resource
    private CategoryService categoryService;

    /**
     * Add category - 添加分类
     * 处理添加新分类的请求，验证分类信息并保存到数据库
     * <p>
     * Process request to add new category, validate category information and save to database
     *
     * @param category Category object with validation - 带验证的分类对象
     * @return Result Response result - 响应结果
     */
    @PostMapping()
    public Result<String> add(@RequestBody @Validated(Category.Add.class) Category category) {
        categoryService.save(category);
        return Result.success();
    }

    /**
     * Get category list - 获取分类列表
     * 获取所有分类信息的列表
     * <p>
     * Get list of all category information
     *
     * @return Result<List < Category>> Category list - 分类列表结果
     */
    @GetMapping
    public Result<List<Category>> list() {
        List<Category> list = categoryService.list(null);
        return Result.success(list);
    }

    /**
     * Get category detail - 获取分类详情
     * 根据分类ID获取分类的详细信息
     * <p>
     * Get detailed category information by category ID
     *
     * @param id Category ID - 分类ID
     * @return Result<Category> Category detail - 分类详情结果
     */
    @GetMapping("/detail")
    public Result<Category> detail(Integer id) {
        Category category = categoryService.getById(id);
        return Result.success(category);
    }

    /**
     * Update category - 更新分类
     * 处理更新分类信息的请求，验证分类信息并更新到数据库
     * <p>
     * Process request to update category information, validate category information and update to database
     *
     * @param category Category object with validation - 带验证的分类对象
     * @return Result Response result - 响应结果
     */
    @PutMapping
    public Result<String> update(@RequestBody @Validated(Category.Update.class) Category category) {
        categoryService.updateById(category);
        return Result.success();
    }

    /**
     * Delete category - 删除分类
     * 根据分类ID删除指定分类
     * <p>
     * Delete specified category by category ID
     *
     * @param id Category ID - 分类ID
     * @return Result Response result - 响应结果
     */
    @DeleteMapping
    public Result<String> delete(@RequestParam(name = "id") Integer id) {
        categoryService.removeById(id);
        return Result.success();
    }
}