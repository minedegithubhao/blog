import { categoryPageService, deleteCategoryService } from "@/api/category";
import { usePagination } from "@/hooks/usePagination";
import { queryFormLayout, tableCommonProps } from "@/utils/common";
import { FORMAT_DATE_TIME, formateDateTime } from "@/utils/time";
import type { GetProp, TableProps } from "antd";
import {
  Button,
  Divider,
  Form,
  Input,
  Popconfirm,
  Space,
  Table,
  message,
} from "antd";
import React, { useEffect, useState } from "react";
import Edit from "./Edit";
type TablePaginationConfig = Exclude<
  GetProp<TableProps, "pagination">,
  boolean
>;

const Category: React.FC = () => {
  const [queryForm] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const [dataSource, setDataSource] = useState<SysCategory[]>([]);
  const { paginationParams, setPaginationParams } = usePagination();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editTitle, setEditTitle] = useState<"Add" | "Edit">("Add");
  const [detailInfo, setDetailInfo] = useState<SysCategory>({} as SysCategory);

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
    const result = await categoryPageService(queryParams);
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
    setDetailInfo({} as SysCategory);
  };

  /**
   * 修改功能
   * @param rowData 分类数据
   */
  const handleEdit = (rowData: SysCategory) => {
    setIsEditOpen(true);
    setEditTitle("Edit");
    setDetailInfo(rowData);
  };

  /**
   * 删除功能
   * @param id 分类ID
   */
  const handleDel = async (id: number) => {
    await deleteCategoryService(id);
    reloadData();
    message.success("删除成功");
  };

  /**
   * 重新加载数据
   */
  const reloadData = () => {
    loadDataWithPagination(paginationParams);
  };

  const columns: TableProps<SysCategory>["columns"] = [
    {
      title: "分类名称",
      dataIndex: "name",
      align:"center"
    },
    {
      title: "排序",
      dataIndex: "sort",
      align:"center",
      width: 250,
    },
    {
      title: "创建时间",
      dataIndex: "createTime",
      align:"center",
      width: 250,
      render: (createTime: string) =>
        formateDateTime(createTime, FORMAT_DATE_TIME),
    },
    {
      title: "更新时间",
      dataIndex: "updateTime",
      align:"center",
      width: 250,
      render: (updateTime: string) =>
        formateDateTime(updateTime, FORMAT_DATE_TIME),
    },
    {
      title: "操作",
      width: 150,
      align:"center",
      render: (rowData: SysCategory) => {
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
  ];

  return (
    <div>
      <Form
        {...queryFormLayout}
        form={queryForm}
        name="queryForm"
        onFinish={onFinish}
      >
        <Form.Item label="分类名称" name="name">
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
        <Table<SysCategory>
          {...tableCommonProps}
          loading={loading}
          dataSource={dataSource}
          pagination={paginationParams}
          onChange={handleTableChange}
          columns={columns}
          // rowSelection={{align:"center"}}
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

export default Category;
