import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { usePagination } from "@/hooks/usePagination";
import { getLawyerRequests } from "@/services/requests/getRequests";
import { acceptLawyer } from "@/services/requests/acceptedLawyer";
import type { ApiResponse } from "@/types/types";
import type { LawyerRequest } from "./types";

export function useRequests() {
  const { currentPage, currentLimit, currentSearch } = usePagination();

  const params = {
    page: currentPage,
    limit: currentLimit,
    search: currentSearch,
  };

  return useQuery<ApiResponse<LawyerRequest>>({
    queryKey: ["requests", params],
    queryFn: () => getLawyerRequests(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false, // Prevent unnecessary refetches
    retry: 2, // Retry failed requests twice
    placeholderData: (previousData) => previousData, // Keep previous data while fetching
  });
}

export function useAcceptLawyer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (lawyerId: string) => acceptLawyer(lawyerId),
    onSuccess: () => {
      // Invalidate and refetch requests data
      queryClient.invalidateQueries({ queryKey: ["requests"] });
    },
  });
}
