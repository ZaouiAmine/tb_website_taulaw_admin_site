import { lawyerPackagesApi } from "@/services/lawyerPackages.service";
import type {
  CreateLawyerPackageDto,
  lawyerPackage,
  UpdateLawyerPackageDto,
  LawyerPackagesQueryParams,
  CleanupResponse,
  ApiResponse,
  Subscription,
} from "@/types/types";
import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationOptions,
  type UseQueryOptions,
} from "@tanstack/react-query";
import { toast } from "sonner";
import i18n from "@/i18n";
export const lawyerPackagesKeys = {
  all: ["lawyerPackages"] as const,
  lists: () => [...lawyerPackagesKeys.all, "list"] as const,
  list: (params: LawyerPackagesQueryParams) =>
    [...lawyerPackagesKeys.lists(), params] as const,
  details: () => [...lawyerPackagesKeys.all, "detail"] as const,
  detail: (id: string) => [...lawyerPackagesKeys.details(), id] as const,
  history: (params: LawyerPackagesQueryParams) => [...lawyerPackagesKeys.all, "history", params] as const,
};

// Get all lawyer packages
export const useLaywerPackages = (
  params?: LawyerPackagesQueryParams,
  options?: Omit<UseQueryOptions<ApiResponse<lawyerPackage>>, "queryKey" | "queryFn">
) => {
  return useQuery<ApiResponse<lawyerPackage>>({
    queryKey: lawyerPackagesKeys.list(params || {}),
    queryFn: () => lawyerPackagesApi.getAll(params),
    ...options,
  });
};

// Get one by id
export const useLawyerPackage = (
  id: string,
  options?: Omit<UseQueryOptions<lawyerPackage>, "queryKey" | "queryFn">
) => {
  return useQuery({
    queryKey: lawyerPackagesKeys.detail(id),
    queryFn: () => lawyerPackagesApi.getById(id),
    enabled: !!id,
    ...options,
  });
};

// create

export const useCreateLawyerPackage = (
  options?: UseMutationOptions<lawyerPackage, Error, CreateLawyerPackageDto>
) => {
  const queryClient = useQueryClient();
  return useMutation<lawyerPackage, Error, CreateLawyerPackageDto>({
    mutationFn: lawyerPackagesApi.create,
    onSuccess(data, variables, context) {
      queryClient.invalidateQueries({ queryKey: lawyerPackagesKeys.lists() });
      toast.success(i18n.t("lawyerPackages.addPage.createdSuccessfully"));
      options?.onSuccess?.(data, variables, context);
    },
    onError(error, variables, context) {
      toast.error(i18n.t("lawyerPackages.addPage.failedToCreate"));
      options?.onError?.(error, variables, context);
    },
    ...options,
  });
};

// update

export const useUpdateLawyerPackage = (
  options?: UseMutationOptions<
    lawyerPackage,
    Error,
    { id: string; data: UpdateLawyerPackageDto }
  >
) => {
  const queryClient = useQueryClient();
  return useMutation<
    lawyerPackage,
    Error,
    { id: string; data: UpdateLawyerPackageDto }
  >({
    mutationFn: ({ id, data }) => lawyerPackagesApi.update(id, data),
    onSuccess(data, variables, context) {
      queryClient.invalidateQueries({ queryKey: lawyerPackagesKeys.lists() });
      toast.success(i18n.t("lawyerPackages.addPage.updatedSuccessfully"));
      options?.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      toast.error(i18n.t("lawyerPackages.addPage.failedToUpdate"));
      options?.onError?.(error, variables, context);
    },
    ...options,
  });
};

// delete

export const useDeleteLawyerPackage = (
  options?: UseMutationOptions<void, Error, string>
) => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: lawyerPackagesApi.delete,
    onSuccess: (data, id, context) => {
      queryClient.removeQueries({ queryKey: lawyerPackagesKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: lawyerPackagesKeys.lists() });  
      toast.success(i18n.t("lawyerPackages.addPage.deletedSuccessfully"));
      options?.onSuccess?.(data, id, context);
    },
    onError: (error, variables, context) => {
      toast.error(i18n.t("lawyerPackages.addPage.failedToDelete"));
      options?.onError?.(error, variables, context);
    },
    ...options,
  });
};

export const useCleanupSubscriptions = (
  options?: UseMutationOptions<CleanupResponse, Error, void>
) => {
  const queryClient = useQueryClient();

  return useMutation<CleanupResponse, Error, void>({
    mutationFn: lawyerPackagesApi.cleanupExpiredSubscriptions,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: lawyerPackagesKeys.all,
      });
      toast.success(i18n.t("lawyerPackages.addPage.deletedSuccessfully"));
      options?.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      toast.error(i18n.t("lawyerPackages.addPage.failedToDelete"));
      options?.onError?.(error, variables, context);
    },
    ...options,
  });
};

export const useSubscriptionHistory = (
  params?: LawyerPackagesQueryParams,
  options?: Omit<UseQueryOptions<ApiResponse<Subscription>>, "queryKey" | "queryFn">
) => {
  return useQuery<ApiResponse<Subscription>>({
    queryKey: lawyerPackagesKeys.history(params || {}),
    queryFn: () => lawyerPackagesApi.getSubscriptionHistory(params),
    ...options,
  });
};
