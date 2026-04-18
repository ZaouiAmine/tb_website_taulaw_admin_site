import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getConsultationPackages,
  getConsultationPackage,
  createConsultationPackage,
  updateConsultationPackage,
  deleteConsultationPackage,
} from "@/api/consultationPackages";
import type { ConsultationPackageFormData, ConsultationPackage } from "@/types/types";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

export const consultationPackageKeys = {
  all: ["consultationPackages"] as const,
  lists: () => [...consultationPackageKeys.all, "list"] as const,
  list: (params: any) => [...consultationPackageKeys.lists(), params] as const,
  details: () => [...consultationPackageKeys.all, "detail"] as const,
  detail: (id: string) => [...consultationPackageKeys.details(), id] as const,
};

export const useConsultationPackages = (params: {
  page?: number;
  limit?: number;
  name?: string;
  minPrice?: number;
  maxPrice?: number;
} = {}) => {
  return useQuery({
    queryKey: consultationPackageKeys.list(params),
    queryFn: () => getConsultationPackages(params),
    placeholderData: (previousData) => previousData,
  });
};

export const useConsultationPackage = (id: string) => {
  return useQuery({
    queryKey: consultationPackageKeys.detail(id),
    queryFn: () => getConsultationPackage(id),
    enabled: !!id,
  });
};

export const useCreateConsultationPackage = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (packageData: ConsultationPackageFormData) => {
      return createConsultationPackage(packageData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: consultationPackageKeys.lists() });
      toast.success(t("toasts.success.consultationPackageSaved"));
    },
    onError: () => {
      toast.error(t("toasts.error.createFailed"));
    },
  });
};

export const useUpdateConsultationPackage = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ConsultationPackageFormData }) => {
      return updateConsultationPackage(id, data);
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: consultationPackageKeys.lists() });
      queryClient.invalidateQueries({ queryKey: consultationPackageKeys.detail(id) });
      toast.success(t("toasts.success.consultationPackageUpdated"));
    },
    onError: () => {
      toast.error(t("toasts.error.updateFailed"));
    },
  });
};

export const useDeleteConsultationPackage = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (id: string) => deleteConsultationPackage(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: consultationPackageKeys.all });
      queryClient.setQueryData(consultationPackageKeys.lists(), (oldData: any) => {
        if (!oldData?.data) return oldData;
        return {
          ...oldData,
          data: oldData.data.filter((pkg: ConsultationPackage) => pkg.id !== id),
        };
      });
      toast.success(t("toasts.success.consultationPackageDeleted"));
    },
    onError: () => {
      toast.error(t("toasts.error.deleteFailed"));
    },
  });
};
