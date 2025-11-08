import type { RadioChangeEvent } from "antd";
import { Radio } from "antd";
import type { CheckboxGroupProps } from "antd/es/checkbox";
import React from "react";

const options: CheckboxGroupProps<number>["options"] = [
  { label: "正常", value: 0 },
  { label: "禁用", value: 1 },
];

interface UserStatusProps {
  value?: number;
  onChange?: ({ target: { value } }: RadioChangeEvent) => void;
}

const UserStatusRadio: React.FC<UserStatusProps> = ({ value, onChange }) => {
  return <Radio.Group options={options} onChange={onChange} value={value} />;
};

export default UserStatusRadio;
