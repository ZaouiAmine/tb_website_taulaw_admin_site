import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CustomPaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export default function CustomPagination({
  totalPages,
  currentPage,
  onPageChange,
  className = "",
}: CustomPaginationProps) {
  const renderPageNumbers = () => {
    const pages = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(
          <Button
            key={i}
            variant={currentPage === i ? "default" : "outline"}
            size="sm"
            onClick={() => onPageChange(i)}
            className={`h-8 w-8 p-0 ${
              currentPage === i
                ? "bg-slate-800 text-white hover:bg-slate-900"
                : "hover:bg-gray-100 border-gray-300"
            }`}
          >
            {i}
          </Button>
        );
      }
    } else {
      const showPages = [];

      showPages.push(1);

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        if (!showPages.includes(i)) {
          showPages.push(i);
        }
      }

      if (totalPages > 1 && !showPages.includes(totalPages)) {
        showPages.push(totalPages);
      }

      showPages.sort((a, b) => a - b);

      for (let i = 0; i < showPages.length; i++) {
        const page = showPages[i];

        if (i > 0 && page - showPages[i - 1] > 1) {
          pages.push(
            <span key={`ellipsis-${page}`} className="px-2 text-gray-500">
              ...
            </span>
          );
        }

        pages.push(
          <Button
            key={page}
            variant={currentPage === page ? "default" : "outline"}
            size="sm"
            onClick={() => onPageChange(page)}
            className={`h-8 w-8 p-0 ${
              currentPage === page
                ? "bg-slate-800 text-white hover:bg-slate-900"
                : "hover:bg-gray-100 border-gray-300"
            }`}
          >
            {page}
          </Button>
        );
      }
    }

    return pages;
  };

  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      <Button
        variant="default"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`h-8 w-8 p-0 border-gray-300 hover:bg-gray-600 ${
          currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>

      <div className="flex items-center gap-1">{renderPageNumbers()}</div>

      <Button
        variant="default"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`h-8 w-8 p-0 border-gray-300 hover:bg-gray-600 ${
          currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
    </div>
  );
}
