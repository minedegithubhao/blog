import request from "@/utils/request";
export const deleteFileService = (fileName: string): Promise<Result> => {
  return request.delete(`/file/delete/${fileName}`);
};
