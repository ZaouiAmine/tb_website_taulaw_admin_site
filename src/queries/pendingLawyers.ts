import { usePagination } from "@/hooks/usePagination";
import { getAllPendingLawyers, verifyLawyer } from "@/services/pendingLawyers";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export default function usePendingLawyers() {
  const { currentPage, currentLimit, currentSearch } = usePagination();
  const params = {
    page: currentPage,
    limit: currentLimit,
    search: currentSearch,
  };

  return useQuery({
    queryKey: ["pending-lawyers", params],
    queryFn: () => getAllPendingLawyers(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false, // Prevent unnecessary refetches
    retry: 2, // Retry failed requests twice
    placeholderData: (previousData) => previousData, // Keep previous data while fetching
  });
}

export function useVerifyLawyer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (lawyerId: string) => verifyLawyer(lawyerId),
    onSuccess: () => {
      // Invalidate and refetch requests data
      queryClient.invalidateQueries({ queryKey: ["pending-lawyers"] });
    },
  });
}
