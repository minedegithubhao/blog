import React, { useState, useEffect } from "react";
import { categoryListService } from "@/api/category";
import { Select } from "antd";
import type { SelectProps } from "antd";

interface CategorySelectProps {
  style?: React.CSSProperties;
  value?: number;
  onChange?: (value: number) => void;
  required?: boolean;
}
const CategorySelect: React.FC<CategorySelectProps> = ({
  style,
  value,
  onChange,
  required = false,
}) => {
  const [categoryOptions, setCategoryOptions] = useState<
    { value: number; label: string }[]
  >([]);

  useEffect(() => {
    categoryList();
  }, []);

  const categoryList = async () => {
    const result = await categoryListService();
    setCategoryOptions(
      result.data.map((item) => ({
        value: item.id,
        label: item.name,
      }))
    );
  };

  const handleChange: SelectProps["onChange"] = (value) => {
    console.log(value);
    onChange?.(value);
  };

  return (
    <Select
      style={style}
      options={categoryOptions}
      placeholder={required && "请选择文章分类"}
      value={value}
      onChange={handleChange}
    />
  );
};
export default CategorySelect;
