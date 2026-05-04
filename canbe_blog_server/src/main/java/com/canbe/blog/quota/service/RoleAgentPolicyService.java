package com.canbe.blog.quota.service;

import com.canbe.blog.common.PageResult;
import com.canbe.blog.quota.dto.RoleAgentPolicyQueryDTO;
import com.canbe.blog.quota.dto.RoleAgentPolicyUpdateDTO;
import com.canbe.blog.quota.vo.RoleAgentPolicyVO;

public interface RoleAgentPolicyService {

    PageResult<RoleAgentPolicyVO> list(RoleAgentPolicyQueryDTO queryDTO);

    void update(Long id, RoleAgentPolicyUpdateDTO updateDTO);
}
