package com.canbe.blog.content.controller;

import com.canbe.blog.common.PageResult;
import com.canbe.blog.common.Result;
import com.canbe.blog.content.dto.ArticleQueryDTO;
import com.canbe.blog.content.service.PublicArticleService;
import com.canbe.blog.content.vo.ArticleVO;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/public/articles")
public class PublicArticleController {

    private final PublicArticleService publicArticleService;

    public PublicArticleController(PublicArticleService publicArticleService) {
        this.publicArticleService = publicArticleService;
    }

    @GetMapping
    public Result<PageResult<ArticleVO>> list(ArticleQueryDTO queryDTO) {
        return Result.success(publicArticleService.list(queryDTO));
    }

    @GetMapping("/{id}")
    public Result<ArticleVO> get(@PathVariable Long id) {
        return Result.success(publicArticleService.get(id));
    }
}
