import React from "react";
import { Modal, Radio, Form, Input, message } from "antd";
import { saveCategoryService } from "@/api/category";

interface EditProps {
  isEditOpen: boolean;
  editTitle: string;
  changeEditOpen: (value: boolean) => void;
  detailInfo: SysCategory;
  reloadData: () => void;
}
const Edit: React.FC<EditProps> = ({
  isEditOpen,
  editTitle,
  changeEditOpen,
  detailInfo,
  reloadData,
}) => {
  React.useEffect(() => {
    if (editTitle === "Edit") {
      // 当是编辑时，将文章信息填充到表单中
      editForm.setFieldsValue(detailInfo);
    } else {
      // 当是新增时，将表单清空
      editForm.resetFields();
    }
  }, [editTitle, detailInfo]);

  const [editForm] = Form.useForm();

  const handleOk = async () => {
    try {
      // 先进行表单校验
      const values = await editForm.validateFields();
      // 校验通过后保存文章
      await saveCategoryService(values);
      message.success("保存成功");
      // 关闭编辑窗口
      changeEditOpen(false);
      // 刷新列表页面
      reloadData();
    } catch (error) {
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
            label="分类名称"
            name="name"
            rules={[{ required: true, message: "请输入分类名称" }]}
          >
            <Input placeholder="请输入分类名称" />
          </Form.Item>
          <Form.Item label="排序" name="sort">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Edit;
