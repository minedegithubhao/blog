package com.canbe.blog.agent.service;

import com.canbe.blog.agent.dto.AgentQueryDTO;
import com.canbe.blog.agent.vo.AgentVO;
import com.canbe.blog.common.PageResult;

public interface PublicAgentService {

    PageResult<AgentVO> list(AgentQueryDTO queryDTO);
}
