import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { usePagination } from "@/hooks/usePagination";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import {
  getCasePhases,
  createCasePhase,
  updateCasePhase,
  deleteCasePhase,
} from "@/services/casePhases";
import type { ApiResponse } from "@/types/types";
import type { CasePhase } from "@/types/types";

type CasePhaseFormType = {
  nameAr: string;
  nameEn: string;
  nameFr: string;
};

export const useCasePhases = () => {
  const { currentPage, currentLimit, currentSearch } = usePagination();

  const params = {
    page: currentPage,
    limit: currentLimit,
    search: currentSearch,
  };

  return useQuery<ApiResponse<CasePhase[]>>({
    queryKey: ["casePhases", currentPage, currentLimit, currentSearch],
    queryFn: () => getCasePhases(params),
    staleTime: 5 * 60 * 1000,
    placeholderData: (previousData) => previousData,
  });
};

export const useCreateCasePhase = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (data: CasePhaseFormType) => createCasePhase(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["casePhases"] });
      toast.success(t("toasts.success.casePhaseSaved"));
    },
    onError: (error) => {
      console.error("Error creating case category:", error);
      toast.error(t("toasts.error.createFailed"));
    },
  });
};

export const useUpdateCasePhase = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CasePhaseFormType }) =>
      updateCasePhase(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["casePhases"] });
      toast.success(t("toasts.success.updateSuccess"));
    },
    onError: (error) => {
      console.error("Error creating case category:", error);
      toast.error(t("toasts.error.updateFailed"));
    },
  });
};

export const useDeleteCasePhase = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (id: string) => deleteCasePhase(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["casePhases"] });
      toast.success(t("toasts.success.deleteSuccess"));
    },
    onError: (error) => {
      console.error("Error creating case category:", error);
      toast.error(t("toasts.error.deleteFailed"));
    },
  });
};
