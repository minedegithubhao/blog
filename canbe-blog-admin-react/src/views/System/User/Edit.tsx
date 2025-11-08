import { saveUserService } from "@/api/user";
import { Form, Input, message, Modal } from "antd";
import React from "react";
import SexRadio from "./SexRadio";
import UserStatusRadio from "./UserStatusRadio";

interface EditProps {
  isEditOpen: boolean;
  editTitle: string;
  changeEditOpen: (value: boolean) => void;
  detailInfo: SysUser;
  reloadData: () => void;
}
const Edit: React.FC<EditProps> = ({
  isEditOpen,
  editTitle,
  changeEditOpen,
  detailInfo,
  reloadData,
}) => {
  const [editForm] = Form.useForm();

  React.useEffect(() => {
    if (editTitle === "Edit") {
      // 当是编辑时，将文章信息填充到表单中
      editForm.setFieldsValue(detailInfo);
    } else {
      // 当是新增时，将表单清空
      editForm.resetFields();
    }
  }, [isEditOpen]);

  const handleOk = async () => {
    try {
      // 先进行表单校验
      const values = await editForm.validateFields();
      // 校验通过后保存文章
      await saveUserService(values);
      message.success("保存成功");
      // 关闭编辑窗口
      changeEditOpen(false);
      // 刷新列表页面
      reloadData();
    } catch {
      // 表单校验失败
      message.error("表单校验失败，请输入必输内容");
    }
  };

  const handleCancel = () => {
    // 关闭编辑窗口
    changeEditOpen(false);
  };

  return (
    <div>
      <Modal
        title={editTitle === "Edit" ? "编辑" : "新增"}
        open={isEditOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="保存"
        cancelText="取消"
        centered
      >
        <Form
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
          form={editForm}
          name="editForm"
        >
          {/* 当编辑表单时，将id字段设置为隐藏字段 */}
          {editTitle === "Edit" && (
            <Form.Item name="id" hidden>
              <Input />
            </Form.Item>
          )}
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
            <SexRadio />
          </Form.Item>
          <Form.Item label="头像" name="avatar">
            <Input />
          </Form.Item>
          <Form.Item label="状态" name="status">
            <UserStatusRadio />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Edit;
