import axiosInstance from "@/api/axios";
import type { SearchParams, ApiResponse } from "@/types/types";
import type { CasePhase } from "@/types/types";

export interface CreateCasePhaseRequest {
  nameAr: string;
  nameEn: string;
  nameFr: string;
}

export interface UpdateCasePhaseRequest {
  nameAr: string;
  nameEn: string;
  nameFr: string;
}

export const getCasePhases = async ({
  page,
  limit,
  search,
}: SearchParams): Promise<ApiResponse<CasePhase[]>> => {
  const response = await axiosInstance.get("/case-phases/index", {
    params: {
      page,
      limit,
      search,
    },
  });

  return response.data.response || [];
};

export const createCasePhase = async (
  data: CreateCasePhaseRequest
): Promise<void> => {
  try {
    await axiosInstance.post("/case-phases/store", data);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateCasePhase = async (
  id: string,
  data: UpdateCasePhaseRequest
): Promise<void> => {
  try {
    await axiosInstance.patch(`/case-phases/update/${id}`, data);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteCasePhase = async (id: string): Promise<void> => {
  try {
    await axiosInstance.delete(`/case-phases/delete/${id}`);
  } catch (error) {
    console.error(error);
    throw error;
  }
};
