package com.canbe.blog.system.convert;

import com.canbe.blog.system.entity.DictItem;
import com.canbe.blog.system.vo.DictItemVO;

public final class DictItemConvert {

    private DictItemConvert() {
    }

    public static DictItemVO toVO(DictItem item) {
        DictItemVO vo = new DictItemVO();
        vo.setId(item.getId());
        vo.setTypeCode(item.getTypeCode());
        vo.setTypeName(item.getTypeName());
        vo.setItemLabel(item.getItemLabel());
        vo.setItemValue(item.getItemValue());
        vo.setSortOrder(item.getSortOrder());
        vo.setStatus(item.getStatus());
        vo.setRemark(item.getRemark());
        vo.setGmtCreate(item.getGmtCreate());
        vo.setGmtModified(item.getGmtModified());
        return vo;
    }
}
