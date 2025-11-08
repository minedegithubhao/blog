import React from "react";
import { Space, Button, Popconfirm } from "antd";

interface TableActionsProps {
  onEdit?: (record: any) => void;
  onDelete?: (record: any) => void;
  record: any;
  editLabel?: string;
  deleteLabel?: string;
  deleteConfirmTitle?: string;
  deleteConfirmContent?: string;
}

const TableActions: React.FC<TableActionsProps> = ({
  onEdit,
  onDelete,
  record,
  editLabel = "编辑",
  deleteLabel = "删除",
  deleteConfirmTitle = "提示",
  deleteConfirmContent = "请确认是否删除该记录？"
}) => {
  return (
    <Space>
      {onEdit && (
        <Button type="primary" onClick={() => onEdit(record)}>
          {editLabel}
        </Button>
      )}
      {onDelete && (
        <Popconfirm
          title={deleteConfirmTitle}
          description={deleteConfirmContent}
          okText="是"
          cancelText="否"
          onConfirm={() => onDelete(record)}
        >
          <Button danger>{deleteLabel}</Button>
        </Popconfirm>
      )}
    </Space>
  );
};

export default TableActions;
