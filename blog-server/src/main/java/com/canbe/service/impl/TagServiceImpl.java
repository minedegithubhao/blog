package com.canbe.service.impl;

import com.canbe.pojo.Tag;
import com.canbe.mapper.TagMapper;
import com.canbe.service.TagService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.stereotype.Service;

/**
 * <p>
 * 标签表 服务实现类
 * </p>
 *
 * @author canbe
 * @since 2025-10-14
 */
@Service
public class TagServiceImpl extends ServiceImpl<TagMapper, Tag> implements TagService {

}
