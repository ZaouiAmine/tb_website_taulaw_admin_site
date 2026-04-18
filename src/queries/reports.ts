import { usePagination } from "@/hooks/usePagination";
import { getAllReports, reportAction } from "@/services/reports";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export default function useAllReports() {
  const { currentPage, currentLimit, currentSearch } = usePagination();

  const params = {
    page: currentPage,
    limit: currentLimit,
    search: currentSearch,
  };
  return useQuery({
    queryKey: ["reports", params],
    queryFn: () => getAllReports(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false, // Prevent unnecessary refetches
    retry: 2, // Retry failed requests twice
    placeholderData: (previousData) => previousData, // Keep previous data while fetching
  });
}

export function useReportActionMutation() {
  const queryQlient = useQueryClient();
  return useMutation({
    mutationFn: (data: { reportId: string; action: number; untilDate: any }) =>
      reportAction(data),

    onSuccess: () => {
      queryQlient.invalidateQueries({ queryKey: ["reports"] });
    },
  });
}
