import { Radio } from "antd";
import type { RadioChangeEvent } from "antd";
import type { CheckboxGroupProps } from "antd/es/checkbox";
import React from "react";

const options: CheckboxGroupProps<number>["options"] = [
  { label: "男", value: 0 },
  { label: "女", value: 1 },
];

interface SexRadioProps {
  value?: number;
  onChange?: ({ target: { value } }: RadioChangeEvent) => void;
}

const SexRadio: React.FC<SexRadioProps> = ({ value, onChange }) => {
  return <Radio.Group options={options} onChange={onChange} value={value} />;
};

export default SexRadio;
