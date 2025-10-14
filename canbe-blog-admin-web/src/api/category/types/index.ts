import type { CommonField } from "@/api/CommonField";
export interface Category extends CommonField {
  /** id 主键 */
  id: number;
  /** 分类名称 */
  categoryName: string;
  /** 分类码值 */
  categoryCode: string;
  /** 排序 */
  sort: number;
}
