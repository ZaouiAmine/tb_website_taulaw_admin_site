import CustomTable, {
  type Action,
  type Column,
} from "@/components/shared/CustomTable";
import PageHeading from "@/components/shared/PageHeading";
import { Button } from "@/components/ui/button";
import { PageLoader } from "@/components/shared/CustomClipLoader";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { usePagination } from "@/hooks/usePagination";
import type { ConsultationPackage } from "@/types/types";
import {
  useConsultationPackages,
  useDeleteConsultationPackage,
  consultationPackageKeys,
} from "./consultationPackages/queries";
import { updateConsultationPackage } from "@/api/consultationPackages";

export default function ConsultationPackagesPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<ConsultationPackage | null>(
    null
  );

  const { setPaginate } = usePagination();
  const queryClient = useQueryClient();
  const [statusOverrides, setStatusOverrides] = useState<
    Record<string, boolean>
  >({});

  const search = searchParams.get("search") || "";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");

  const {
    data: response,
    isLoading,
    isPlaceholderData,
  } = useConsultationPackages({
    page,
    limit,
    name: search,
  });
  const deletePackageMutation = useDeleteConsultationPackage();

  const isInitialLoading = isLoading && !isPlaceholderData;

  const currentPage = page;
  const totalPages = response?.totalPages || 1;

  const handleDelete = async () => {
    if (!selectedRow?.id) return;

    try {
      await deletePackageMutation.mutateAsync(selectedRow.id);
      setOpen(false);
      setSelectedRow(null);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (pkg: ConsultationPackage) => {
    navigate(`/admin/consultation-packages/edit/${pkg.id}`);
  };

  const handleAddNew = () => {
    navigate("/admin/consultation-packages/add");
  };

  const columns: Column<ConsultationPackage>[] = [
    {
      key: "name",
      header: t("pages.consultationPackages.packageName", {
        defaultValue: "Package Name",
      }),
      width: "30%",
      render: (pkg: ConsultationPackage) => (
        <span className="text-sm font-medium">{pkg.name}</span>
      ),
    },
    {
      key: "numberOfConsultations",
      header: t("pages.consultationPackages.numberOfConsultations", {
        defaultValue: "Number of Consultations",
      }),
      width: "20%",
      headerClass: "text-center",
      cellClass: "text-center",
      render: (pkg: ConsultationPackage) => (
        <span className="text-sm">{pkg.numberOfConsultations}</span>
      ),
    },
    {
      key: "price",
      header: t("pages.consultationPackages.price", { defaultValue: "Price" }),
      width: "20%",
      headerClass: "text-center",
      cellClass: "text-center",
      render: (pkg: ConsultationPackage) => (
        <span className="text-sm font-semibold">
          {Number(pkg.price).toFixed(2)}
        </span>
      ),
    },
    {
      key: "isActive",
      header: t("pages.consultationPackages.status", {
        defaultValue: "Status",
      }),
      width: "15%",
      headerClass: "text-center",
      cellClass: "text-center",
      render: (pkg: ConsultationPackage) => (
        <div className="flex items-center justify-center">
          <Switch
            checked={statusOverrides[pkg.id] ?? pkg.isActive}
            onCheckedChange={async (checked) => {
              setStatusOverrides((prev) => ({
                ...prev,
                [pkg.id]: checked,
              }));
              try {
                await updateConsultationPackage(pkg.id, { isActive: checked });
                queryClient.invalidateQueries({
                  queryKey: consultationPackageKeys.lists(),
                });
                toast.success(
                  t(
                    `pages.consultationPackages.statusMessages.${
                      checked ? "active" : "inactive"
                    }`
                  )
                );
              } catch (err) {
                console.error(err);
                setStatusOverrides((prev) => {
                  const copy = { ...prev };
                  delete copy[pkg.id];
                  return copy;
                });
                toast.error(t("toasts.error.updateFailed"));
              }
            }}
          />
        </div>
      ),
    },
  ];

  const actions: Action<ConsultationPackage>[] = [
    {
      label: t("common.edit"),
      icon: Edit,
      className: "text-success hover:text-success/90 hover:bg-success/5",
      onClick: (row: ConsultationPackage) => {
        handleEdit(row);
      },
    },
    {
      label: t("common.delete"),
      icon: Trash2,
      className:
        "text-destructive hover:text-destructive/90 hover:bg-destructive/5",
      onClick: (row: ConsultationPackage) => {
        setSelectedRow(row);
        setOpen(true);
      },
    },
  ];

  if (isInitialLoading) {
    return <PageLoader message={t("pages.consultationPackages.loading")} />;
  }

  return (
    <>
      <PageHeading
        heading={t("pages.consultationPackages.title")}
        path={t("pages.consultationPackages.path")}
      >
        <Button className="p-6 rounded-2xl text-lg" onClick={handleAddNew}>
          {t("pages.consultationPackages.addTitle")}
        </Button>
      </PageHeading>

      <CustomTable<ConsultationPackage>
        data={response?.data || []}
        columns={columns}
        actions={actions}
        actionsHeaderClass="text-center"
        actionsCellClass="text-center"
        currentPage={currentPage}
        totalPages={totalPages}
        nextPageUrl={
          currentPage < totalPages ? `?page=${currentPage + 1}` : null
        }
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
              {t("common.aboutToDelete")} <b>{selectedRow?.name}</b>.
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
              onClick={handleDelete}
              disabled={deletePackageMutation.isPending}
              variant="destructive"
              className="w-full"
            >
              {deletePackageMutation.isPending ? (
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
