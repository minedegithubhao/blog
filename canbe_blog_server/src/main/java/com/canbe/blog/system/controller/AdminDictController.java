package com.canbe.blog.system.controller;

import com.canbe.blog.common.PageResult;
import com.canbe.blog.common.Result;
import com.canbe.blog.system.dto.DictItemCreateDTO;
import com.canbe.blog.system.dto.DictItemQueryDTO;
import com.canbe.blog.system.dto.DictItemUpdateDTO;
import com.canbe.blog.system.service.DictItemService;
import com.canbe.blog.system.vo.DictItemVO;
import jakarta.validation.Valid;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Validated
@RestController
@RequestMapping("/api/v1/dicts")
public class AdminDictController {

    private final DictItemService dictItemService;

    public AdminDictController(DictItemService dictItemService) {
        this.dictItemService = dictItemService;
    }

    @GetMapping
    public Result<PageResult<DictItemVO>> list(DictItemQueryDTO queryDTO) {
        return Result.success(dictItemService.list(queryDTO));
    }

    @PostMapping
    public Result<Long> create(@Valid @RequestBody DictItemCreateDTO createDTO) {
        return Result.success(dictItemService.create(createDTO));
    }

    @PutMapping("/{id}")
    public Result<Void> update(@PathVariable Long id, @Valid @RequestBody DictItemUpdateDTO updateDTO) {
        dictItemService.update(id, updateDTO);
        return Result.success(null);
    }

    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        dictItemService.delete(id);
        return Result.success(null);
    }
}
