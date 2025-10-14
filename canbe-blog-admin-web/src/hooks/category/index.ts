import { ref } from "vue";
import { publicArticleCategoryService } from "@/api/article/index";
import type { ArticleCategory } from "@/api/category/types";
export default function useCategory() {
  // 所有分类
  const categoryItems = ref<ArticleCategory[]>([]);
  // 获取文章分类
  const articleCategory = async () => {
    let result = await publicArticleCategoryService();
    categoryItems.value = result.data;
  };
  return { categoryItems, articleCategory };
}
