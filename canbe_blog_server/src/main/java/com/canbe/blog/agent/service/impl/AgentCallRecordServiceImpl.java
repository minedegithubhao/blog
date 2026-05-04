package com.canbe.blog.agent.service.impl;

import com.canbe.blog.agent.convert.AgentConvert;
import com.canbe.blog.agent.dto.AgentCallRecordQueryDTO;
import com.canbe.blog.agent.mapper.AgentCallRecordMapper;
import com.canbe.blog.agent.service.AgentCallRecordService;
import com.canbe.blog.agent.vo.AgentCallRecordVO;
import com.canbe.blog.common.BusinessException;
import com.canbe.blog.common.PageResult;
import com.canbe.blog.security.AuthenticatedUser;
import com.canbe.blog.security.CurrentUserContext;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class AgentCallRecordServiceImpl implements AgentCallRecordService {

    private static final String ADMIN_ROLE = "ADMIN";

    private final AgentCallRecordMapper agentCallRecordMapper;

    public AgentCallRecordServiceImpl(AgentCallRecordMapper agentCallRecordMapper) {
        this.agentCallRecordMapper = agentCallRecordMapper;
    }

    @Override
    public PageResult<AgentCallRecordVO> list(AgentCallRecordQueryDTO queryDTO) {
        requireAdmin();
        int page = normalizePage(queryDTO.getPage());
        int pageSize = normalizePageSize(queryDTO.getPageSize());
        queryDTO.setPage(page);
        queryDTO.setPageSize(pageSize);
        List<AgentCallRecordVO> list = agentCallRecordMapper.list(queryDTO).stream()
            .map(AgentConvert::toVO)
            .toList();
        return new PageResult<>(list, agentCallRecordMapper.count(queryDTO), page, pageSize);
    }

    private AuthenticatedUser requireAdmin() {
        AuthenticatedUser currentUser = CurrentUserContext.getRequired();
        if (!ADMIN_ROLE.equals(currentUser.getRoleCode())) {
            throw new BusinessException(2005, "权限不足");
        }
        return currentUser;
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
