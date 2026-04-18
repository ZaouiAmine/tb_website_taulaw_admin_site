import CustomTable, {
  type Action,
  type Column,
} from "@/components/shared/CustomTable";
import PageHeading from "@/components/shared/PageHeading";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { usePagination } from "@/hooks/usePagination";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PageLoader } from "@/components/shared/CustomClipLoader";
import type { LawyerRequest } from "./requests/types";
import { useRequests, useAcceptLawyer } from "./requests/queries";

export default function LawyerRequestsPage() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<LawyerRequest | null>(null);

  // Use pagination hook
  const { setPaginate } = usePagination();

  // React Query hooks
  const { data: response, isLoading, isPlaceholderData } = useRequests();

  const acceptLawyerMutation = useAcceptLawyer();

  // Only show page loader on initial load (no data) or when not using placeholder data
  const isInitialLoading = isLoading && !isPlaceholderData;

  // Extract pagination data with proper fallbacks
  const currentPage = response?.currentPage || 1;
  const totalPages = response?.totalPages || 1;

  const handleAccept = async () => {
    if (!selectedRow?.id) return;

    try {
      await acceptLawyerMutation.mutateAsync(selectedRow.id);
      setOpen(false);
      setSelectedRow(null);
    } catch (error) {
      console.error("Error accepting lawyer:", error);
    }
  };

  const columns: Column<LawyerRequest>[] = [
    {
      key: "name",
      header: t("pages.lawyerRequests.columns.name"),
      width: "20%",
    },
    {
      key: "email",
      header: t("pages.lawyerRequests.columns.email"),
      width: "20%",
      render: (row) => (
        <a
          href={`mailto:${row.email}`}
          className="text-primary hover:underline"
          onClick={(e) => e.stopPropagation()}
        >
          {row.email}
        </a>
      ),
    },
    {
      key: "phone",
      header: t("pages.lawyerRequests.columns.phone"),
      width: "20%",
    },
    {
      key: "address",
      header: t("pages.lawyerRequests.columns.address"),
      width: "30%",
    },
  ];

  const actions: Action<LawyerRequest>[] = [
    {
      render: (row) => {
        if (row.status === 2) {
          // Already accepted - show "Accepted" text
          return (
            <Button className="bg-gray-300 text-primary hover:bg-gray-300 rounded-xl text-lg py-6 px-8 !w-[120px] font-bold">
              {t("pages.lawyerRequests.actions.accepted")}
            </Button>
          );
        } else {
          // Not accepted - show accept button
          return (
            <Button
              variant="default"
              className="cursor-pointer rounded-xl text-lg py-6 px-8 !w-[120px] font-bold"
              onClick={() => {
                setSelectedRow(row);
                setOpen(true);
              }}
            >
              {t("pages.lawyerRequests.actions.accept")}
            </Button>
          );
        }
      },
    },
  ];

  if (isInitialLoading) {
    return <PageLoader message={t("pages.lawyerRequests.loading")} />;
  }

  return (
    <>
      <PageHeading
        heading={t("pages.lawyerRequests.title")}
        path={t("pages.lawyerRequests.path")}
      />

      <CustomTable<LawyerRequest>
        data={response?.data || []}
        columns={columns}
        actions={actions}
        currentPage={currentPage}
        totalPages={totalPages}
        nextPageUrl={currentPage < totalPages ? "next" : null}
        prevPageUrl={currentPage > 1 ? "prev" : null}
        setPaginate={setPaginate}
      />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md py-8">
          <DialogHeader>
            <DialogTitle className="text-center mb-4 text-gray-700 font-bold text-xl">
              {t("common.areYouSure")}
            </DialogTitle>
            <DialogDescription className="text-center mb-4 text-gray-700 text-lg">
              {t("common.aboutToAccept")} <b>{selectedRow?.name}</b>.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2 mx-auto grid grid-cols-2 w-full">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              className="w-full"
            >
              {t("common.cancel")}
            </Button>
            <Button
              onClick={handleAccept}
              disabled={acceptLawyerMutation.isPending}
              className="w-full"
            >
              {acceptLawyerMutation.isPending ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Accepting...</span>
                </div>
              ) : (
                t("common.accept")
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
