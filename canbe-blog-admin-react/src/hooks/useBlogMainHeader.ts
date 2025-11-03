import { webCategoryListService } from "@/api/web/webCategory";
import React, { useEffect } from "react";

export default function useBlogMainHeader() {
  // 分类列表
  const [categoryList, setCategoryList] = React.useState<SysCategory[]>([]);
  // 分类列表
  const list = async () => {
    const result = await webCategoryListService();
    setCategoryList(result.data);
  };

  useEffect(() => {
    list();
  }, []);

  // 分类列表项
  const items = categoryList.map((item) => ({
    key: item.id.toString(),
    label: item.name,
  }));

  return {
    items,
  };
}
