package com.canbe.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.canbe.mapper.CategoryMapper;
import com.canbe.pojo.Category;
import com.canbe.service.CategoryService;
import com.canbe.utils.ThreadLocalUtil;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * Category Service Implementation - 分类服务实现类
 * Implements business logic for category operations - 实现分类操作的业务逻辑
 * <p>
 * This class provides the implementation of CategoryService interface
 * 该类提供了CategoryService接口的实现
 */
@Service
public class CategoryServiceImpl extends ServiceImpl<CategoryMapper, Category> implements CategoryService {

}