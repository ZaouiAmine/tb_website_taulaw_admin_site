import axiosInstance from "@/api/axios";

import type { SearchParams } from "@/types/types";

// ! Get Case Categories
export const getAllReports = async ({ page, limit, search }: SearchParams) => {
  const response = await axiosInstance.get("/admin/reports", {
    params: {
      page,
      limit,
      search,
    },
  });

  return response.data || [];
};

export const reportAction = async (data: {
  reportId: string;
  action: number;
  untilDate: any;
}) => {
  const response = await axiosInstance.post(`/admin/reports/action`, data);
  return response.data;
};
