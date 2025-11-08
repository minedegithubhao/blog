import { usePagination } from "@/hooks/usePagination";
import { rowClassName } from "@/utils/common";
import { Button, Form, Input, Table } from "antd";
import React, { useState, useEffect } from "react";
import type { TablePaginationConfig } from "antd/es/table";
import { dictPageService } from "@/api/dict";

interface SysDictProps {
  onSelect: (record: SysDict) => void;
}

const Left: React.FC<SysDictProps> = ({ onSelect }) => {
  const [queryForm] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const [dataSource, setDataSource] = useState<SysDict[]>([]);
  const { paginationParams, setPaginationParams } = usePagination({
    defaultCurrent: 1,
    defaultPageSize: 10,
  });
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editTitle, setEditTitle] = useState<"Add" | "Edit">("Add");
  const [detailInfo, setDetailInfo] = useState<SysDict>({} as SysDict);

  useEffect(() => {
    loadDataWithPagination(paginationParams);
  }, []);
  /**
   * 加载文章分类数据
   * @param pagination 分页参数
   */
  const loadDataWithPagination = async (pagination: TablePaginationConfig) => {
    // 显示加载中...
    setLoading(true);
    // 构建查询参数
    const queryParams = {
      ...queryForm.getFieldsValue(),
      // 获取当前页码和每页条数，如果未指定，则使用默认值
      pageNum: pagination.current || pagination.defaultCurrent,
      pageSize: pagination.pageSize || pagination.defaultPageSize,
    };
    console.log("queryParams", queryParams);
    const result = await dictPageService(queryParams);
    setDataSource(result.data.records);
    // 修改分页参数
    setPaginationParams({
      ...pagination,
      total: result.data.total,
    });
    // 显示加载中...
    setLoading(false);
  };

  const columns = [
    {
      title: "字典名称",
      dataIndex: "name",
    },
    {
      title: "字典类型",
      dataIndex: "type",
    },
  ];

  const handleTableChange = (pagination: TablePaginationConfig) => {
    setPaginationParams(pagination);
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      loadDataWithPagination(paginationParams);
    }
  };

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", alignItems: "flex-end" }}>
        <Form
          form={queryForm}
          layout="vertical"
          name="queryForm"
          style={{ flex: 1 }}
        >
          <Form.Item name="name">
            <Input
              placeholder="请输入字典名称/类型"
              style={{ width: "100%" }}
              onKeyUp={handleKeyUp}
            />
          </Form.Item>
        </Form>
        <Button
          type="primary"
          style={{ marginLeft: "10px", marginBottom: "24px" }}
        >
          新增
        </Button>
      </div>
      <Table
        rowKey="id"
        loading={loading}
        dataSource={dataSource}
        pagination={paginationParams}
        onChange={handleTableChange}
        rowClassName={rowClassName}
        columns={columns}
        showHeader={false}
        style={{ flex: 1, overflow: "auto" }}
        onRow={(record) => {
          return {
            onClick: () => {
              onSelect(record);
            },
          };
        }}
      />
    </div>
  );
};
export default Left;
