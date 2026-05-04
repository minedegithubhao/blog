package com.canbe.blog.agent.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class AgentChatRequestDTO {

    @NotBlank
    @Size(max = 1000)
    private String query;

    @Size(max = 64)
    private String sessionId;

    @Min(1)
    @Max(20)
    private Integer topK = 5;

    public String getQuery() {
        return query;
    }

    public void setQuery(String query) {
        this.query = query;
    }

    public String getSessionId() {
        return sessionId;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }

    public Integer getTopK() {
        return topK;
    }

    public void setTopK(Integer topK) {
        this.topK = topK;
    }
}
