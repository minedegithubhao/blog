import { dictDataDeleteService, dictDataPageService } from "@/api/dictData";
import TableActions from "@/components/Common/TableActions";
import { usePagination } from "@/hooks/usePagination";
import { rowClassName } from "@/utils/common";
import { FORMAT_DATE_TIME, formateDateTime } from "@/utils/time";
import type { GetProp, TableProps } from "antd";
import { Button, Divider, Form, Input, Space, Table, message } from "antd";
import React, { useEffect, useState } from "react";
import Edit from "./Edit";
type TablePaginationConfig = Exclude<
  GetProp<TableProps, "pagination">,
  boolean
>;

interface DictLayoutProps {
  currSysDict: SysDict;
}

const DictLayout: React.FC<DictLayoutProps> = ({ currSysDict }) => {
  const [queryForm] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const [dataSource, setDataSource] = useState<SysDictData[]>([]);
  const { paginationParams, setPaginationParams } = usePagination();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editTitle, setEditTitle] = useState<"Add" | "Edit">("Add");
  const [detailInfo, setDetailInfo] = useState<SysDictData>({} as SysDictData);

  useEffect(() => {
    queryForm.setFieldValue("dictId", currSysDict.id);
    loadDataWithPagination(paginationParams);
  }, [currSysDict]);

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
    const result = await dictDataPageService(queryParams);
    setDataSource(result.data.records);
    // 修改分页参数
    setPaginationParams({
      ...pagination,
      total: result.data.total,
    });
    // 显示加载中...
    setLoading(false);
  };

  /**
   * 分页、排序、筛选变化时触发
   * @param pagination 分页参数
   */
  const handleTableChange = (pagination: TablePaginationConfig) => {
    loadDataWithPagination(pagination);
  };

  /**
   * 列表查询功能(提交表单且数据验证成功后执行)
   */
  const onFinish = () => {
    loadDataWithPagination(paginationParams);
  };

  /**
   * 重置功能
   */
  const onReset = () => {
    queryForm.resetFields();
    loadDataWithPagination(paginationParams);
  };

  /**
   * 新增功能
   */
  const handleAdd = () => {
    setIsEditOpen(true);
    setEditTitle("Add");
    setDetailInfo({} as SysDictData);
  };

  /**
   * 修改功能
   * @param rowData 分类数据
   */
  const handleEdit = (rowData: SysDictData) => {
    setIsEditOpen(true);
    setEditTitle("Edit");
    setDetailInfo(rowData);
  };

  /**
   * 删除功能
   * @param rowData 分类数据
   */
  const handleDel = async (rowData: SysDictData) => {
    // 展示加载中
    setLoading(true);
    // 调用接口删除数据
    await dictDataDeleteService(rowData.id);
    // 重新加载数据
    loadDataWithPagination(paginationParams);
    // 提示删除成功
    message.success("删除成功");
    // 隐藏加载中
    setLoading(false);
  };

  /**
   * 重新加载数据
   */
  const reloadData = () => {
    loadDataWithPagination(paginationParams);
  };

  const columns: TableProps<SysDictData>["columns"] = [
    {
      title: "字典标签",
      dataIndex: "label",
      align: "center",
      width: 150,
    },
    {
      title: "字典键值",
      dataIndex: "value",
      align: "center",
      width: 150,
    },
    {
      title: "字典排序",
      dataIndex: "sort",
      align: "center",
      width: 250,
    },
    {
      title: "备注",
      dataIndex: "remark",
      align: "center",
      width: 250,
    },
    {
      title: "状态",
      dataIndex: "status",
      align: "center",
      width: 150,
    },
    {
      title: "操作",
      width: 150,
      align: "center",
      render: (rowData: SysDictData) => {
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
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Form
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        layout="inline"
        form={queryForm}
        name="queryForm"
        onFinish={onFinish}
      >
        <Form.Item label="字典标签" name="label">
          <Input style={{ width: 200 }} />
        </Form.Item>
        <Form.Item label="字典标签" name="dictId" hidden>
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
        <div style={{ flex: 1, overflow: "auto" }}>
          <Table<SysDictData>
            rowKey="id"
            loading={loading}
            dataSource={dataSource}
            pagination={paginationParams}
            onChange={handleTableChange}
            rowClassName={rowClassName}
            columns={columns}
          />
        </div>
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

export default DictLayout;
