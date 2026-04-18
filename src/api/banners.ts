import axiosInstance from "./axios";
import type { Banner, ApiResponse } from "@/types/types";

export interface BannerParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

export interface CreateBannerData {
  image: string; 
  link: string;
  status: "active";
  type: "lawyer" | "client";
}

export interface UpdateBannerData {
  image?: string; 
  link?: string;
  status?: "active";
  type?: "lawyer" | "client";
}

export const getBanners = async (params: BannerParams = {}): Promise<ApiResponse<Banner>> => {
  const response = await axiosInstance.get("/banners", { params });
  console.log("API: Get banners response:", response.data);
  return response.data.response || [];
};

export const getBanner = async (id: string): Promise<Banner> => {
  const response = await axiosInstance.get(`/banners/${id}`);
  return response.data.response;
};

export const createBanner = async (data: CreateBannerData): Promise<void> => {
  const formData = new FormData();
  
  const byteCharacters = atob(data.image);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: 'image/jpeg' });
  
  formData.append('image', blob, 'banner.jpg');
  formData.append('link', data.link);
  formData.append('status', data.status);
  formData.append('type', data.type);
  
  await axiosInstance.post("/banners", formData);
}

export const updateBanner = async (id: string, data: UpdateBannerData): Promise<void> => {
  if (data.image !== undefined) {
    const formData = new FormData();
    
    const byteCharacters = atob(data.image);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'image/jpeg' });
    
    formData.append('image', blob, 'banner.jpg');
    if (data.link !== undefined) {
      formData.append('link', data.link);
    }
    if (data.status !== undefined) {
      formData.append('status', data.status);
    }
    if (data.type !== undefined) {
      formData.append('type', data.type);
    }
    
    await axiosInstance.patch(`/banners/${id}`, formData);
  } else {
    const payload: any = {};
    if (data.link !== undefined) {
      payload.link = data.link;
    }
    if (data.status !== undefined) {
      payload.status = data.status;
    }
    if (data.type !== undefined) {
      payload.type = data.type;
    }
    await axiosInstance.patch(`/banners/${id}`, payload);
  }
};

export const deleteBanner = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/banners/${id}`);
};
