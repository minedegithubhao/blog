import { deleteArticleService, getArtilePageService } from "@/api/article";
import { usePagination } from "@/hooks/usePagination";
import {
  getUserStateDisplay,
  queryFormLayout,
  tableCommonProps,
} from "@/utils/common";
import { FORMAT_DATE_TIME, formateDateTime } from "@/utils/time";
import Edit from "@/views/Blog/Article/Edit";
import CategorySelect from "@/views/Blog/Category/CategorySelect";
import type { GetProp, TableProps } from "antd";
import { Button, Divider, Form, Input, Popconfirm, Space, Table } from "antd";
import React, { useEffect, useState } from "react";
import "./article.less";

type TablePaginationConfig = Exclude<
  GetProp<TableProps, "pagination">,
  boolean
>;

const Arcitle: React.FC = () => {
  const [queryForm] = Form.useForm();
  const [dataSource, setDataSource] = useState<SysArticle[]>([]);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editTitle, setEditTitle] = useState<"Add" | "Edit">("Add");
  const [detailInfo, setDetailInfo] = useState<SysArticle>({} as SysArticle);
  // 表格加载中...
  const [loading, setLoading] = useState(false);
  const { paginationParams, setPaginationParams } = usePagination();

  useEffect(() => {
    // 挂载完成后，加载文章列表数据
    loadDataWithPagination(paginationParams);
  }, []);

  /**
   * 使用指定分页参数加载文章列表数据
   * @param pagination 分页参数
   */
  const loadDataWithPagination = async (pagination: TablePaginationConfig) => {
    console.log("queryForm.getFieldsValue()", queryForm.getFieldsValue());
    // 显示加载中...
    setLoading(true);
    // 构建查询参数
    const queryParams = {
      // 获取查询参数
      ...queryForm.getFieldsValue(),
      // 获取当前页码和每页条数，如果未指定，则使用默认值
      pageNum: pagination.current || pagination.defaultCurrent,
      pageSize: pagination.pageSize || pagination.defaultPageSize,
    };

    const result = await getArtilePageService(queryParams);
    setDataSource(result.data.records);
    // 修改分页参数
    setPaginationParams({
      ...pagination,
      total: result.data.total,
    });
    // 隐藏加载中...
    setLoading(false);
  };

  /**
   * 列表查询功能(提交表单且数据验证成功后执行)
   *
   */
  const onFinish = async () => {
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
    // 设置编辑标题为 '新增文章'
    setEditTitle("Add");
    // 展示编辑窗口
    setIsEditOpen(true);
    // 填充文章详情数据
    setDetailInfo({} as SysArticle);
  };

  /**
   * 修改功能
   * @param rowData 文章数据
   */
  const handleEdit = (rowData: SysArticle) => {
    // 设置编辑标题为 '编辑文章'
    setEditTitle("Edit");
    // 展示编辑窗口
    setIsEditOpen(true);
    // 填充文章详情数据
    setDetailInfo(rowData);
  };

  /**
   * 删除功能
   * @param id 文章id
   */
  const handleDel = async (id: number) => {
    await deleteArticleService(id);
    loadDataWithPagination(paginationParams);
  };

  /**
   * 分页、排序、筛选变化时触发
   * @param pagination 分页参数
   */
  const handleTableChange: TableProps<SysArticle>["onChange"] = (
    pagination
  ) => {
    loadDataWithPagination(pagination);
  };

  /**
   * 重新加载文章列表数据
   */
  const reloadData = async () => {
    loadDataWithPagination(paginationParams);
  };

  /**
   * 列表配置
   */
  const columns: TableProps<SysArticle>["columns"] = [
    {
      title: "封面",
      dataIndex: "cover",
      width: 200,
      align:"center",
      render: (cover: string) => (
        <div style={{ height: "50px" }}>
          <img
            src={`/public/download/${cover}`}
            alt="封面"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </div>
      ),
    },
    {
      title: "标题",
      dataIndex: "title",
      align:"center",
      ellipsis: true,
    },
    {
      title: "分类",
      dataIndex: "categoryName",
      align:"center",
      width: 150,
    },
    {
      title: "作者",
      dataIndex: "userId",
      align:"center",
      width: 150,
    },
    {
      title: "阅读量",
      dataIndex: "quantity",
      align:"center",
      width: 150,
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
      title: "状态",
      dataIndex: "status",
      align:"center",
      width: 150,
      render: (state: number) => {
        return getUserStateDisplay(state);
      },
    },
    {
      title: "操作",
      align:"center",
      width: 150,
      render: (rowData: SysArticle) => {
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
        <Form.Item label="文章标题" name="title">
          <Input style={{ width: 200 }} />
        </Form.Item>
        <Form.Item label="文章分类" name="categoryId">
          <CategorySelect style={{ width: 200 }} />
        </Form.Item>
        <Form.Item label="文章标签" name="tag">
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
        <Table<SysArticle>
          {...tableCommonProps}
          rowKey="id"
          loading={loading}
          dataSource={dataSource}
          pagination={paginationParams}
          onChange={handleTableChange}
          columns={columns}
        />
      </Space>
      <Edit
        isEditOpen={isEditOpen}
        changeEditOpen={setIsEditOpen}
        editTitle={editTitle}
        // articleDetail={JSON.parse(JSON.stringify(articleDetail))}
        detailInfo={detailInfo}
        reloadData={reloadData}
      />
    </div>
  );
};
export default Arcitle;
