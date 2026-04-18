import gerDashboardStatus, { getAllLawyers } from "@/services/dashboardStatus";
import { useQuery } from "@tanstack/react-query";

export default function useDashboardStatus({
  dateTo,
  dateFrom,
  lawyerId,
}: {
  dateTo?: string;
  dateFrom?: string;
  lawyerId?: string;
}) {
  return useQuery({
    queryKey: ["pending-lawyers", { dateTo, dateFrom, lawyerId }],
    queryFn: () => gerDashboardStatus({ dateTo, dateFrom, lawyerId }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false, // Prevent unnecessary refetches
    retry: 2, // Retry failed requests twice
    placeholderData: (previousData) => previousData, // Keep previous data while fetching
  });
}

export function useAllLawyers() {
  return useQuery({
    queryKey: ["all-lawyers"],
    queryFn: () => getAllLawyers(),
  });
}
