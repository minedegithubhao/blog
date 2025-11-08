import type { SelectProps } from "antd";
import { Select } from "antd";
import React from "react";

const options: SelectProps["options"] = [
  { label: "正常", value: 0 },
  { label: "禁用", value: 1 },
];

interface Props {
  style?: React.CSSProperties;
  value?: number;
  onChange?: (value: number) => void;
  placeholder?: string;
}
const UserStatusSelect: React.FC<Props> = ({
  style,
  value,
  onChange,
  placeholder,
}) => {
  return (
    <Select
      style={style}
      options={options}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  );
};
export default UserStatusSelect;
