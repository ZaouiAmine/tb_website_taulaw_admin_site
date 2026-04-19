import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { usePagination } from "@/hooks/usePagination";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import {
  getCaseCategories,
  createCaseCategory,
  updateCaseCategory,
  deleteCaseCategory,
} from "@/services/caseCategories";
import type { ApiResponse } from "@/types/types";
import type { CaseCategory, CaseCategoryBodyType } from "./types";

// ! Get Case Categories
export const useCaseCategories = () => {
  const { currentPage, currentLimit, currentSearch } = usePagination();

  const params = {
    page: currentPage,
    limit: currentLimit,
    search: currentSearch,
  };

  return useQuery<ApiResponse<CaseCategory[]>>({
    queryKey: ["caseCategories", currentPage, currentLimit, currentSearch],
    queryFn: () => getCaseCategories(params),
    staleTime: 5 * 60 * 1000,
    placeholderData: (previousData) => previousData, // Keep previous data while fetching
  });
};

// ! Create Case Category
export const useCreateCaseCategory = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (data: CaseCategoryBodyType) => createCaseCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["caseCategories"] });
      toast.success(t("toasts.success.caseCategorySaved"));
    },
    onError: (error) => {
      console.error("Error creating case category:", error);
      toast.error(t("toasts.error.createFailed"));
    },
  });
};

// ! Update Case Category
export const useUpdateCaseCategory = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: CaseCategoryBodyType;
    }) => updateCaseCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["caseCategories"] });
      toast.success(t("toasts.success.updateSuccess"));
    },
    onError: (error) => {
      console.error("Error updating case category:", error);
      toast.error(t("toasts.error.updateFailed"));
    },
  });
};

// ! Delete Case Category
export const useDeleteCaseCategory = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (id: string) => deleteCaseCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["caseCategories"] });
      toast.success(t("toasts.success.deleteSuccess"));
    },
    onError: (error) => {
      console.error("Error deleting case category:", error);
      toast.error(t("toasts.error.deleteFailed"));
    },
  });
};
