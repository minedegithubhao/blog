package com.canbe.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.canbe.pojo.*;
import com.canbe.service.*;
import com.canbe.utils.JwtUtil;
import com.canbe.utils.Md5Util;
import com.google.code.kaptcha.Producer;
import jakarta.annotation.Resource;
import jakarta.servlet.ServletOutputStream;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.constraints.Pattern;
import org.apache.commons.beanutils.BeanUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

/**
 * Public API Controller - 公共API控制器
 * 提供公开访问的API接口，无需用户登录即可访问博客文章、分类等信息
 * <p>
 * Provides public access API interfaces that can be accessed without user login
 * to retrieve blog articles, categories and other information
 */
@RestController
@RequestMapping("/public")
public class PublicApiController {
    @Resource
    private SysArticleService sysArticleService;

    @Resource
    private SysUserService sysUserService;

    @Resource
    private StringRedisTemplate stringRedisTemplate;

    @Resource
    private Producer kaptchaProducer;

    @Resource
    private CaptchaService captchaService;

    @Resource
    private SysCategoryService sysCategoryService;

    // 定义文件存储目录
    private static final String FILE_DIRECTORY = System.getProperty("user.dir") + "/blog-server/upload/";

    /**
     * Register - 注册
     * 处理用户注册请求，验证用户名是否已存在，如果不存在则注册新用户
     * <p>
     * Process user registration request, verify whether the username already exists,
     * and register a new user if it does not exist
     *
     * @param username Username - 用户名
     * @param password Password - 密码
     * @return Result Response result - 响应结果
     */
    @PostMapping("/register")
    public Result<String> register(@Pattern(regexp = "^\\S{5,16}$") String username,
                                   @Pattern(regexp = "^\\S{5,16}$") String password) {

        SysUser sysUser = sysUserService.getOne(new QueryWrapper<SysUser>().eq("username", username));
        if (sysUser == null) {
            // 不存在则注册
            sysUser = new SysUser();
            // 加密密码 - Encrypt password
            String md5String = Md5Util.getMD5String(password);
            sysUser.setUsername(username);
            sysUser.setPassword(md5String);
            sysUserService.save(sysUser);
            return Result.success();
        } else {
            // 存在则返回错误信息
            return Result.error("用户名已存在");
        }
    }

    /**
     * Login - 登录
     * 处理用户登录请求，验证用户名和密码，如果验证通过则生成并返回JWT token
     * <p>
     * Process user login request, verify username and password,
     * generate and return JWT token if verification passes
     *
     * @param username Username - 用户名
     * @param password Password - 密码
     * @return Result<String> Response result with token - 带token的响应结果
     */
    @PostMapping("/login")
    public Result<String> login(@Pattern(regexp = "^\\S{5,16}$") String username,
                                @Pattern(regexp = "^\\S{5,16}$") String password,
                                @RequestParam(required = false) String captcha,
                                HttpServletRequest request) {

        // 获取会话ID
        String sessionId = request.getSession().getId();

        // 验证验证码
        if (!captchaService.validateCaptcha(sessionId, captcha)) {
            return Result.error("验证码错误或已过期");
        }

        // 查询用户名是否已存在
        SysUser sysUser = sysUserService.getOne(new QueryWrapper<SysUser>().eq("username", username));
        // 用户不存在则返回错误信息
        if (sysUser == null) {
            return Result.error("用户名不存在");
        }
        // 密码错误则返回错误信息
        String md5String = Md5Util.getMD5String(password);
        if (!sysUser.getPassword().equals(md5String)) {
            return Result.error("密码错误");
        }

        // 登录成功则返回token
        Map<String, Object> claims = new HashMap<>();
        claims.put("id", sysUser.getId());
        claims.put("username", sysUser.getUsername());
        String token = JwtUtil.genToken(claims);
        stringRedisTemplate.opsForValue().set(token, token, JwtUtil.EXPIRE_TIME, TimeUnit.MILLISECONDS);
        return Result.success(token);
    }

    @GetMapping("/genImageCaptcha")
    public void genImageCaptcha(HttpServletResponse response, HttpServletRequest request) throws IOException {
        // 清除浏览器缓存
        response.setDateHeader("Expires", 0);
        response.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
        response.addHeader("Cache-Control", "post-check=0, pre-check=0");
        response.setHeader("Pragma", "no-cache");
        response.setContentType("image/jpeg");

        // 创建验证码文本
        String capText = kaptchaProducer.createText();

        // 获取会话ID
        String sessionId = request.getSession().getId();

        // 存储验证码
        captchaService.storeCaptcha(sessionId, capText);

        // 创建验证码图片
        BufferedImage image = kaptchaProducer.createImage(capText);
        ServletOutputStream out = response.getOutputStream();

        // 输出图片
        ImageIO.write(image, "jpg", out);
        out.flush();
        out.close();
    }

