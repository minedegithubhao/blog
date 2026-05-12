package com.canbe.blog.rag.controller;

import com.canbe.blog.common.Result;
import com.canbe.blog.rag.service.RagEvaluationProxyService;
import com.fasterxml.jackson.databind.JsonNode;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/rag-evaluation")
public class RagEvaluationController {

    private final RagEvaluationProxyService proxyService;

    public RagEvaluationController(RagEvaluationProxyService proxyService) {
        this.proxyService = proxyService;
    }

    @PostMapping("/eval-sets/generate")
    public Result<JsonNode> generate(@RequestBody JsonNode body) {
        return Result.success(proxyService.forwardPost("/admin/eval-sets/generate", body));
    }

    @GetMapping("/eval-sets")
    public Result<JsonNode> listEvalSets(HttpServletRequest request) {
        return Result.success(proxyService.forwardGet("/admin/eval-sets", request.getQueryString()));
    }

    @GetMapping("/eval-sets/{evalSetId}")
    public Result<JsonNode> getEvalSet(@PathVariable String evalSetId) {
        return Result.success(proxyService.forwardGet("/admin/eval-sets/" + evalSetId, ""));
    }

    @GetMapping("/eval-sets/{evalSetId}/cases")
    public Result<JsonNode> listCases(@PathVariable String evalSetId, HttpServletRequest request) {
        return Result.success(proxyService.forwardGet("/admin/eval-sets/" + evalSetId + "/cases", request.getQueryString()));
    }

    @GetMapping("/eval-sets/{evalSetId}/export")
    public Result<JsonNode> exportCases(@PathVariable String evalSetId) {
        return Result.success(proxyService.forwardGet("/admin/eval-sets/" + evalSetId + "/export", ""));
    }

    @PostMapping("/eval-sets/{evalSetId}/check-stale")
    public Result<JsonNode> checkStale(@PathVariable String evalSetId) {
        return Result.success(proxyService.forwardPost("/admin/eval-sets/" + evalSetId + "/check-stale", null));
    }

    @PostMapping("/eval-sets/{evalSetId}/runs/start")
    public Result<JsonNode> startRun(@PathVariable String evalSetId) {
        return Result.success(proxyService.forwardPost("/admin/eval-sets/" + evalSetId + "/runs/start", null));
    }

    @GetMapping("/eval-sets/{evalSetId}/runs")
    public Result<JsonNode> listRuns(@PathVariable String evalSetId, HttpServletRequest request) {
        return Result.success(proxyService.forwardGet("/admin/eval-sets/" + evalSetId + "/runs", request.getQueryString()));
    }

    @GetMapping("/runs/{runId}")
    public Result<JsonNode> getRun(@PathVariable String runId) {
        return Result.success(proxyService.forwardGet("/admin/eval-sets/runs/" + runId, ""));
    }

    @GetMapping("/runs/{runId}/results")
    public Result<JsonNode> listRunResults(@PathVariable String runId, HttpServletRequest request) {
        return Result.success(proxyService.forwardGet("/admin/eval-sets/runs/" + runId + "/results", request.getQueryString()));
    }
}
