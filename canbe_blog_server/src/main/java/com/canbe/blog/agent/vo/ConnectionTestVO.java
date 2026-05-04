package com.canbe.blog.agent.vo;

public class ConnectionTestVO {

    private boolean success;
    private Long latencyMs;
    private String errorCode;
    private String errorMessage;

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public Long getLatencyMs() {
        return latencyMs;
    }

    public void setLatencyMs(Long latencyMs) {
        this.latencyMs = latencyMs;
    }

    public String getErrorCode() {
        return errorCode;
    }

    public void setErrorCode(String errorCode) {
        this.errorCode = errorCode;
    }

    public String getErrorMessage() {
        return errorMessage;
    }

    public void setErrorMessage(String errorMessage) {
        this.errorMessage = errorMessage;
    }
}
