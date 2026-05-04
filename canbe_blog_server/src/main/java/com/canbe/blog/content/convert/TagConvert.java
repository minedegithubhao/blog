package com.canbe.blog.content.convert;

import com.canbe.blog.content.entity.Tag;
import com.canbe.blog.content.vo.TagVO;

public final class TagConvert {

    private TagConvert() {
    }

    public static TagVO toVO(Tag tag) {
        TagVO vo = new TagVO();
        vo.setId(tag.getId());
        vo.setName(tag.getName());
        vo.setSlug(tag.getSlug());
        vo.setGmtCreate(tag.getGmtCreate());
        vo.setGmtModified(tag.getGmtModified());
        return vo;
    }
}
