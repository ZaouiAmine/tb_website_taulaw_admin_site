import axiosInstance from "@/api/axios";
import type { LawyerRequest } from "@/pages/requests/types";
import type { ApiResponse, SearchParams } from "@/types/types";

export const getLawyerRequests = async ({
  page,
  limit,
  search,
}: SearchParams): Promise<ApiResponse<LawyerRequest>> => {
  const response = await axiosInstance.get("/users-lawyers/lawyers", {
    params: {
      page,
      limit,
      search,
    },
  });
  return response.data.response || [];
};
