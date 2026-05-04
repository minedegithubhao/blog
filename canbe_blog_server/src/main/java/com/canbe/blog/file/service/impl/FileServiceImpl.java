package com.canbe.blog.file.service.impl;

import com.canbe.blog.common.BusinessException;
import com.canbe.blog.common.PageResult;
import com.canbe.blog.file.convert.FileConvert;
import com.canbe.blog.file.dto.FileQueryDTO;
import com.canbe.blog.file.entity.FileRecord;
import com.canbe.blog.file.mapper.FileRecordMapper;
import com.canbe.blog.file.service.FileService;
import com.canbe.blog.file.vo.FileVO;
import com.canbe.blog.security.AuthenticatedUser;
import com.canbe.blog.security.CurrentUserContext;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalDate;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
public class FileServiceImpl implements FileService {

    private static final String ADMIN_ROLE = "ADMIN";
    private static final long MAX_SIZE = 5L * 1024 * 1024;
    private static final Set<String> ALLOWED_CONTENT_TYPES = Set.of(
        "image/jpeg",
        "image/png",
        "image/webp"
    );

    private final FileRecordMapper fileRecordMapper;
    private final Path storageRoot;

    public FileServiceImpl(FileRecordMapper fileRecordMapper, @Value("${blog.file.storage-path:storage/uploads}") String storagePath) {
        this.fileRecordMapper = fileRecordMapper;
        this.storageRoot = Path.of(storagePath).toAbsolutePath().normalize();
    }

    @Override
    @Transactional
    public FileVO upload(MultipartFile file) {
        requireAdmin();
        validateFile(file);

        String extension = resolveExtension(file.getOriginalFilename());
        String storedName = UUID.randomUUID() + extension;
        LocalDate today = LocalDate.now();
        Path relativeDirectory = Path.of(String.valueOf(today.getYear()), formatTwoDigits(today.getMonthValue()), formatTwoDigits(today.getDayOfMonth()));
        Path targetDirectory = storageRoot.resolve(relativeDirectory);
        Path targetPath = targetDirectory.resolve(storedName);
        String relativePath = relativeDirectory.resolve(storedName).toString().replace('\\', '/');
        String url = "/uploads/" + relativePath;

        try {
            Files.createDirectories(targetDirectory);
            file.transferTo(targetPath);
        } catch (IOException exception) {
            throw new BusinessException(6001, "文件保存失败");
        }

        Long id = fileRecordMapper.create(
            defaultFilename(file.getOriginalFilename()),
            storedName,
            relativePath,
            url,
            file.getSize(),
            file.getContentType() == null ? "" : file.getContentType()
        );

        FileRecord record = fileRecordMapper.findById(id).orElseThrow(() -> new BusinessException(6002, "文件记录不存在"));
        return FileConvert.toVO(record);
    }

    @Override
    public PageResult<FileVO> list(FileQueryDTO queryDTO) {
        requireAdmin();
        int page = normalizePage(queryDTO.getPage());
        int pageSize = normalizePageSize(queryDTO.getPageSize());
        queryDTO.setPage(page);
        queryDTO.setPageSize(pageSize);
        List<FileVO> list = fileRecordMapper.list(queryDTO).stream()
            .map(FileConvert::toVO)
            .toList();
        return new PageResult<>(list, fileRecordMapper.count(queryDTO), page, pageSize);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        requireAdmin();
        FileRecord record = fileRecordMapper.findById(id).orElseThrow(() -> new BusinessException(6002, "文件不存在"));
        try {
            Files.deleteIfExists(storageRoot.resolve(record.getRelativePath()));
        } catch (IOException ignored) {
            // V1 最简实现：物理文件缺失不阻塞删除记录
        }
        if (fileRecordMapper.delete(id) == 0) {
            throw new BusinessException(6002, "文件不存在");
        }
    }

    private AuthenticatedUser requireAdmin() {
        AuthenticatedUser currentUser = CurrentUserContext.getRequired();
        if (!ADMIN_ROLE.equals(currentUser.getRoleCode())) {
            throw new BusinessException(2005, "权限不足");
        }
        return currentUser;
    }

    private void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BusinessException(6003, "请选择要上传的文件");
        }
        if (file.getSize() > MAX_SIZE) {
            throw new BusinessException(6004, "文件大小不能超过 5MB");
        }
        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_CONTENT_TYPES.contains(contentType)) {
            throw new BusinessException(6005, "只允许上传 jpg/jpeg/png/webp 图片");
        }
    }

    private int normalizePage(Integer page) {
        return page == null || page < 1 ? 1 : page;
    }

    private int normalizePageSize(Integer pageSize) {
        if (pageSize == null || pageSize < 1) {
            return 20;
        }
        return Math.min(pageSize, 100);
    }

    private String resolveExtension(String filename) {
        if (filename == null || !filename.contains(".")) {
            return "";
        }
        return filename.substring(filename.lastIndexOf('.')).toLowerCase();
    }

    private String defaultFilename(String filename) {
        return filename == null || filename.isBlank() ? "unnamed-file" : filename.trim();
    }

    private String formatTwoDigits(int value) {
        return value < 10 ? "0" + value : String.valueOf(value);
    }
}
