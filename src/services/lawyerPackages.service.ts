import axiosInstance from "@/api/axios";
import type {
  CleanupResponse,
  CreateLawyerPackageDto,
  lawyerPackage,
  LawyerPackagesQueryParams,
  UpdateLawyerPackageDto,
  ApiResponse,
  Subscription,
  SubscriptionHistoryQueryParams,
} from "@/types/types";

export const lawyerPackagesApi = {
  create: async (data: CreateLawyerPackageDto): Promise<lawyerPackage> => {
    const response = await axiosInstance.post(
      "/lawyer-packages",
      data
    );
    return response.data.response;
  },

  getAll: async (
    params?: LawyerPackagesQueryParams
  ): Promise<ApiResponse<lawyerPackage>> => {
    const response = await axiosInstance.get(
      "/lawyer-packages",
      {
        params: {
          search: params?.search,
          limit: params?.limit || 10,
          page: params?.page || 1,
        },
      }
    );
    return response.data.response;
  },

  getById: async (id: string): Promise<lawyerPackage> => {
    const response = await axiosInstance.get("/lawyer-packages/item", {
      params: { id },
    });
    return response.data.response;
  },

  update: async (
    id: string,
    data: UpdateLawyerPackageDto
  ): Promise<lawyerPackage> => {
    const response = await axiosInstance.patch(
      "/lawyer-packages/item",
      data,
      { params: { id } }
    );
    return response.data.response;
  },

  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete("/lawyer-packages/item", {
      params: { id },
    });
  },
  cleanupExpiredSubscriptions: async (): Promise<CleanupResponse> => {
    const response = await axiosInstance.post<CleanupResponse>(
      "/lawyer-packages/subscriptions/cleanup"
    );
    return response.data;
  },
  getSubscriptionHistory: async (
    params?: SubscriptionHistoryQueryParams
  ): Promise<ApiResponse<Subscription>> => {
    const response = await axiosInstance.get(
      "/lawyer-packages/subscriptions/history",
      {
        params: {
          search: params?.search,
          limit: params?.limit || 10,
          page: params?.page || 1,
        },
      }
    );
    return response.data.response;
  },
};
