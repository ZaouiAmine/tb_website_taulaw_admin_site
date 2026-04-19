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
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { PageLoader } from "@/components/shared/CustomClipLoader";
import usePendingLawyers, { useVerifyLawyer } from "@/queries/pendingLawyers";
import type { PendingLawyer } from "@/types/types";
import { UserRole } from "@/types/types";
import { View, Filter } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import PdfRow from "@/components/shared/PdfRow";

export default function PendingLawyers() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string>("all");

  const [selectedRow, setSelectedRow] = useState<PendingLawyer | null>(null);

  // Use pagination hook
  const { setPaginate } = usePagination();

  // React Query hooks
  const { data: response, isLoading, isPlaceholderData } = usePendingLawyers();

  const acceptLawyerMutation = useVerifyLawyer();

  // Only show page loader on initial load (no data) or when not using placeholder data
  const isInitialLoading = isLoading && !isPlaceholderData;

  // Extract pagination data with proper fallbacks
  const currentPage = response?.currentPage || 1;
  const totalPages = response?.totalPages || 1;

  // Filter data by role
  const filteredData = response?.data?.filter((item: PendingLawyer) => {
    if (selectedRole === "all") return true;
    return item.userInfo.role === parseInt(selectedRole);
  }) || [];

  const handleAccept = async () => {
    if (!selectedRow?.userInfo.id) return;

    try {
      await acceptLawyerMutation.mutateAsync(selectedRow.userInfo.id);
      setOpen(false);
      setSelectedRow(null);
    } catch (error) {
      console.error("Error accepting lawyer:", error);
    }
  };

  const columns: Column<PendingLawyer>[] = [
    {
      key: "userInfo.name",
      header: t("pages.pendingLawyers.columns.name"),
      render: (row) => row.userInfo.name,
      width: "20%",
    },
    {
      key: "userInfo.email",
      header: t("pages.lawyerRequests.columns.email"),
      width: "20%",
      render: (row) => (
        <a
          href={`mailto:${row.userInfo.email}`}
          className="text-primary hover:underline"
          onClick={(e) => e.stopPropagation()}
        >
          {row.userInfo.email}
        </a>
      ),
    },
    {
      key: "userInfo.phone",
      header: t("pages.pendingLawyers.columns.phone"),
      render: (row) => row.userInfo.phone,
      width: "15%",
    },
    {
      key: "userInfo.role",
      header: () => (
        <div className="flex items-center gap-2">
          <span>{t("common.role")}</span>
          <Popover>
            <PopoverTrigger asChild>
              <button className="hover:bg-muted p-1 rounded transition-colors">
                <Filter className="h-4 w-4" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-3">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {t("common.filter")}
                </label>
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      {t("common.rowsPerPage").includes("All") ? t("common.all") : t("common.all")}
                    </SelectItem>
                    <SelectItem value={UserRole.LAWYER.toString()}>
                      {t("common.lawyer")}
                    </SelectItem>
                    <SelectItem value={UserRole.OFFICER.toString()}>
                      {t("common.officer")}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      ),
      render: (row) => {
        const roleKey = row.userInfo.role === UserRole.LAWYER 
          ? "lawyer" 
          : row.userInfo.role === UserRole.OFFICER 
          ? "officer" 
          : "unknown";
        return t(`common.${roleKey}`);
      },
      width: "15%",
    },
    {
      key: "userInfo.address",
      header: t("pages.pendingLawyers.columns.address"),
      render: (row) => row.userInfo.address || "-",
      width: "25%",
    },
    {
      key: "verificationFiles",
      header: t("pages.pendingLawyers.columns.files"),
      render: (row) => {
        return (
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="rounded-xl text-lg py-6 px-8"
              >
                <View className="mr-2" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-3xl py-8 overflow-auto max-h-[80vh] space-y-0 gap-0">
              <DialogTitle></DialogTitle>
              {row.verificationFiles.map((file, index) => {
                const ext = file.fileName.split(".").pop()?.toLowerCase();

                const isImage = ["jpg", "jpeg", "png", "gif", "webp"].includes(
                  ext ?? ""
                );
                const isPdf = ext === "pdf";
                const isVideo = ["mp4", "webm", "ogg"].includes(ext ?? "");
                const isAudio = ["mp3", "wav", "ogg"].includes(ext ?? "");

                const fileUrl = `${import.meta.env.VITE_API_BASE_URL}${
                  file.fileUrl
                }`;
                if (isPdf) console.log({ fileUrl });
                return (
                  <div key={file.id} className="my-0">
                    {index !== 0 && (
                      <Separator className="bg-muted-foreground my-4" />
                    )}

                    {isImage && (
                      <a
                        href={fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img
                          src={fileUrl}
                          alt={file.fileName}
                          className="h-auto w-auto cursor-pointer hover:opacity-90 transition"
                        />
                      </a>
                    )}

                    {isPdf && <PdfRow fileUrl={fileUrl} index={index} />}

                    {isVideo && (
                      <a
                        href={fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <video
                          controls
                          className="w-full max-h-[400px] rounded-lg border cursor-pointer"
                        >
                          <source src={fileUrl} type={`video/${ext}`} />
                          Your browser does not support the video tag.
                        </video>
                      </a>
                    )}

                    {isAudio && (
                      <a
                        href={fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <audio controls className="w-full cursor-pointer">
                          <source src={fileUrl} type={`audio/${ext}`} />
                          Your browser does not support the audio element.
                        </audio>
                      </a>
                    )}

                    {!isImage && !isPdf && !isVideo && !isAudio && (
                      <a
                        href={fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {file.fileName}
                      </a>
                    )}
                  </div>
                );
              })}
            </DialogContent>
          </Dialog>
        );
      },
      width: "30%",
    },
  ];

  const actions: Action<PendingLawyer>[] = [
    {
      render: (row) => {
        if (row.verificationStatus === 2) {
          // Already accepted - show "Accepted" text
          return (
            <Button className="bg-gray-300 text-primary hover:bg-gray-300 rounded-xl text-lg py-6 px-8 !w-[120px] font-bold">
              {t("pages.pendingLawyers.actions.accepted")}
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
              {t("pages.pendingLawyers.actions.accept")}
            </Button>
          );
        }
      },
    },
  ];

  if (isInitialLoading) {
    return <PageLoader message={t("pages.pendingLawyers.loading")} />;
  }

  return (
    <>
      <PageHeading
        heading={t("pages.pendingLawyers.title")}
        path={t("pages.pendingLawyers.path")}
      />

      <CustomTable<PendingLawyer>
        data={filteredData}
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
              {t("common.aboutToAccept")} <b>{selectedRow?.userInfo.name}</b>.
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
