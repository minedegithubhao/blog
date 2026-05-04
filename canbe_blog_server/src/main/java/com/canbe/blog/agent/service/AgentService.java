package com.canbe.blog.agent.service;

import com.canbe.blog.agent.dto.AgentCreateDTO;
import com.canbe.blog.agent.dto.AgentQueryDTO;
import com.canbe.blog.agent.dto.AgentUpdateDTO;
import com.canbe.blog.agent.vo.AgentVO;
import com.canbe.blog.agent.vo.ConnectionTestVO;
import com.canbe.blog.common.PageResult;

public interface AgentService {

    PageResult<AgentVO> list(AgentQueryDTO queryDTO);

    Long create(AgentCreateDTO createDTO);

    void update(Long id, AgentUpdateDTO updateDTO);

    void delete(Long id);

    ConnectionTestVO testConnection(Long id);
}
