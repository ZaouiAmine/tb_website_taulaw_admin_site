import { Button } from "@/components/ui/button";
import CustomTable, { type Action, type Column } from "@/components/shared/CustomTable";
import { useDeleteLawyerPackage, useLaywerPackages } from "@/hooks/useLawyerPackages";
import type { lawyerPackage } from "@/types/types";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import PageHeading from "@/components/shared/PageHeading";
import { usePagination } from "@/hooks/usePagination";
import { useTranslation } from "react-i18next";
import { Pencil, Trash2 } from "lucide-react";

const PlatformFeesPage = () => {
  const navigate = useNavigate();
  const { setPaginate, currentPage, currentSearch, currentLimit } = usePagination();
  const { t } = useTranslation();  
  const { data: response, isLoading } = useLaywerPackages({
    page: currentPage,
    limit: currentLimit,
    search: currentSearch,
  });

  const deleteMutation = useDeleteLawyerPackage();
  const [packageToDelete, setPackageToDelete] = useState<string | null>(null);

  const handleDelete = () => {
    if (packageToDelete) {
      deleteMutation.mutate(packageToDelete);
      setPackageToDelete(null);
    }
  };

  const column: Column<lawyerPackage>[] = [
    { key: "name", header: t("lawyerPackages.table.name"), width: "15%", render: (value) => value.name },
    { key: "price", header: t("lawyerPackages.table.price"), width: "15%", render: (value) => value.price },
    { key: "numberOfCases", header: t("lawyerPackages.table.numberOfCases"), width: "15%", render: (value) => value.numberOfCases },
    { key: "numberOfAssistants", header: t("lawyerPackages.table.numberOfAssistants"), width: "15%", render: (value) => value.numberOfAssistants },
    { key: "durationInDays", header: t("lawyerPackages.table.durationInDays"), width: "15%", render: (value) => value.durationInDays },
    { 
        key: "isActive", 
        header: t("lawyerPackages.table.status"), 
        width: "10%", 
        render: (value) => (
            <span className={`px-2 py-1 rounded-full text-xs ${value.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {value.isActive ? t("lawyerPackages.table.statusActive") : t("lawyerPackages.table.statusInactive")}
            </span>
        ) 
    },
  ];

  const actions: Action<lawyerPackage>[] = [
    {
      label: t("common.edit"),
      icon: Pencil,
      className:
        "text-primary hover:text-primary/90 hover:bg-primary/5",
      onClick: (row) => {
        navigate(`/lawyer-packages/edit/${row.id}`);
      },
    },
    {
       label: t("common.delete"),
      icon: Trash2,
      className:
        "text-destructive hover:text-destructive/90 hover:bg-destructive/5",
      onClick: (row) => {
        setPackageToDelete(row.id);
      },
    },
  ];

  const totalPages = response?.totalPages || 1;

  return (
    <div className="space-y-6">
      <PageHeading heading={t("lawyerPackages.title")} path={t("lawyerPackages.path")}>
        <Button onClick={() => navigate("/lawyer-packages/add")} className="p-6 rounded-2xl text-lg">
          {t("lawyerPackages.addPackage")}
        </Button>
      </PageHeading>

      <CustomTable
        columns={column}
        data={response?.data || []}
        actions={actions}
        loading={isLoading}
        currentPage={currentPage}
        totalPages={totalPages}
        setPaginate={setPaginate}
        nextPageUrl={currentPage < totalPages ? `?page=${currentPage + 1}` : null}
        prevPageUrl={currentPage > 1 ? `?page=${currentPage - 1}` : null}
      />

        {/* <Dialog open={!!packageToDelete} onOpenChange={(open) => !open && setPackageToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the lawyer package.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPackageToDelete(null)}>{t("common.cancel")}</Button>
            <Button onClick={handleDelete} variant="destructive">
              {t("common.delete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog> */}
      
      <Dialog open={!!packageToDelete} onOpenChange={(open) => !open && setPackageToDelete(null)}>
        <DialogContent className="sm:max-w-md py-8">
          <DialogHeader>
            <DialogTitle className="text-center mb-4 text-gray-700 font-bold text-xl">
              {t("common.areYouSure")}
            </DialogTitle>
            <DialogDescription className="text-center mb-4 text-gray-700 text-lg">
              {t("common.aboutToDelete")} <b>{packageToDelete}</b>.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2 mx-auto grid grid-cols-2 w-full">
            <Button
              variant="outline"
              onClick={() => setPackageToDelete(null)}
              className="w-full"
            >
              {t("common.cancel")}
            </Button>
            <Button
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              variant="destructive"
              className="w-full"
            >
              {deleteMutation.isPending ? (
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
};

export default PlatformFeesPage;
