package com.canbe.blog.agent.vo;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.JsonNode;

public class AgentChatVO {

    private String sessionId;
    private String answer;
    private Double confidence;
    private JsonNode sources;
    private JsonNode suggestedQuestions;
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private JsonNode suggestedQuestionCandidates;
    private Boolean fallback;
    private String traceId;
    private JsonNode debug;
    private Integer quotaUsed;

    public String getSessionId() {
        return sessionId;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }

    public String getAnswer() {
        return answer;
    }

    public void setAnswer(String answer) {
        this.answer = answer;
    }

    public Double getConfidence() {
        return confidence;
    }

    public void setConfidence(Double confidence) {
        this.confidence = confidence;
    }

    public JsonNode getSources() {
        return sources;
    }

    public void setSources(JsonNode sources) {
        this.sources = sources;
    }

    public JsonNode getSuggestedQuestions() {
        return suggestedQuestions;
    }

    public void setSuggestedQuestions(JsonNode suggestedQuestions) {
        this.suggestedQuestions = suggestedQuestions;
    }

    public JsonNode getSuggestedQuestionCandidates() {
        return suggestedQuestionCandidates;
    }

    public void setSuggestedQuestionCandidates(JsonNode suggestedQuestionCandidates) {
        this.suggestedQuestionCandidates = suggestedQuestionCandidates;
    }

    public Boolean getFallback() {
        return fallback;
    }

    public void setFallback(Boolean fallback) {
        this.fallback = fallback;
    }

    public String getTraceId() {
        return traceId;
    }

    public void setTraceId(String traceId) {
        this.traceId = traceId;
    }

    public JsonNode getDebug() {
        return debug;
    }

    public void setDebug(JsonNode debug) {
        this.debug = debug;
    }

    public Integer getQuotaUsed() {
        return quotaUsed;
    }

    public void setQuotaUsed(Integer quotaUsed) {
        this.quotaUsed = quotaUsed;
    }
}
