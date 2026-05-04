package com.canbe.blog.system.controller;

import com.canbe.blog.common.Result;
import com.canbe.blog.system.dto.SiteConfigUpdateDTO;
import com.canbe.blog.system.service.SiteConfigService;
import com.canbe.blog.system.vo.SiteConfigVO;
import jakarta.validation.Valid;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Validated
@RestController
@RequestMapping("/api/v1/site-config")
public class SiteConfigController {

    private final SiteConfigService siteConfigService;

    public SiteConfigController(SiteConfigService siteConfigService) {
        this.siteConfigService = siteConfigService;
    }

    @GetMapping
    public Result<SiteConfigVO> get() {
        return Result.success(siteConfigService.get());
    }

    @PutMapping
    public Result<Void> update(@Valid @RequestBody SiteConfigUpdateDTO updateDTO) {
        siteConfigService.update(updateDTO);
        return Result.success(null);
    }
}
