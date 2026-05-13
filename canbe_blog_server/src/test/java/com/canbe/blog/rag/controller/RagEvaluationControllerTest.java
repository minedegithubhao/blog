package com.canbe.blog.rag.controller;

import static org.junit.jupiter.api.Assertions.assertArrayEquals;

import java.lang.reflect.Method;
import org.junit.jupiter.api.Test;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;

class RagEvaluationControllerTest {

    @Test
    void exposesEvalRunDetailRouteExpectedByFrontend() throws Exception {
        Method method = RagEvaluationController.class.getMethod("getEvalRun", String.class);

        assertArrayEquals(new String[] {"/eval-runs/{runId}"}, method.getAnnotation(GetMapping.class).value());
    }

    @Test
    void exposesEvalRunResultsRouteExpectedByFrontend() throws Exception {
        Method method = RagEvaluationController.class.getMethod(
            "listEvalRunResults",
            String.class,
            jakarta.servlet.http.HttpServletRequest.class
        );

        assertArrayEquals(new String[] {"/eval-runs/{runId}/results"}, method.getAnnotation(GetMapping.class).value());
    }

    @Test
    void exposesDeleteEvalSetRouteExpectedByFrontend() throws Exception {
        Method method = RagEvaluationController.class.getMethod("deleteEvalSet", String.class);

        assertArrayEquals(new String[] {"/eval-sets/{evalSetId}"}, method.getAnnotation(DeleteMapping.class).value());
    }
}
