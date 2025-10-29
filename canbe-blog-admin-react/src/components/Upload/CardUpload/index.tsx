import { PlusOutlined } from "@ant-design/icons";
import type { GetProp, UploadFile, UploadProps } from "antd";
import { Image, message, Upload } from "antd";
import React, { useState, useEffect } from "react";
import { deleteFileService } from "@/api/file";

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

interface CardUploadProps {
  // 上传接口地址
  action: string;
  // 最大上传文件数量
  fileMaxNum: number;
  // 上传成功回调
  uploadAction: (file: UploadFile) => void;
  // 初始文件列表
  initCover?: string;
}

const CardUpload: React.FC<CardUploadProps> = ({
  action,
  fileMaxNum,
  uploadAction,
  initCover,
}) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  // 处理初始值回显
  useEffect(() => {
    console.log("initCover", initCover);
    if (initCover) {
      const file: UploadFile = {
        uid: "-1",
        name: initCover,
        status: "done",
        url: `/file/download/${initCover}`,
      };
      setFileList([file]);
      setPreviewImage(initCover);
    } else {
      setFileList([]);
      setPreviewImage("");
    }
  }, [initCover]);

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleChange: UploadProps["onChange"] = ({
    fileList: newFileList,
    file,
  }) => {
    // 确保状态是最新的
    const updatedFileList = [...newFileList];
    setFileList(updatedFileList);

    // 当文件状态为done时，获取thumbUrl并调用回调方法
    if (file.status === "done") {
      uploadAction(file);
    } else if (file.status === "error") {
      message.error("上传失败:", file.error);
    }
  };

  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>上传</div>
    </button>
  );
  return (
    <>
      <Upload
        action={action}
        listType="picture-card"
        fileList={fileList}
        onPreview={handlePreview}
        onChange={handleChange}
        // onRemove={handleRemove}
      >
        {fileList.length >= fileMaxNum ? null : uploadButton}
      </Upload>
      {previewImage && (
        <Image
          wrapperStyle={{ display: "none" }}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPreviewImage(""),
          }}
          src={previewImage}
        />
      )}
    </>
  );
};

export default CardUpload;
