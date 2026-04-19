import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getBanners, getBanner, createBanner, updateBanner, deleteBanner } from "@/api/banners";
import type { BannerFormData, Banner } from "@/types/types";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

export const bannerKeys = {
  all: ['banners'] as const,
  lists: () => [...bannerKeys.all, 'list'] as const,
  list: (params: any) => [...bannerKeys.lists(), params] as const,
  details: () => [...bannerKeys.all, 'detail'] as const,
  detail: (id: string) => [...bannerKeys.details(), id] as const,
};

export const useBanners = (params: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
} = {}) => {
  return useQuery({
    queryKey: bannerKeys.list(params),
    queryFn: () => getBanners(params),
    placeholderData: (previousData) => previousData,
  });
};

export const useBanner = (id: string) => {
  return useQuery({
    queryKey: bannerKeys.detail(id),
    queryFn: () => getBanner(id),
    enabled: !!id,
  });
};

export const useCreateBanner = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (bannerData: BannerFormData) => {
      if (!bannerData.image) {
        throw new Error("Image is required");
      }
      return createBanner({
        image: bannerData.image,
        link: bannerData.link,
        status: bannerData.status,
        type: bannerData.type,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bannerKeys.lists() });
      toast.success(t("toasts.success.bannerSaved"));
    },
    onError: () => {
      toast.error(t("toasts.error.createFailed"));
    },
  });
};

export const useUpdateBanner = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: BannerFormData }) => {
      const updateData: any = {
        link: data.link,
        status: data.status,
        type: data.type,
      };
      
      if (data.image) {
        updateData.image = data.image;
      }
      
      return updateBanner(id, updateData);
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: bannerKeys.lists() });
      queryClient.invalidateQueries({ queryKey: bannerKeys.detail(id) });
      toast.success(t("toasts.success.bannerUpdated"));
    },
    onError: () => {
      toast.error(t("toasts.error.updateFailed"));
    },
  });
};

export const useDeleteBanner = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (id: string) => deleteBanner(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: bannerKeys.all });
      queryClient.setQueryData(bannerKeys.lists(), (oldData: any) => {
        if (!oldData?.data) return oldData;
        return {
          ...oldData,
          data: oldData.data.filter((banner: Banner) => banner.id !== id)
        };
      });
      toast.success(t("toasts.success.bannerDeleted"));
    },
    onError: () => {
      toast.error(t("toasts.error.deleteFailed"));
    },
  });
};
