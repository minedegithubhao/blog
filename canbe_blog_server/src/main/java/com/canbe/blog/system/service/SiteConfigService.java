package com.canbe.blog.system.service;

import com.canbe.blog.system.dto.SiteConfigUpdateDTO;
import com.canbe.blog.system.vo.SiteConfigVO;

public interface SiteConfigService {

    SiteConfigVO get();

    void update(SiteConfigUpdateDTO updateDTO);
}
