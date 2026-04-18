import CustomTable, {
  type Action,
  type Column,
} from "@/components/shared/CustomTable";
import PageHeading from "@/components/shared/PageHeading";
import { Button } from "@/components/ui/button";
import { PageLoader } from "@/components/shared/CustomClipLoader";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Edit, Trash2, ExternalLink } from "lucide-react";
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
import { BannerStatusSwitch } from "@/components/ui/BannerStatusSwitch";
import { usePagination } from "@/hooks/usePagination";
import type { Banner } from "@/types/types";
import { useBanners, useDeleteBanner, bannerKeys } from "./banners/queries";
import { updateBanner } from "@/api/banners";

export default function BannersPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<Banner | null>(null);

  const { setPaginate } = usePagination();
  const queryClient = useQueryClient();
  const [statusOverrides, setStatusOverrides] = useState<
    Record<string, "active" | "inactive">
  >({});

  const search = searchParams.get("search") || "";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");

  const {
    data: response,
    isLoading,
    isPlaceholderData,
  } = useBanners({
    page,
    limit,
    search,
  });
  const deleteBannerMutation = useDeleteBanner();

  const isInitialLoading = isLoading && !isPlaceholderData;

  const currentPage = page;
  const totalPages = response?.totalPages || 1;

  const handleDelete = async () => {
    if (!selectedRow?.id) return;

    try {
      await deleteBannerMutation.mutateAsync(selectedRow.id);
      setOpen(false);
      setSelectedRow(null);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (banner: Banner) => {
    navigate(`/admin/banners/edit/${banner.id}`);
  };

  const handleAddNew = () => {
    navigate("/admin/banners/add");
  };

  const columns: Column<Banner>[] = [
    {
      key: "image",
      header: t("pages.banners.columns.image"),
      width: "20%",
      headerClass: "text-center",
      cellClass: "py-4 sm:py-6 text-center",
      render: (banner: Banner) => {
        const imageUrl = banner.image.startsWith("http")
          ? banner.image
          : `${import.meta.env.VITE_API_BASE_URL}${banner.image}`;

        return (
          <div className="flex items-center justify-center">
            <img
              src={imageUrl}
              alt="Banner"
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() =>
                window.open(imageUrl, "_blank", "noopener,noreferrer")
              }
            />
          </div>
        );
      },
    },
    {
      key: "link",
      header: t("pages.banners.columns.link"),
      width: "35%",
      // headerClass: "text-center",
      // cellClass: "text-center",
      render: (banner: Banner) => (
        <div className="flex items-center space-x-1 sm:space-x-2">
          <span className="text-xs sm:text-sm text-gray-700 truncate max-w-[200px] sm:max-w-xs">
            {banner.link}
          </span>
          {banner.link !== "no link" && (
            <ExternalLink
              className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500 cursor-pointer hover:text-blue-700 flex-shrink-0"
              onClick={() => {
                const url = banner.link.startsWith("http")
                  ? banner.link
                  : `https://example.com${banner.link}`;
                window.open(url, "_blank", "noopener,noreferrer");
              }}
            />
          )}
        </div>
      ),
    },
    {
      key: "type",
      header: t("common.type"),
      width: "10%",
      headerClass: "text-center",
      cellClass: "text-center",
      render: (banner: Banner) => (
        <span className="text-sm capitalize">
          {(banner as any).type === "lawyer"
            ? t("common.lawyer")
            : (banner as any).type === "client"
            ? t("common.client")
            : "-"}
        </span>
      ),
    },
    {
      key: "status",
      header: t("pages.banners.columns.status"),
      width: "15%",
      headerClass: "text-center",
      cellClass: "text-center",
      render: (banner: Banner) => (
        <div className="flex items-center justify-center">
          <BannerStatusSwitch
            checked={(statusOverrides[banner.id] ?? banner.status) === "active"}
            disabled={false}
            onCheckedChange={async (checked) => {
              const newStatus = checked ? "active" : "inactive";
              setStatusOverrides((prev) => ({
                ...prev,
                [banner.id]: newStatus,
              }));
              try {
                await updateBanner(banner.id, { status: newStatus } as any);
                queryClient.invalidateQueries({ queryKey: bannerKeys.lists() });
                toast.success(t(`pages.banners.status.${newStatus}`));
              } catch (err) {
                console.error(err);
                setStatusOverrides((prev) => {
                  const copy = { ...prev };
                  delete copy[banner.id];
                  return copy;
                });
              }
            }}
          />
        </div>
      ),
    },
  ];

  const actions: Action<Banner>[] = [
    {
      label: t("common.edit"),
      icon: Edit,
      className: "text-success hover:text-success/90 hover:bg-success/5",
      onClick: (row: Banner) => {
        handleEdit(row);
      },
    },
    {
      label: t("common.delete"),
      icon: Trash2,
      className:
        "text-destructive hover:text-destructive/90 hover:bg-destructive/5",
      onClick: (row: Banner) => {
        setSelectedRow(row);
        setOpen(true);
      },
    },
  ];

  if (isInitialLoading) {
    return <PageLoader message={t("pages.banners.loading")} />;
  }

  return (
    <>
      <PageHeading
        heading={t("pages.banners.title")}
        path={t("pages.banners.path")}
      >
        <Button className="p-6 rounded-2xl text-lg" onClick={handleAddNew}>
          {t("pages.banners.addTitle")}
        </Button>
      </PageHeading>

      <CustomTable<Banner>
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
              {t("common.aboutToDelete")} <b>{selectedRow?.link}</b>.
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
              disabled={deleteBannerMutation.isPending}
              variant="destructive"
              className="w-full"
            >
              {deleteBannerMutation.isPending ? (
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
