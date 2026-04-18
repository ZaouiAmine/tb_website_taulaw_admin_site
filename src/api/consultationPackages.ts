import axiosInstance from "./axios";
import type { ConsultationPackage, ApiResponse } from "@/types/types";

export interface ConsultationPackageParams {
  page?: number;
  limit?: number;
  name?: string;
  minPrice?: number;
  maxPrice?: number;
}

export interface CreateConsultationPackageData {
  name: string;
  numberOfConsultations: number;
  price: number;
  isActive?: boolean;
}

export interface UpdateConsultationPackageData {
  name?: string;
  numberOfConsultations?: number;
  price?: number;
  isActive?: boolean;
}

export const getConsultationPackages = async (
  params: ConsultationPackageParams = {}
): Promise<ApiResponse<ConsultationPackage>> => {
  const response = await axiosInstance.get("/consultation-packages", { params });
  console.log("API: Get consultation packages response:", response.data);
  return response.data.response || [];
};

export const getConsultationPackage = async (id: string): Promise<ConsultationPackage> => {
  const response = await axiosInstance.get(`/consultation-packages/${id}`);
  return response.data.response;
};

export const createConsultationPackage = async (
  data: CreateConsultationPackageData
): Promise<void> => {
  await axiosInstance.post("/consultation-packages", data);
};

export const updateConsultationPackage = async (
  id: string,
  data: UpdateConsultationPackageData
): Promise<void> => {
  await axiosInstance.patch(`/consultation-packages/${id}`, data);
};

export const deleteConsultationPackage = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/consultation-packages/${id}`);
};
