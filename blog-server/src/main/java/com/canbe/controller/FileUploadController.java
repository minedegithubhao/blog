package com.canbe.controller;

import com.canbe.pojo.Result;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;

/**
 * File Upload Controller - 文件上传控制器
 * 处理文件上传相关操作的控制器
 * 
 * Controller for File Upload Operations - Handles file upload related operations
 */
@RestController
public class FileUploadController {

    /**
     * Upload file - 上传文件
     * 处理文件上传请求，支持图片等文件的上传功能
     * 
     * Process file upload request, support upload function for images and other files
     *
     * @param file MultipartFile object - MultipartFile对象
     * @return Result<String> Response result with file URL - 包含文件URL的响应结果
     * @throws IOException IO exception - IO异常
     */
    @PostMapping("/upload")
    public Result<String> upload(MultipartFile file) throws IOException {
        // 1.save picture at local
        String originalFilename = file.getOriginalFilename();
//        file.transferTo(new File("C:\\IdeaProjects\\canbe-blog\\src\\main\\resources\\files\\" + originalFilename));
        // 2.use unique name to save picture
//        String filename = UUID.randomUUID() + originalFilename.substring(originalFilename.lastIndexOf("."));
//        file.transferTo(new File("C:\\IdeaProjects\\canbe-blog\\src\\main\\resources\\files\\" + filename));
//        return Result.success("http://localhost:8080/files/" + filename);

        // 3.save picture at aliyun
        String filename = UUID.randomUUID().toString()+originalFilename.substring(originalFilename.lastIndexOf("."));
        //file.transferTo(new File("C:\\Users\\Administrator\\Desktop\\files\\"+filename));
//        String url = AliOssUtil.uploadFile(filename,file.getInputStream());

        return Result.success("http://pic1.zhimg.com/v2-8b657dff159debf1cff463d61b7dcafd_r.jpg");
    }
}