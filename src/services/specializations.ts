import axiosInstance from "@/api/axios";
import type { ISpecializations } from "@/pages/specializations/types";
import type { ApiResponse, SearchParams } from "@/types/types";

export interface ICreateSpecializations {
  nameAr: string;
  nameEn: string;
  nameFr: string;
}

export interface IUpdateSpecializations {
  nameAr: string;
  nameEn: string;
  nameFr: string;
}

export const getSpecializations = async ({
  page,
  limit,
  search,
}: SearchParams): Promise<ApiResponse<ISpecializations[]>> => {
  const response = await axiosInstance.get("/specializations/index", {
    params: {
      page,
      limit,
      search,
    },
  });
  console.log(response);
  return response.data.response || [];
};

export const createSpecializations = async (
  data: ICreateSpecializations
): Promise<void> => {
  try {
    await axiosInstance.post("/specializations/store", data);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateSpecializations = async (
  id: string,
  data: IUpdateSpecializations
): Promise<void> => {
  try {
    await axiosInstance.patch("/specializations/update", data, {
      params: { id },
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteSpecializations = async (id: string): Promise<void> => {
  try {
    await axiosInstance.delete("/specializations/delete", {
      params: { id },
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
};
