import { deleteTagService, getTagListService } from "@/api/tag";
import TableActions from "@/components/Common/TableActions";
import { usePagination } from "@/hooks/usePagination";
import { rowClassName } from "@/utils/common";
import { FORMAT_DATE_TIME, formateDateTime } from "@/utils/time";
import type { TablePaginationConfig, TableProps } from "antd";
import { Button, Divider, Form, Input, message, Space, Table } from "antd";
import React, { useEffect, useState } from "react";
import Edit from "./Edit";

const Tag: React.FC = () => {
  const [queryForm] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const [dataSource, setDataSource] = useState<SysTag[]>([]);
  const { paginationParams, setPaginationParams } = usePagination();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editTitle, setEditTitle] = useState<"Add" | "Edit">("Add");
  const [detailInfo, setDetailInfo] = useState<SysTag>({} as SysTag);

  useEffect(() => {
    loadDataWithPagination(paginationParams);
  }, []);

  // 加载分页数据
  const loadDataWithPagination = async (
    paginationParams: TablePaginationConfig
  ) => {
    // 显示加载中...
    setLoading(true);
    // 构建查询参数
    const queryParams = {
      ...queryForm.getFieldsValue(),
      // 获取当前页码和每页条数，如果未指定，则使用默认值
      pageNum: paginationParams.current,
      pageSize: paginationParams.pageSize,
    };
    // 调用接口获取数据
    const res = await getTagListService(queryParams);
    // 设置数据源
    setDataSource(res.data.records);
    // 修改分页参数
    setPaginationParams({
      ...paginationParams,
      total: res.data.total,
    });
    // 隐藏加载中...
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

  // 删除功能
  const handleDel = async (rowData: SysTag) => {
    // 显示加载中...
    setLoading(true);
    // 调用接口删除数据
    await deleteTagService(rowData.id);
    // 重新加载数据
    loadDataWithPagination(paginationParams);
    // 提示删除成功
    message.success("删除成功");
    // 隐藏加载中...
    setLoading(false);
  };

  // 新增功能
  const handleAdd = () => {
    setIsEditOpen(true);
    setEditTitle("Add");
  };

  // 修改功能
  const handleEdit = (rowData: SysTag) => {
    setIsEditOpen(true);
    setEditTitle("Edit");
    setDetailInfo(rowData);
  };

  // 表格分页功能
  const handleTableChange: TableProps<SysTag>["onChange"] = (pagination) => {
    loadDataWithPagination(pagination);
  };

  // 重新加载数据
  const reloadData = () => {
    loadDataWithPagination(paginationParams);
  };

  const columns: TableProps<SysTag>["columns"] = [
    {
      title: "标签名称",
      dataIndex: "name",
      width: 250,
      align: "center",
    },
    {
      title: "排序",
      dataIndex: "sort",
      align: "center",
      width: 250,
    },
    {
      title: "创建时间",
      dataIndex: "createTime",
      align: "center",
      width: 150,
      render: (createTime: string) =>
        formateDateTime(createTime, FORMAT_DATE_TIME),
    },
    {
      title: "更新时间",
      dataIndex: "updateTime",
      align: "center",
      width: 150,
      render: (updateTime: string) =>
        formateDateTime(updateTime, FORMAT_DATE_TIME),
    },
    {
      title: "操作",
      align: "center",
      width: 150,
      render: (record: SysTag) => {
        return (
          <TableActions
            record={record}
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
        name="queryForm"
        onFinish={onFinish}
      >
        <Form.Item label="标签名称" name="name">
          <Input style={{ width: 200 }} />
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
        <Table<SysTag>
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

export default Tag;
