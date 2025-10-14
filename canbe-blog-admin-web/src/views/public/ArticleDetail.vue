<script setup lang="ts">
import { useRoute } from "vue-router";
import useArticleDetail from "@/hooks/article/useArticleDetail";
const { articleId, article, articleDetail } = useArticleDetail();

// 使用useRoute获取路由信息
const route = useRoute();
// 从路由参数中获取文章ID
articleId.value = Number(route.params.id);
articleDetail(articleId.value);
</script>
<template>
  <div class="article">
    <div class="article-header">
      <div class="article-header-title">
        {{ article.title }}
      </div>
      <div class="article-header-info">
        <div style="font-size: 13px; display: flex; align-items: center">
          浏览:{{ article.views }}次
        </div>
        <div>
          <el-tag>{{ article.categoryName }}</el-tag>
        </div>
      </div>
    </div>
    <el-divider style="margin: 0 0" />
    <div class="article-content">
      {{ article.content }}
    </div>
  </div>
</template>
<style lang="scss" scoped>
.article {
  width: 100%;
  height: 100%;
  background-color: #ffffff;
  border-radius: 10px;

  .article-header {
    padding: 24px 32px;

    .article-header-title {
      font-size: 1.8em;
      line-height: 1.4;
      margin-bottom: 24px;
      text-align: left;
    }

    .article-header-info {
      display: flex;
      justify-content: space-between;
    }
  }

  .article-content {
    padding: 24px 32px;
  }
}
</style>
