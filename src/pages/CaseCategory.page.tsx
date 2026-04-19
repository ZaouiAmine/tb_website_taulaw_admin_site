import CustomTable, {
  type Action,
  type Column,
} from "@/components/shared/CustomTable";
import PageHeading from "@/components/shared/PageHeading";
import { Button } from "@/components/ui/button";
import { PageLoader } from "@/components/shared/CustomClipLoader";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { CaseCategory } from "./caseCategories/types";
import {
  useCaseCategories,
  useDeleteCaseCategory,
} from "./caseCategories/queries";
import { usePagination } from "@/hooks/usePagination";

export default function CaseCategoryPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<CaseCategory | null>(null);

  const { data: response, isLoading, isPlaceholderData } = useCaseCategories();
  
  const deleteCaseCategoryMutation = useDeleteCaseCategory();

  const isInitialLoading = isLoading && !isPlaceholderData;

  const currentPage = response?.currentPage || 1;
  const totalPages = response?.totalPages || 1;

  const handleDelete = async () => {
    if (!selectedRow?.id) return;

    try {
      await deleteCaseCategoryMutation.mutateAsync(selectedRow.id);
      setOpen(false);
      setSelectedRow(null);
    } catch (error) {
      console.error("Error deleting case category:", error);
    }
  };

  const { setPaginate } = usePagination();

  const columns: Column<CaseCategory>[] = [
    {
      key: "nameEn",
      header: t("pages.caseCategory.columns.english"),
      width: "25%",
      cellClass: "py-6",
    },
    {
      key: "nameAr",
      header: t("pages.caseCategory.columns.arabic"),
      width: "25%",
    },
    {
      key: "nameFr",
      header: t("pages.caseCategory.columns.french"),
      width: "25%",
    },
  ];

  const actions: Action<CaseCategory>[] = [
    {
      label: t("common.edit"),
      icon: Edit,
      className: "text-success hover:text-success/90 hover:bg-success/5",
      onClick: (row: CaseCategory) => {
        navigate(
          `/dropdown-management/case-category/edit-case-category/${row.id}`
        );
      },
    },
    {
      label: t("common.delete"),
      icon: Trash2,
      className:
        "text-destructive hover:text-destructive/90 hover:bg-destructive/5",
      onClick: (row: CaseCategory) => {
        setSelectedRow(row);
        setOpen(true);
      },
    },
  ];

  if (isInitialLoading) {
    return <PageLoader message={t("pages.caseCategory.loading")} />;
  }
    

  return (
    <div>
      <PageHeading
        heading={t("pages.caseCategory.title")}
        path={t("pages.caseCategory.path")}
      >
        <Link to={"/dropdown-management/case-category/add-case-category"}>
          <Button className="p-6 rounded-2xl text-lg">
            {t("pages.caseCategory.addTitle")}
          </Button>
        </Link>
      </PageHeading>
      <CustomTable<CaseCategory>
        data={response?.data ? response.data.flat() : []}
        columns={columns}
        actions={actions}
        currentPage={currentPage}
        totalPages={totalPages}
        nextPageUrl={currentPage < totalPages ? "next" : null}
        prevPageUrl={currentPage > 1 ? "prev" : null}
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
              disabled={deleteCaseCategoryMutation.isPending}
              variant="destructive"
              className="w-full"
            >
              {deleteCaseCategoryMutation.isPending ? (
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
    </div>
  );
}
