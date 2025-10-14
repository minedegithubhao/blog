import { ref } from 'vue'
import { articleDetailService } from '@/api/article'
import type { Article } from '@/api/article/types'
export default function useArticleDetail() { 
    const articleId = ref(0)
    // 文章详情
    const article = ref<Article>({} as Article)
    // 获取文章详情
    const articleDetail = async (id : number) => {
        let result = await articleDetailService(id)
        article.value = result.data
    }
    return { articleId, article, articleDetail }
}