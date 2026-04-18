import axiosInstance from "@/api/axios";
import type { SearchParams, ApiResponse } from "@/types/types";
import type { CaseChamber } from "@/pages/caseChambers/types";

export interface CreateCaseChamberRequest {
  nameAr: string;
  nameEn: string;
  nameFr: string;
}

export interface UpdateCaseChamberRequest {
  nameAr: string;
  nameEn: string;
  nameFr: string;
}

export const getCaseChambers = async ({
  page,
  limit,
  search,
}: SearchParams): Promise<ApiResponse<CaseChamber[]>> => {
  const response = await axiosInstance.get("/case-chambers/index", {
    params: {
      page,
      limit,
      search,
    },
  });

  return response.data.response || [];
};

export const createCaseChamber = async (
  data: CreateCaseChamberRequest
): Promise<void> => {
  try {
    await axiosInstance.post("/case-chambers/store", data);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateCaseChamber = async (
  id: string,
  data: UpdateCaseChamberRequest
): Promise<void> => {
  try {
    await axiosInstance.patch(`/case-chambers/update/${id}`, data);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteCaseChamber = async (id: string): Promise<void> => {
  try {
    await axiosInstance.delete(`/case-chambers/delete/${id}`);
  } catch (error) {
    console.error(error);
    throw error;
  }
};
