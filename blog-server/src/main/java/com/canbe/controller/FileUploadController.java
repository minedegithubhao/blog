package com.canbe.controller;

import com.canbe.pojo.Result;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

/**
 * File Upload Controller - 文件上传控制器
 * 处理文件上传相关操作的控制器
 * <p>
 * Controller for File Upload Operations - Handles file upload related operations
 */
@RequestMapping("/file")
@RestController
public class FileUploadController {

    // 定义文件存储目录
    private static final String FILE_DIRECTORY = System.getProperty("user.dir") + "/blog-server/upload/";

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
    public ResponseEntity<Resource> downloadFile(@PathVariable String fileName) {
        System.out.println("fileName: " + fileName);
        Path filePath = Paths.get(FILE_DIRECTORY).resolve(fileName).normalize();
        try {
            Resource resource = new org.springframework.core.io.UrlResource(filePath.toUri());
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
}