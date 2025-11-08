import React, { useState, useEffect } from "react";
import { categoryListService } from "@/api/category";
import { Select } from "antd";
import type { SelectProps } from "antd";
type option = SelectProps["options"]

interface CategorySelectProps {
  style?: React.CSSProperties;
  value?: number;
  onChange?: (value: number) => void;
  placeholder?: string;
}
const CategorySelect: React.FC<CategorySelectProps> = ({
  style,
  value,
  onChange,
  placeholder,
}) => {
  const [categoryOptions, setCategoryOptions] = useState<option>([]);

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
    onChange?.(value);
  };

  return (
    <Select
      style={style}
      options={categoryOptions}
      placeholder={placeholder}
      value={value}
      onChange={handleChange}
    />
  );
};
export default CategorySelect;
