import { useState } from "react";
import type { TableProps } from "antd";
import type { GetProp } from "antd";

type TablePaginationConfig = Exclude<
  GetProp<TableProps<any>, "pagination">,
  boolean
>;

interface UsePaginationProps {
  defaultCurrent?: number;
  defaultPageSize?: number;
  pageSizeOptions?: string[];
}

/**
 * 自定义分页 Hook
 * @param props 分页配置参数
 * @returns 包含分页状态和相关处理函数的对象
 */
export const usePagination = (props: UsePaginationProps = {}) => {
  // 默认参数
  const {
    defaultCurrent = 1,
    defaultPageSize = 5,
    pageSizeOptions = ["5", "10", "30", "50"],
  } = props;

  const [paginationParams, setPaginationParams] =
    useState<TablePaginationConfig>({
      align: "center",
      pageSizeOptions,
      showSizeChanger: true,
      showQuickJumper: true,
      defaultCurrent,
      defaultPageSize,
      current: defaultCurrent,
      pageSize: defaultPageSize,
    });

  return {
    paginationParams,
    setPaginationParams,
  };
};