    /**
     * Upload file - 上传文件
     * 处理文件上传请求，支持图片等文件的上传功能
     * <p>
     * Process file upload request, support upload function for images and other files
     *
     * @param file MultipartFile object - MultipartFile对象
     * @return Result<String> Response result with file ID - 包含文件ID的响应结果
     * @throws IOException IO exception - IO异常
     */
    @PostMapping("/upload")
    public Result<String> upload(MultipartFile file) throws IOException {
        // 确保上传目录存在
        File uploadDir = new File(FILE_DIRECTORY);
        if (!uploadDir.exists()) {
            uploadDir.mkdirs();
        }

        // 获取原始文件名并生成唯一文件名
        String originalFilename = file.getOriginalFilename();
        String fileName = UUID.randomUUID() + originalFilename.substring(originalFilename.lastIndexOf("."));

        // 保存文件到本地
        file.transferTo(new File(FILE_DIRECTORY + fileName));

        // 返回文件ID
        return Result.success(fileName);
    }

    @GetMapping("/download/{fileName}")
    public ResponseEntity<org.springframework.core.io.Resource> downloadFile(@PathVariable String fileName) {
        System.out.println("fileName: " + fileName);
        Path filePath = Paths.get(FILE_DIRECTORY).resolve(fileName).normalize();
        try {
            org.springframework.core.io.Resource resource = new org.springframework.core.io.UrlResource(filePath.toUri());
            if (resource.exists() || resource.isReadable()) {
                return ResponseEntity.ok()
                        .contentType(MediaType.APPLICATION_OCTET_STREAM)
                        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception ex) {
            ex.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }

    @DeleteMapping("/delete/{fileName}")
    public Result<String> deleteFile(@PathVariable String fileName) {
        Path filePath = Paths.get(FILE_DIRECTORY).resolve(fileName).normalize();
        try {
            File file = filePath.toFile();
            if (file.exists()) {
                if (file.delete()) {
                    return Result.success("File deleted successfully.");
                } else {
                    return Result.error("Failed to delete file.");
                }
            } else {
                return Result.error("File not found.");
            }
        } catch (Exception ex) {
            ex.printStackTrace();
            return Result.error("An error occurred while deleting the file.");
        }
    }

    @GetMapping("/sysCategory/list")
    public Result<List<SysCategory>> list() {
        List<SysCategory> list = sysCategoryService.list();
        return Result.success(list);
    }

    @GetMapping("/sysArticle/page")
    public Result<IPage<SysArticleDto>> page(@RequestParam(defaultValue = "1") Integer pageNum,
                                             @RequestParam(defaultValue = "10") Integer pageSize,
                                             SysArticle sysArticle) {
        // 分页查询
        Page<SysArticle> page = new Page<>(pageNum, pageSize);
        LambdaQueryWrapper<SysArticle> queryWrapper = new LambdaQueryWrapper<>();
        if (StringUtils.isNotEmpty(sysArticle.getTitle())) {
            queryWrapper.like(SysArticle::getTitle, sysArticle.getTitle());
        }
        if (sysArticle.getCategoryId() != null) {
            queryWrapper.eq(SysArticle::getCategoryId, sysArticle.getCategoryId());
        }
        // 将分类转化为<key, value>形式
        Map<Integer, String> collect = sysCategoryService.categoryMap();

        IPage<SysArticle> sysArticlePage = sysArticleService.page(page, queryWrapper);

        // 将sysArticlePage转换为SysArticleDto分页对象
        IPage<SysArticleDto> sysArticleDtoPage = sysArticlePage.convert(article -> {
            SysArticleDto dto = new SysArticleDto();
            // 拷贝所有属性
            try {
                BeanUtils.copyProperties(dto, article);
            } catch (IllegalAccessException | InvocationTargetException e) {
                throw new RuntimeException(e);
            }
            // 设置分类名称
            dto.setCategoryName(collect.getOrDefault(article.getCategoryId(), "未知"));
            return dto;
        });

        return Result.success(sysArticleDtoPage);
    }

    @GetMapping("/sysArticle/get/{id}")
    public Result<SysArticle> get(@PathVariable Integer id) {
        return Result.success(sysArticleService.getById(id));
    }
}
