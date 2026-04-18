import { usePagination } from "@/hooks/usePagination";
import type { ApiResponse } from "@/types/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ISpecializations, ISpecializationsFormData } from "./types";
import {
  createSpecializations,
  getSpecializations,
  updateSpecializations,
  deleteSpecializations,
} from "@/services/specializations";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

export const useSpecializations = () => {
  const { currentLimit, currentPage, currentSearch } = usePagination();

  const params = {
    page: currentPage,
    limit: currentLimit,
    search: currentSearch,
  };

  return useQuery<ApiResponse<ISpecializations[]>>({
    queryKey: ["specializations", currentPage, currentLimit, currentSearch],
    queryFn: () => getSpecializations(params),
    staleTime: 5 * 60 * 1000,
    placeholderData: (prev) => prev,
  });
};

export const useCreateSpecializations = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (data: ISpecializationsFormData) => createSpecializations(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["specializations"] });
      toast.success(t("toasts.success.specializationsSaved"));
    },
    onError: (error) => {
      console.error("Error creating case category:", error);
      toast.error(t("toasts.error.createFailed"));
    },
  });
};
export const useUpdateSpecializations = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ISpecializationsFormData }) =>
      updateSpecializations(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["specializations"] });
      toast.success(t("toasts.success.specializationsUpdated"));
    },
    onError: (error) => {
      console.error("Error updating specialization:", error);
      toast.error(t("toasts.error.updateFailed"));
    },
  });
};

export const useDeleteSpecializations = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (id: string) => deleteSpecializations(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["specializations"] });
      toast.success(t("toasts.success.specializationsDeleted"));
    },
    onError: (error) => {
      console.error("Error deleting specialization:", error);
      toast.error(t("toasts.error.deleteFailed"));
    },
  });
};
