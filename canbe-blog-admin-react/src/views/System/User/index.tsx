import {
  Button,
  Divider,
  Form,
  Input,
  Space,
  Table,
  Tag,
  Popconfirm,
  message,
  Modal,
  Radio,
  DatePicker,
  Select,
} from "antd";
import React, { useState, useEffect } from "react";
import type { FormProps } from "antd";
import { getUserListService } from "@/api/user";
import { formatStringDate } from "@/utils/time";
import dayjs from "dayjs";
import {
  formLayout,
  queryFormLayout,
  getSexDisplay,
  getUserStateDisplay,
  getDelFlagDisplay,
  rowClassName,
} from "@/utils/common";

const User: React.FC = () => {
  // 表单
  const [queryForm] = Form.useForm();
  const [editForm] = Form.useForm();

  // Dom加载完成后获取表单数据
  useEffect(() => {
    getUserList(queryParams);
  }, []);

  // 查询条件
  const [queryParams, setQueryParams] = useState<UserQueryParams>({} as UserQueryParams);
  // 获取表单数据
  const [dataSource, setDataSource] = useState<SysUser[]>([]);
  const getUserList = async (queryParams: UserQueryParams) => {
    const result = await getUserListService(queryParams);
    const data = result.data.records as SysUser[];
    setDataSource(data);
  };

  const handleAdd = () => {
    setEditType("add");
    editForm.resetFields();
    showModal("add");
  };

  // 重置查询条件
  const onReset = () => {
    queryForm.resetFields();
  };

  const onFinish: FormProps<UserQueryParams>["onFinish"] = (values) => {
    setQueryParams(values);
    getUserList(values);
  };

  // 编辑表单提交处理
  const onEditFinish: FormProps<SysUser>["onFinish"] = (values) => {
    console.log("编辑/新增用户:", values);
    // 这里处理保存逻辑
    setIsEditOpen(false);
  };

  const handleEdit = (rowData: SysUser) => {
    setEditType("edit");
    showModal("edit");
    // 将字符串日期转换为date对象
    const formData = {
      ...rowData,
      createTime: rowData.createTime ? dayjs(rowData.createTime) : null,
      updateTime: rowData.updateTime ? dayjs(rowData.updateTime) : null,
    };
    editForm.setFieldsValue(formData);
  };

  const handleDel = (id: string) => {
    console.log("id", id);
    message.success("删除成功");
  };

  // 编辑弹窗
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editType, setEditType] = useState<"add" | "edit">("add");

  const showModal = (type: "add" | "edit" = "add") => {
    setEditType(type);
    setIsEditOpen(true);
  };
  const handleOk = () => {
    editForm.submit();
  };

  const handleCancel = () => {
    setIsEditOpen(false);
  };

  return (
    <div>
      <Form
        {...queryFormLayout}
        form={queryForm}
        name="userQuery"
        onFinish={onFinish}
      >
        <Form.Item label="用户名" name="username">
          <Input />
        </Form.Item>
        <Form.Item label="状态" name="status">
          <Input />
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
          dataSource={dataSource}
          rowClassName={rowClassName}
          columns={[
            {
              title: "姓名",
              dataIndex: "username",
            },
            {
              title: "昵称",
              dataIndex: "nickname",
            },
            {
              title: "性别",
              dataIndex: "sex",
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
            },
            {
              title: "角色",
              dataIndex: "role",
            },
            {
              title: "状态",
              dataIndex: "state",
              render: (state: number) => {
                return getUserStateDisplay(state);
              },
            },
            {
              title: "创建时间",
              dataIndex: "createTime",
              render: (updateTime: string) => {
                return formatStringDate(updateTime);
              },
            },
            {
              title: "修改时间",
              dataIndex: "updateTime",
              render: (updateTime: string) => {
                return formatStringDate(updateTime);
              },
            },
            {
              title: "是否删除",
              dataIndex: "delFlag",
              render: (delFlag: number) => {
                return getDelFlagDisplay(delFlag);
              },
            },
            {
              title: "操作",
              width: 150,
              render: (rowData: SysUser) => {
                return (
                  <Space>
                    <Button type="primary" onClick={() => handleEdit(rowData)}>
                      编辑
                    </Button>
                    <Popconfirm
                      title="提示"
                      description="请确认是否删除该记录？"
                      okText="是"
                      cancelText="否"
                      onConfirm={() => handleDel(rowData.id)}
                    >
                      <Button danger>删除</Button>
                    </Popconfirm>
                  </Space>
                );
              },
            },
          ]}
        />
      </Space>
      <Modal
        title={editType === "edit" ? "编辑" : "新增"}
        open={isEditOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="保存"
        cancelText="取消"
      >
        <Form
          {...formLayout}
          form={editForm}
          name="userEdit"
          onFinish={onEditFinish}
        >
          {/* 当编辑表单时，将id字段设置为隐藏字段 */}
          {editType === "edit" && <Form.Item name="id" hidden></Form.Item>}
          <Form.Item
            label="用户名"
            name="username"
            rules={[{ required: true, message: "请输入用户名" }]}
          >
            <Input placeholder="请输入用户名" />
          </Form.Item>
          <Form.Item
            label="昵称"
            name="nickname"
            rules={[{ required: true, message: "请输入昵称" }]}
          >
            <Input placeholder="请输入昵称" />
          </Form.Item>
          <Form.Item
            label="性别"
            name="sex"
            rules={[{ required: true, message: "请选择性别" }]}
          >
            <Select
              placeholder="请选择性别"
              options={[
                { value: 0, label: "男" },
                { value: 1, label: "女" },
                { value: 2, label: "未知" },
              ]}
            ></Select>
          </Form.Item>
          <Form.Item label="头像" name="avatar">
            <Input />
          </Form.Item>
          <Form.Item label="角色" name="role">
            <Input />
          </Form.Item>
          <Form.Item label="状态" name="state">
            <Radio.Group>
              <Radio value={1}>正常</Radio>
              <Radio value={2}>禁用</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="创建时间" name="createTime">
            <DatePicker placeholder="请选择创建时间" format={"YYYY/MM/DD"} />
          </Form.Item>
          <Form.Item label="修改时间" name="updateTime">
            <DatePicker placeholder="请选择修改时间" />
          </Form.Item>
          <Form.Item label="是否删除" name="delFlag">
            <Radio.Group>
              <Radio value={1}>已删除</Radio>
              <Radio value={2}>正常</Radio>
            </Radio.Group>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
export default User;
