package com.canbe.blog.file.convert;

import com.canbe.blog.file.entity.FileRecord;
import com.canbe.blog.file.vo.FileVO;

public final class FileConvert {

    private FileConvert() {
    }

    public static FileVO toVO(FileRecord fileRecord) {
        FileVO vo = new FileVO();
        vo.setId(fileRecord.getId());
        vo.setFilename(fileRecord.getFilename());
        vo.setStoredName(fileRecord.getStoredName());
        vo.setRelativePath(fileRecord.getRelativePath());
        vo.setUrl(fileRecord.getUrl());
        vo.setSize(fileRecord.getSize());
        vo.setContentType(fileRecord.getContentType());
        vo.setGmtCreate(fileRecord.getGmtCreate());
        vo.setGmtModified(fileRecord.getGmtModified());
        return vo;
    }
}
