package com.canbe.blog.file.service;

import com.canbe.blog.common.PageResult;
import com.canbe.blog.file.dto.FileQueryDTO;
import com.canbe.blog.file.vo.FileVO;
import org.springframework.web.multipart.MultipartFile;

public interface FileService {

    FileVO upload(MultipartFile file);

    PageResult<FileVO> list(FileQueryDTO queryDTO);

    void delete(Long id);
}
