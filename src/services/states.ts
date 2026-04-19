import axiosInstance from "@/api/axios";
import type { SearchParams } from "@/types/types";

export interface CreateStateRequest {
  nameAr: string;
  nameEn: string;
  nameFr: string;
}

export interface UpdateStateRequest {
  nameAr: string;
  nameEn: string;
  nameFr: string;
}

export const getStates = async ({ page, limit, search }: SearchParams) => {
  const response = await axiosInstance.get("/states/index", {
    params: {
      page,
      limit,
      search,
    },
  });

  return response.data.response;
};

export const createState = async (data: CreateStateRequest): Promise<void> => {
  const response = await axiosInstance.post("/states/store", data);
  return response.data;
};

export const updateState = async (id: string, data: UpdateStateRequest) => {
  const response = await axiosInstance.patch("/states/update", data, {
    params: { id },
  });
  return response.data;
};

export const deleteState = async (id: string) => {
  const response = await axiosInstance.delete("/states/delete", {
    params: { id },
  });
  return response.data;
};
