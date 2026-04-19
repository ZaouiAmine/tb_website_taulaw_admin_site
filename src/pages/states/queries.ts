import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { usePagination } from "@/hooks/usePagination";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import {
  getStates,
  createState,
  updateState,
  deleteState,
} from "@/services/states";
import type { ApiResponse } from "@/types/types";
import type { State } from "@/types/types";

type StateFormType = {
  nameAr: string;
  nameEn: string;
  nameFr: string;
};

export const useStates = () => {
  const { currentPage, currentLimit, currentSearch } = usePagination();

  const params = {
    page: currentPage,
    limit: currentLimit,
    search: currentSearch,
  };

  return useQuery<ApiResponse<State[]>>({
    queryKey: ["states", currentPage, currentLimit, currentSearch],
    queryFn: () => getStates(params),
    staleTime: 5 * 60 * 1000,
    placeholderData: (previousData) => previousData,
  });
};

export const useCreateState = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (data: StateFormType) => createState(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["states"] });
      toast.success(t("toasts.success.stateSaved"));
    },
    onError: (error) => {
      console.error("Error creating state:", error);
      toast.error(t("toasts.error.createFailed"));
    },
  });
};

export const useUpdateState = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: StateFormType }) =>
      updateState(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["states"] });
      toast.success(t("toasts.success.updateSuccess"));
    },
    onError: (error) => {
      console.error("Error updating state:", error);
      toast.error(t("toasts.error.updateFailed"));
    },
  });
};

export const useDeleteState = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (id: string) => deleteState(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["states"] });
      toast.success(t("toasts.success.deleteSuccess"));
    },
    onError: (error) => {
      console.error("Error deleting state:", error);
      toast.error(t("toasts.error.deleteFailed"));
    },
  });
};
