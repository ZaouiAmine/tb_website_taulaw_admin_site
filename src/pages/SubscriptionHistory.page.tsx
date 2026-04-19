import CustomTable, { type Column } from "@/components/shared/CustomTable";
import { useSubscriptionHistory } from "@/hooks/useLawyerPackages";
import type { Subscription } from "@/types/types";
import PageHeading from "@/components/shared/PageHeading";
import { usePagination } from "@/hooks/usePagination";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";

const SubscriptionHistoryPage = () => {
  const { setPaginate, currentPage, currentSearch, currentLimit } = usePagination();
  const { t } = useTranslation();
  
  const { data: response, isLoading } = useSubscriptionHistory({
    page: currentPage,
    limit: currentLimit,
    search: currentSearch,
  });

  const columns: Column<Subscription>[] = [
    { 
      key: "lawyerName", 
      header: t("subscriptions.table.lawyerName"), 
      width: "20%", 
      render: (value) => value.lawyer?.name || value.lawyerName || "N/A"
    },
    { 
      key: "packageName", 
      header: t("subscriptions.table.packageName"), 
      width: "20%", 
      render: (value) => value.package?.name || value.packageName || "N/A"
    },
    { 
      key: "startDate", 
      header: t("subscriptions.table.startDate"), 
      width: "15%", 
      render: (value) => value.startDate ? format(new Date(value.startDate), 'PP') : "N/A"
    },
    { 
      key: "endDate", 
      header: t("subscriptions.table.endDate"), 
      width: "15%", 
      render: (value) => value.endDate ? format(new Date(value.endDate), 'PP') : "N/A"
    },
    { 
      key: "price", 
      header: t("subscriptions.table.price"), 
      width: "10%", 
      render: (value) => value.price
    },
    { 
      key: "status", 
      header: t("subscriptions.table.status"), 
      width: "10%", 
      render: (value) => (
        <span className={`px-2 py-1 rounded-full text-xs ${
          value.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {t(`subscriptions.status.${value.status}`) || value.status}
        </span>
      ) 
    },
  ];

  const totalPages = response?.totalPages || 1;

  return (
    <div className="space-y-6">
      <PageHeading heading={t("subscriptions.title")} path={t("subscriptions.breadcrumb")}>
        {/* No actions for now */}
      </PageHeading>

      <CustomTable
        columns={columns}
        data={response?.data || []}
        actions={[]}
        loading={isLoading}
        currentPage={currentPage}
        totalPages={totalPages}
        setPaginate={setPaginate}
        nextPageUrl={currentPage < totalPages ? `?page=${currentPage + 1}` : null}
        prevPageUrl={currentPage > 1 ? `?page=${currentPage - 1}` : null}
      />
    </div>
  );
};

export default SubscriptionHistoryPage;
