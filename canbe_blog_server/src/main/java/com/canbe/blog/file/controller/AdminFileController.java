package com.canbe.blog.file.controller;

import com.canbe.blog.common.PageResult;
import com.canbe.blog.common.Result;
import com.canbe.blog.file.dto.FileQueryDTO;
import com.canbe.blog.file.service.FileService;
import com.canbe.blog.file.vo.FileVO;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@Validated
@RestController
@RequestMapping("/api/v1/files")
public class AdminFileController {

    private final FileService fileService;

    public AdminFileController(FileService fileService) {
        this.fileService = fileService;
    }

    @PostMapping("/upload")
    public Result<FileVO> upload(@RequestPart("file") MultipartFile file) {
        return Result.success(fileService.upload(file));
    }

    @GetMapping
    public Result<PageResult<FileVO>> list(FileQueryDTO queryDTO) {
        return Result.success(fileService.list(queryDTO));
    }

    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        fileService.delete(id);
        return Result.success(null);
    }
}
