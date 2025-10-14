import type { CommonField } from "@/api/CommonField"
import type { ArticleStatus } from "@/api/ArticleState"
export interface Article extends CommonField {
    /** id 主键 */
    id: number
    /** 标题 */
    title: string
    /** 内容 */
    content: string
    /** 文章封面 */
    coverImg: string
    /** 文章状态 */
    state: ArticleStatus
    /** 文章分类ID */
    categoryId: number
    /** 分类名称 */
    categoryName: string
    /** 分类码值 */
    categoryCode: string
    /** 浏览次数 */
    views: number
}