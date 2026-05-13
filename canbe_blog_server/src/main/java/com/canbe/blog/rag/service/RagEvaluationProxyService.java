package com.canbe.blog.rag.service;

import com.fasterxml.jackson.databind.JsonNode;

public interface RagEvaluationProxyService {

    JsonNode forwardGet(String path, String queryString);

    JsonNode forwardPost(String path, JsonNode body);

    JsonNode forwardDelete(String path);
}
