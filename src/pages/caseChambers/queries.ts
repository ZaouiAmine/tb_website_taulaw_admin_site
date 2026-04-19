import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { usePagination } from "@/hooks/usePagination";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import {
  getCaseChambers,
  createCaseChamber,
  updateCaseChamber,
  deleteCaseChamber,
} from "@/services/caseChambers";
import type { ApiResponse } from "@/types/types";
import type { CaseChamber, CaseChamberFormData } from "./types";

export const useCaseChambers = () => {
  const { currentPage, currentLimit, currentSearch } = usePagination();

  const params = {
    page: currentPage,
    limit: currentLimit,
    search: currentSearch,
  };

  return useQuery<ApiResponse<CaseChamber[]>>({
    queryKey: ["caseChambers", currentPage, currentLimit, currentSearch],
    queryFn: () => getCaseChambers(params),
    staleTime: 5 * 60 * 1000,
    placeholderData: (previousData) => previousData,
  });
};

export const useCreateCaseChamber = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (data: CaseChamberFormData) => createCaseChamber(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["caseChambers"] });
      toast.success(t("toasts.success.caseChamberSaved"));
    },
    onError: (error) => {
      console.error("Error creating case category:", error);
      toast.error(t("toasts.error.createFailed"));
    },
  });
};

export const useUpdateCaseChamber = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CaseChamberFormData }) =>
      updateCaseChamber(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["caseChambers"] });
      toast.success(t("toasts.success.updateSuccess"));
    },
    onError: (error) => {
      console.error("Error creating case category:", error);
      toast.error(t("toasts.error.updateFailed"));
    },
  });
};

export const useDeleteCaseChamber = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (id: string) => deleteCaseChamber(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["caseChambers"] });
      toast.success(t("toasts.success.deleteSuccess"));
    },
    onError: (error) => {
      console.error("Error creating case category:", error);

      toast.error(t("toasts.error.deleteFailed"));
    },
  });
};
