import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";

interface PaginationParams {
  page?: number;
  search?: string;
  limit?: number;
}

/**
 * Custom hook for managing pagination state in URL parameters
 * 
 * @example
 * ```tsx
 * function MyPage() {
 *   const { setPaginate, currentPage, currentSearch, currentLimit } = usePagination();
 *   
 *   // Use in CustomTable
 *   <CustomTable 
 *     setPaginate={setPaginate}
 *     currentPage={currentPage}
 *     // ... other props
 *   />
 * }
 * ```
 */
export function usePagination() {
  const [searchParams, setSearchParams] = useSearchParams();

  const setPaginate = useCallback(
    (params: PaginationParams) => {
      const newParams = new URLSearchParams(searchParams);

      if (params.page !== undefined) {
        newParams.set("page", params.page.toString());
      }
      if (params.search !== undefined) {
        if (params.search) {
          newParams.set("search", params.search);
        } else {
          newParams.delete("search");
        }
      }
      if (params.limit !== undefined) {
        newParams.set("limit", params.limit.toString());
      }

      setSearchParams(newParams);
    },
    [searchParams, setSearchParams]
  );

  // Get current pagination values
  const currentPage = parseInt(searchParams.get("page") || "1");
  const currentSearch = searchParams.get("search") || "";
  const currentLimit = parseInt(searchParams.get("limit") || "10");

  return {
    setPaginate,
    currentPage,
    currentSearch,
    currentLimit,
    searchParams,
  };
}
