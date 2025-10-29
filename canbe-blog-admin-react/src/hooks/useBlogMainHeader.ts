import React, { useEffect } from "react";
import { categoryListService } from "@/api/category";
import { useLocation, useNavigate } from "react-router-dom";

export default function useBlogMainHeader() {
  // 分类列表
  const [categoryList, setCategoryList] = React.useState<SysCategory[]>([]);
  // 选中项
  const [selectedKey, setSelectedKey] = React.useState<string>("");
  const location = useLocation();
  const navigate = useNavigate();

  // 分类列表
  const list = async () => {
    const result = await categoryListService();
    setCategoryList(result.data);

    // 检查URL中是否有分类ID参数
    const urlParams = new URLSearchParams(location.search);
    const categoryIdFromUrl = urlParams.get("categoryId");

    // 有分类ID则使用URL中的分类ID
    if (categoryIdFromUrl) {
      setSelectedKey(categoryIdFromUrl);
    } else if (result.data && result.data.length > 0) {
      // 否则设置默认选中项为第一个分类的ID
      setSelectedKey(result.data[0].id.toString());
    }
  };

  useEffect(() => {
    list();
  }, []);

  // 当selectedKey改变时更新URL参数
  useEffect(() => {
    if (selectedKey) {
      const searchParams = new URLSearchParams();
      searchParams.set("categoryId", selectedKey);
      navigate(`/web/category?${searchParams.toString()}`, {
        replace: true,
      });
    }
  }, [selectedKey]);

  // 分类列表项
  const items = categoryList.map((item) => ({
    key: item.id.toString(),
    label: item.name,
  }));

  return {
    selectedKey,
    setSelectedKey,
    items,
  };
}
