<script setup lang="ts">
import { formatTime } from "@/utils/time";
import { onUnmounted, ref } from "vue";
import useArticle from "@/hooks/article";
const { articles, pageNum, pageSize, total, categoryId, articleList } =
  useArticle();
articleList();

// 1.绑定事件，当用户点击菜单时，获取相应的分类数据
import emitter from "@/utils/emitter";
const handleSearchArticleList = (value: number) => {
  categoryId.value = value;
  articleList();
};
emitter.on("searchArticleList", (value) => {
  handleSearchArticleList(value as number);
});
onUnmounted(() => {
  emitter.off("searchArticleList");
});
// 2.当前页码发生变化，调用此函数
const handleCurrentChange = (value: number) => {
  pageNum.value = value;
  articleList();
};
</script>
<template>
  <!-- 文章卡片循环 -->
  <el-card v-for="article in articles" :key="article.id" class="post-card">
    <!-- 标题+摘要+图片 区域 -->
    <div class="content-row">
      <div class="text-area">
        <router-link :to="{ name: 'detail', params: { id: article.id } }">
          <h3 class="post-title">{{ article.title }}</h3>
        </router-link>
        <p class="post-content">{{ article.content }}</p>
      </div>
      <el-image
        class="post-image"
        :src="article.coverImg"
        fit="cover"
        lazy
        @error="console.warn('图片加载失败:', article.coverImg)"
      />
    </div>

    <el-divider style="margin: 10px 0" />

    <!-- 作者、浏览量、时间、分类 区域 -->
    <div class="post-card-bottom">
      <div class="left-info">
        <div class="author">作者:{{ article.createUsername }}</div>
        <div>浏览:{{ article.views }}次</div>
        <div>发布时间:{{ formatTime(article.createTime) }}</div>
      </div>
      <div class="right-info">
        <el-tag disable-transitions="true">{{ article.categoryName }}</el-tag>
      </div>
    </div>
  </el-card>
  <!-- 分页 -->
  <el-pagination
    background
    style="display: flex; justify-content: center"
    v-model:current-page="pageNum"
    v-model:page-size="pageSize"
    :page-sizes="[5]"
    small="small"
    :disabled="false"
    layout="prev, pager, next, jumper"
    :total="total"
    @current-change="handleCurrentChange"
  />
</template>
<style lang="scss" scoped>
.post-card {
  width: 100%;
  margin-bottom: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

  .content-row {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .text-area {
      width: calc(100% - 220px);
      padding-right: 20px;

      :deep(a) {
        text-decoration: none;
        color: #000000;

        &:hover {
          color: #409eff;
          text-decoration: underline;
        }
      }

      .post-title {
        font-size: 18px;
        font-weight: 600;
        margin: 8px 0;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .post-content {
        font-size: 14px;
        color: #666;
        line-height: 1.5;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
        overflow: hidden;
        text-overflow: ellipsis;
        min-height: 63px; // 添加最小高度(1.5 * 14px * 3行),无论内容多少，标题和内容区域都会保持固定的高度，布局不会发生变化
      }
    }

    .post-image {
      width: 200px;
      height: 120px;
      border-radius: 6px;
    }
  }

  .post-card-bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .left-info,
    .right-info {
      display: flex;
      align-items: center;
      font-size: 13px;

      div {
        display: flex;
        align-items: center;
        margin-right: 15px;

        :deep(.el-avatar) {
          margin-right: 5px;
        }

        :deep(.el-icon) {
          margin-right: 3px;
        }
      }
    }

    .read-time {
      font-size: 12px;
      color: #666;
    }
  }
}
</style>
