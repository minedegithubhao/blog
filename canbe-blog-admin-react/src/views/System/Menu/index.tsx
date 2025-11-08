import type { TablePaginationConfig, TableProps } from "antd";
import React, { useEffect, useState } from "react";
import { Button, Divider, Form, Input, Space, Table, message } from "antd";
import { usePagination } from "@/hooks/usePagination";
import { rowClassName } from "@/utils/common";
import { getMenuPageService, deleteMenuService } from "@/api/menu";
import TableActions from "@/components/Common/TableActions";
import Edit from "./Edit";

const Menu: React.FC = () => {
  const [queryForm] = Form.useForm();
  const { paginationParams, setPaginationParams } = usePagination();
  const [dataSource, setDataSource] = useState<SysMenu[]>([]);
  const [loading, setLoading] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editTitle, setEditTitle] = useState<"Add" | "Edit">("Add");
  const [detailInfo, setDetailInfo] = useState<SysMenu>({} as SysMenu);

  useEffect(() => {
    loadDataWithPagination(paginationParams);
  }, []);
  const loadDataWithPagination = async (
    paginationParams: TablePaginationConfig
  ) => {
    // 显示加载中
    setLoading(true);
    // 构建查询条件
    const queryParams: SysMenuQueryParams = {
      ...queryForm.getFieldsValue(),
      pageNum: paginationParams.current,
      pageSize: paginationParams.pageSize,
    };
    // 调用接口获取数据
    const result = await getMenuPageService(queryParams);
    // 设置数据源
    setDataSource(result.data.records);
    // 设置分页参数
    setPaginationParams({
      ...paginationParams,
      total: result.data.total,
    });
    // 隐藏加载中
    setLoading(false);
  };

  // 查询功能
  const onFinish = () => {
    loadDataWithPagination(paginationParams);
  };

  // 重置功能
  const onReset = () => {
    queryForm.resetFields();
    loadDataWithPagination(paginationParams);
  };

  // 新增功能
  const handleAdd = () => {
    // 显示新增
    setEditTitle("Add");
    // 显示模态框
    setIsEditOpen(true);
    // 清空表单数据
    setDetailInfo({} as SysMenu);
  };

  // 编辑功能
  const handleEdit = (rowData: SysMenu) => {
    // 显示编辑
    setEditTitle("Edit");
    // 显示模态框
    setIsEditOpen(true);
    // 设置表单数据
    setDetailInfo(rowData);
  };

  const handleDel = async (rowData: SysMenu) => {
    // 显示加载中...
    setLoading(true);
    // 删除功能
    await deleteMenuService(rowData.id);
    // 重新加载数据
    loadDataWithPagination(paginationParams);
    // 提示删除成功
    message.success("删除成功");
    // 隐藏加载中...
    setLoading(false);
  };

  const handleTableChange = (pagination: TablePaginationConfig) => {
    loadDataWithPagination(pagination);
  };

  const reloadData = () => {
    loadDataWithPagination(paginationParams);
  };

  const columns: TableProps<SysMenu>["columns"] = [
    {
      title: "菜单名称",
      dataIndex: "title",
      width: 150,
    },
    {
      title: "路由",
      dataIndex: "path",
      width: 150,
    },
    {
      title: "排序",
      dataIndex: "sort",
      width: 150,
      ellipsis: true,
    },
    {
      title: "类型",
      dataIndex: "type",
      width: 150,
    },
    {
      title: "操作",
      width: 150,
      align: "center",
      render: (rowData: SysMenu) => {
        return (
          <TableActions
            record={rowData}
            onEdit={handleEdit}
            onDelete={handleDel}
          />
        );
      },
    },
  ];

  return (
    <div>
      <Form
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        layout="inline"
        form={queryForm}
        name="userQuery"
        onFinish={onFinish}
      >
        <Form.Item label="菜单名称" name="title">
          <Input style={{ width: 200 }}/>
        </Form.Item>
        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button onClick={onReset}>重置</Button>
          </Space>
        </Form.Item>
      </Form>
      <Divider />
      <Space direction="vertical" size="large" style={{ display: "flex" }}>
        <Button onClick={handleAdd} type="primary">
          新增
        </Button>
        <Table<SysMenu>
          rowKey="id"
          loading={loading}
          dataSource={dataSource}
          pagination={paginationParams}
          onChange={handleTableChange}
          rowClassName={rowClassName}
          columns={columns}
        />
      </Space>
      <Edit
        isEditOpen={isEditOpen}
        changeEditOpen={setIsEditOpen}
        editTitle={editTitle}
        detailInfo={detailInfo}
        reloadData={reloadData}
      />
    </div>
  );
};

export default Menu;
