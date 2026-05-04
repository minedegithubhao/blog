package com.canbe.blog.agent.service;

import com.canbe.blog.agent.dto.AgentCallRecordQueryDTO;
import com.canbe.blog.agent.vo.AgentCallRecordVO;
import com.canbe.blog.common.PageResult;

public interface AgentCallRecordService {

    PageResult<AgentCallRecordVO> list(AgentCallRecordQueryDTO queryDTO);
}
