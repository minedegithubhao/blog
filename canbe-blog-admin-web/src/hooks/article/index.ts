import { ref } from "vue";
import { publicArticleListService } from "@/api/article/index";
import type { Article } from "@/api/article/types";
export default function useArticle() {
  // 文章列表数据
  const articles = ref<Article[]>([]);
  const pageNum = ref<number>(1);
  const pageSize = ref<number>(5);
  const total = ref<number>(0);
  const categoryId = ref<null | number>(null);

  // 获取文章列表
  const articleList = async () => {
    let params = {
      pageNum: pageNum.value,
      pageSize: pageSize.value,
      categoryId: categoryId.value,
    };
    let reslut = await publicArticleListService(params);
    articles.value = reslut.data.items;
    total.value = reslut.data.total;
  };

  return { articles, pageNum, pageSize, total, categoryId, articleList };
}
