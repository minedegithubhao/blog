import { deleteUserService, getUserListService } from "@/api/user";
import TableActions from "@/components/Common/TableActions";
import { usePagination } from "@/hooks/usePagination";
import {
  getSexDisplay,
  getUserStateDisplay,
  rowClassName,
} from "@/utils/common";
import { formatStringDate } from "@/utils/time";
import type { TablePaginationConfig, TableProps } from "antd";
import { Button, Divider, Form, Input, message, Space, Table, Tag } from "antd";
import React, { useEffect, useState } from "react";
import Edit from "./Edit";
import UserStatusSelect from "./UserStatusSelect";

const User: React.FC = () => {
  const [queryForm] = Form.useForm();
  const { paginationParams, setPaginationParams } = usePagination();
  const [dataSource, setDataSource] = useState<SysUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editTitle, setEditTitle] = useState<"Add" | "Edit">("Add");
  const [detailInfo, setDetailInfo] = useState<SysUser>({} as SysUser);

  // Dom加载完成后获取表单数据
  useEffect(() => {
    loadDataWithPagination(paginationParams);
  }, []);

  // 加载数据
  const loadDataWithPagination = async (pagination: TablePaginationConfig) => {
    // 显示加载中...
    setLoading(true);
    // 构建查询参数
    const queryParams = {
      ...queryForm.getFieldsValue(),
      pageNum: pagination.current,
      pageSize: pagination.pageSize,
    };
    // 调用接口获取数据
    const result = await getUserListService(queryParams);
    // 设置数据源
    setDataSource(result.data.records);
    // 设置分页参数
    setPaginationParams({
      ...pagination,
      total: result.data.total,
    });
    // 隐藏加载中...
    setLoading(false);
  };

  // 重置功能
  const onReset = () => {
    queryForm.resetFields();
    loadDataWithPagination(paginationParams);
  };

  // 查询功能
  const onFinish = () => {
    loadDataWithPagination(paginationParams);
  };

  // 新增功能
  const handleAdd = () => {
    // 显示新增
    setEditTitle("Add");
    // 显示模态框
    setIsEditOpen(true);
    // 清空表单数据
    setDetailInfo({} as SysUser);
  };

  // 编辑功能
  const handleEdit = (rowData: SysUser) => {
    // 显示编辑
    setEditTitle("Edit");
    // 显示模态框
    setIsEditOpen(true);
    // 填充表单数据
    setDetailInfo(rowData);
  };

  // 删除功能
  const handleDel = async (rowData: SysUser) => {
    // 显示加载中
    setLoading(true);
    // 调用接口删除数据
    await deleteUserService(rowData.id);
    // 重新加载数据
    loadDataWithPagination(paginationParams);
    // 提示删除成功
    message.success("删除成功");
    // 隐藏加载中
    setLoading(false);
  };

  // 重新加载数据
  const reloadData = () => {
    loadDataWithPagination(paginationParams);
  };

  /**
   * 分页、排序、筛选变化时触发
   * @param pagination 分页参数
   */
  const handleTableChange = (pagination: TablePaginationConfig) => {
    loadDataWithPagination(pagination);
  };

  const columns: TableProps<SysUser>["columns"] = [
    {
      title: "姓名",
      dataIndex: "username",
      width: 150,
    },
    {
      title: "昵称",
      dataIndex: "nickname",
      width: 150,
    },
    {
      title: "性别",
      dataIndex: "sex",
      width: 150,
      render: (sex: number) => {
        const { color, text } = getSexDisplay(sex);
        return (
          <Tag color={color} bordered={false}>
            {text}
          </Tag>
        );
      },
    },
    {
      title: "头像",
      dataIndex: "avatar",
      width: 150,
      ellipsis: true,
    },
    {
      title: "状态",
      dataIndex: "status",
      render: (state: number) => {
        const { text, color } = getUserStateDisplay(state);
        return <Tag color={color}>{text}</Tag>;
      },
      width: 150,
    },
    {
      title: "创建时间",
      dataIndex: "createTime",
      width: 250,
      render: (updateTime: string) => {
        return formatStringDate(updateTime);
      },
    },
    {
      title: "修改时间",
      dataIndex: "updateTime",
      width: 250,
      render: (updateTime: string) => {
        return formatStringDate(updateTime);
      },
    },
    {
      title: "操作",
      width: 150,
      render: (rowData: SysUser) => {
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
        <Form.Item label="用户名" name="username">
          <Input style={{ width: 200 }} />
        </Form.Item>
        <Form.Item label="状态" name="status">
          <UserStatusSelect style={{ width: 150 }} />
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
        <Table<SysUser>
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
export default User;
