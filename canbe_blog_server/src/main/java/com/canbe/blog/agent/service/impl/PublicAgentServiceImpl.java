package com.canbe.blog.agent.service.impl;

import com.canbe.blog.agent.convert.AgentConvert;
import com.canbe.blog.agent.dto.AgentQueryDTO;
import com.canbe.blog.agent.mapper.AgentMapper;
import com.canbe.blog.agent.service.PublicAgentService;
import com.canbe.blog.agent.vo.AgentVO;
import com.canbe.blog.common.PageResult;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class PublicAgentServiceImpl implements PublicAgentService {

    private final AgentMapper agentMapper;

    public PublicAgentServiceImpl(AgentMapper agentMapper) {
        this.agentMapper = agentMapper;
    }

    @Override
    public PageResult<AgentVO> list(AgentQueryDTO queryDTO) {
        int page = normalizePage(queryDTO.getPage());
        int pageSize = normalizePageSize(queryDTO.getPageSize());
        queryDTO.setPage(page);
        queryDTO.setPageSize(pageSize);
        List<AgentVO> list = agentMapper.listPublished(queryDTO).stream()
            .map(AgentConvert::toVO)
            .toList();
        return new PageResult<>(list, agentMapper.countPublished(queryDTO), page, pageSize);
    }

    private int normalizePage(Integer page) {
        return page == null || page < 1 ? 1 : page;
    }

    private int normalizePageSize(Integer pageSize) {
        if (pageSize == null || pageSize < 1) {
            return 20;
        }
        return Math.min(pageSize, 100);
    }
}
