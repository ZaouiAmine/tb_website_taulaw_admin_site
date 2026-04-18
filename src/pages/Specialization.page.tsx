import CustomTable, {
  type Action,
  type Column,
} from "@/components/shared/CustomTable";
import PageHeading from "@/components/shared/PageHeading";
import { Button } from "@/components/ui/button";
import { PageLoader } from "@/components/shared/CustomClipLoader";
import { Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { usePagination } from "@/hooks/usePagination";
import type { ISpecializations } from "./specializations/types";
import { useSpecializations, useDeleteSpecializations } from "./specializations/queries";

export default function SpecializationPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<ISpecializations | null>(null);

  // Use pagination hook
  const { setPaginate } = usePagination();

  const { data: response, isLoading, isPlaceholderData } = useSpecializations();
  const deleteSpecializationMutation = useDeleteSpecializations();

  const isInitialLoading = isLoading && !isPlaceholderData;

  const currentPage = response?.currentPage || 1;
  const totalPages = response?.totalPages || 1;

  const handleDelete = async () => {
    if (!selectedRow?.id) return;

    try {
      await deleteSpecializationMutation.mutateAsync(selectedRow.id);
      setOpen(false);
      setSelectedRow(null);
    } catch (error) {
      console.error("Error deleting specialization:", error);
    }
  };

  const columns: Column<ISpecializations>[] = [
    {
      key: "nameEn",
      header: t('pages.specialization.columns.english'),
      width: "25%",
      cellClass: "py-6",
    },
    {
      key: "nameAr",
      header: t('pages.specialization.columns.arabic'),
      width: "25%",
    },
    {
      key: "nameFr",
      header: t('pages.specialization.columns.french'),
      width: "25%",
    },
  ];

  const actions: Action<ISpecializations>[] = [
    {
      label: t('common.edit'),
      icon: Edit,
      className: "text-success hover:text-success/90 hover:bg-success/5",
      onClick: (row: ISpecializations) => {
        navigate(`/dropdown-management/specialization/edit-specialization/${row.id}`);
      },
    },
    {
      label: t('common.delete'),
      icon: Trash2,
      className:
        "text-destructive hover:text-destructive/90 hover:bg-destructive/5",
      onClick: (row: ISpecializations) => {
        setSelectedRow(row);
        setOpen(true);
      },
    },
  ];

  if (isInitialLoading) {
    return <PageLoader message={t("pages.specialization.loading")} />;
  }

  return (
    <>
      <PageHeading
        heading={t('pages.specialization.title')}
        path={t('pages.specialization.path')}
      >
        <Link to={"/dropdown-management/specialization/add-specialization"}>
          <Button className="p-6 rounded-2xl text-lg">
            {t('pages.specialization.addTitle')}
          </Button>
        </Link>
      </PageHeading>

      <CustomTable<ISpecializations>
        data={response?.data ? response.data.flat() : []}
        columns={columns}
        actions={actions}
        currentPage={currentPage}
        totalPages={totalPages}
        nextPageUrl={currentPage < totalPages ? `?page=${currentPage + 1}` : null}
        prevPageUrl={currentPage > 1 ? `?page=${currentPage - 1}` : null}
        setPaginate={setPaginate}
        loading={isLoading}
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md py-8">
          <DialogHeader>
            <DialogTitle className="text-center mb-4 text-gray-700 font-bold text-xl">
              {t("common.areYouSure")}
            </DialogTitle>
            <DialogDescription className="text-center mb-4 text-gray-700 text-lg">
              {t("common.aboutToDelete")} <b>{selectedRow?.nameEn}</b>.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2 mx-auto grid grid-cols-2 w-full">
            <Button variant="outline" onClick={() => setOpen(false)} className="w-full">
              {t("common.cancel")}
            </Button>
            <Button
              onClick={handleDelete}
              disabled={deleteSpecializationMutation.isPending}
              variant="destructive"
              className="w-full"
            >
              {deleteSpecializationMutation.isPending ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>{t("common.deleting")}</span>
                </div>
              ) : (
                t("common.delete")
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
