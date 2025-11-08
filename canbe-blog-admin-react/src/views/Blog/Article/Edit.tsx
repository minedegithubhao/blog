import { saveArticleService } from "@/api/article";
import CardUpload from "@/components/Common/CardUpload";
import type { UploadFile } from "antd";
import { Form, Input, message, Modal, Radio } from "antd";
import { MdEditor } from "md-editor-rt";
import "md-editor-rt/lib/style.css";
import React, { useEffect } from "react";
import CategorySelect from "@/views/Blog/Category/CategorySelect";

interface EditProps {
  isEditOpen: boolean;
  editTitle: string;
  changeEditOpen: (value: boolean) => void;
  detailInfo: SysArticle;
  reloadData: () => void;
}

const Edit: React.FC<EditProps> = ({
  isEditOpen,
  changeEditOpen,
  editTitle,
  detailInfo,
  reloadData,
}) => {
  const [editForm] = Form.useForm();

  useEffect(() => {
    if (editTitle === "Edit") {
      editForm.setFieldsValue(detailInfo);
    } else {
      editForm.resetFields();
    }
  }, [isEditOpen]);

  /**
   * 保存功能
   */
  const handleOk = async (): Promise<void> => {
    try {
      // 先进行表单校验
      const values = await editForm.validateFields();

      // 校验通过后保存文章
      await saveArticleService(values);
      message.success("保存成功");

      // 关闭编辑窗口
      changeEditOpen(false);
      // 刷新列表页面
      reloadData();
    } catch (error) {
      console.log('error',error)
      // 校验失败或保存失败的处理
      message.error("表单校验失败，请输入必输内容");
    }
  };

  /**
   * 取消功能
   */
  const handleCancel = () => {
    changeEditOpen(false);
  };

  /**
   * 上传成功回调
   */
  const uploadAction = (file: UploadFile) => {
    editForm.setFieldValue("cover", file.response.data);
  };

  return (
    <Modal
      title={editTitle === "Edit" ? "编辑" : "新增"}
      open={isEditOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      okText="保存"
      cancelText="取消"
      centered
      width={1200}
    >
      <Form
        labelCol={{ span: 2 }}
        wrapperCol={{ span: 22 }}
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
          label="文章标题"
          name="title"
          rules={[{ required: true, message: "请输入文章标题" }]}
        >
          <Input placeholder="请输入文章标题" />
        </Form.Item>
        <Form.Item
          label="文章封面"
          name="cover"
          rules={[{ required: true, message: "请输入文章封面" }]}
        >
          <CardUpload
            action="/public/upload"
            fileMaxNum={1}
            uploadAction={uploadAction}
            initCover={detailInfo.cover}
          />
        </Form.Item>
        <Form.Item
          label="文章简介"
          name="summary"
          rules={[{ required: true, message: "请输入文章简介" }]}
        >
          <Input placeholder="请输入文章简介" />
        </Form.Item>
        <Form.Item label="文章分类" name="categoryId" rules={[{ required: true, message: "请选择文章分类" }]}>
          <CategorySelect placeholder="请选择文章分类"/>
        </Form.Item>
        <Form.Item label="状态" name="status">
          <Radio.Group>
            <Radio value={0}>发布</Radio>
            <Radio value={1}>草稿</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="文章内容" name="contentMd" rules={[{ required: true, message: "请输入文章内容" }]}>
          <MdEditor style={{ height: "400px" }} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default Edit;
