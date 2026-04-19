import CustomTable, {
  type Action,
  type Column,
} from "@/components/shared/CustomTable";
import PageHeading from "@/components/shared/PageHeading";
import { useState, useEffect } from "react";
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
import { Button } from "@/components/ui/button";
import { PageLoader } from "@/components/shared/CustomClipLoader";
import { ReportStatusEnum, type Report } from "@/types/types";
import { Separator } from "@/components/ui/separator";
import useAllReports, { useReportActionMutation } from "@/queries/reports";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

// ✅ Helper: derive initial action state based on backend
const deriveReportAction = (report: Report) => {
  let actionType: number = ReportStatusEnum.Ignored;
  let isFullBan: boolean | null = null;
  let untilDate: Date | undefined = undefined;

  if (typeof report.status === "string") {
    const s = report.status.toLowerCase();
    if (s === "pending") {
      return {
        actionType: ReportStatusEnum.Pending,
        isFullBan: null,
        untilDate: undefined,
      };
    }
    return { actionType: ReportStatusEnum.Ignored, isFullBan: null, untilDate: undefined };
  }

  // Use the action field from the response (which matches the status)
  actionType =
    (report.action as number) || (report.status as number) || ReportStatusEnum.Ignored;

  switch (actionType) {
    case ReportStatusEnum.Banned:
    case ReportStatusEnum.BannedFromPosting:
      // If untilDate exists, it's a period ban. If null, it's a full ban
      if (report.untilDate) {
        isFullBan = false;
        untilDate = new Date(report.untilDate);
      } else {
        isFullBan = true;
      }
      break;

    case ReportStatusEnum.Ignored:
    case ReportStatusEnum.Pending:
    default:
      actionType = ReportStatusEnum.Ignored;
      isFullBan = null;
      untilDate = undefined;
      break;
  }

  return { actionType, isFullBan, untilDate };
};

export default function ReportsManagement() {
  const { t, i18n } = useTranslation();
  const dir = i18n.language === "ar" ? "rtl" : "ltr";
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<Report | null>(null);
  const [actionType, setActionType] = useState<number>(
    ReportStatusEnum.Ignored
  );
  const [untilDate, setUntilDate] = useState<Date | undefined>(undefined);
  const [isFullBan, setIsFullBan] = useState<boolean | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const { setPaginate } = usePagination();
  const { data: response, isLoading, isPlaceholderData } = useAllReports();
  const reportAction = useReportActionMutation();

  const isInitialLoading = isLoading && !isPlaceholderData;
  const currentPage = response?.page || 1;
  const totalPages = response?.totalPages || 1;

  // Pre-fill dialog when editing
  useEffect(() => {
    if (selectedRow && open) {
      const derived = deriveReportAction(selectedRow);
      setActionType(derived.actionType);
      setIsFullBan(derived.isFullBan);
      setUntilDate(derived.untilDate);
      setErrorMessage("");
    }
  }, [selectedRow, open]);

  // ✅ Reset date when switching to full ban or changing action type
  useEffect(() => {
    if (isFullBan === true || actionType === ReportStatusEnum.Ignored) {
      setUntilDate(undefined);
      setErrorMessage("");
    }
  }, [isFullBan, actionType]);

  const handleAction = async () => {
    if (!selectedRow?.id) return;

    //  Helper: serialize date safely (avoid timezone shifts)
    const serializeDate = (date?: Date | null) => {
      if (!date) return null;
      const d = new Date(date);
      d.setHours(12, 0, 0, 0);
      return d.toISOString();
    };

    // Validate: if it's a period ban, must have a date
    if (
      (actionType === ReportStatusEnum.Banned ||
        actionType === ReportStatusEnum.BannedFromPosting) &&
      isFullBan === false &&
      !untilDate
    ) {
      setErrorMessage(t("pages.reportsManagement.pleaseAddPeriod"));
      return;
    }

    try {
      await reportAction.mutateAsync({
        reportId: selectedRow.id,
        action: actionType,
        // ✅ استخدم serializeDate بدل toISOString() لتفادي مشكلة اليوم السابق
        untilDate:
          actionType === ReportStatusEnum.Ignored || isFullBan === true
            ? null
            : serializeDate(untilDate),
      });

      setOpen(false);
      setSelectedRow(null);
      setUntilDate(undefined);
      setIsFullBan(null);
      setActionType(ReportStatusEnum.Ignored);
      setErrorMessage("");
      toast.success(t("pages.reportsManagement.actionSuccess"));
    } catch (error) {
      console.error("Error taking action:", error);
      toast.error(
        t("pages.reportsManagement.actionError") || "An error occurred"
      );
    }
  };

  const columns: Column<Report>[] = [
    {
      key: "createdBy",
      header: t("pages.reportsManagement.columns.createdBy"),
      width: "20%",
      render: (row) => row.createdBy ?? "—",
    },
    {
      key: "createdByRole",
      header: t("pages.reportsManagement.columns.createdByRole"),
      width: "20%",
      render: (row) => {
        if (row.createdByRole == null) return "—";
        switch (Number(row.createdByRole)) {
          case 1:
            return t("pages.reportsManagement.actions.admin");
          case 2:
            return t("pages.reportsManagement.actions.lawyer");
          case 3:
            return t("pages.reportsManagement.actions.officer");
          case 4:
            return t("pages.reportsManagement.actions.client");
          default:
            return "—";
        }
      },
    },
    {
      key: "reason",
      header: t("pages.reportsManagement.columns.phone"),
      render: (row) => {
        const text =
          row.userPost?.content ?? row.reason?.trim() ?? "";
        const preview =
          text.length > 50 ? text.slice(0, 50) + "..." : text || "—";
        return (
          <Dialog>
            <DialogTrigger>{preview}</DialogTrigger>
            <DialogContent className="w-fit py-8">
              <p className="text-gray-700 text-lg">{text || "—"}</p>
            </DialogContent>
          </Dialog>
        );
      },
      width: "20%",
    },
    {
      key: "reportedBy",
      header: t("pages.reportsManagement.columns.reportedBy"),
      width: "30%",
      render: (row) => row.reportedBy ?? "—",
    },
    {
      key: "reportedByRole",
      header: t("pages.reportsManagement.columns.reportedByRole"),
      width: "30%",
      render: (row) => {
        if (row.reportedByRole == null) return "—";
        switch (row.reportedByRole) {
          case 1:
            return t("pages.reportsManagement.actions.admin");
          case 2:
            return t("pages.reportsManagement.actions.lawyer");
          case 3:
            return t("pages.reportsManagement.actions.officer");
          case 4:
            return t("pages.reportsManagement.actions.client");
          default:
            return "—";
        }
      },
    },
    {
      key: "comment",
      header: t("pages.reportsManagement.columns.comment"),
      render: (row) => {
        const c = row.comment?.trim();
        const preview =
          c && c.length > 50 ? c.slice(0, 50) + "..." : c || "—";
        return (
          <Dialog>
            <DialogTrigger>{preview}</DialogTrigger>
            <DialogContent className="w-fit py-8">
              <p className="text-gray-700 text-lg">{c || "—"}</p>
            </DialogContent>
          </Dialog>
        );
      },
      width: "15%",
    },
    {
      key: "status",
      header: t("pages.reportsManagement.columns.status"),
      width: "15%",
      render: (row) => {
        if (typeof row.status === "string") {
          const s = row.status.toLowerCase();
          if (s === "pending") {
            return t("pages.reportsManagement.actions.requireAction");
          }
          if (s === "accepted" || s === "rejected" || s === "reviewed") {
            return s;
          }
          return row.status;
        }
        switch (row.status) {
          case ReportStatusEnum.Pending:
            return t("pages.reportsManagement.actions.requireAction");
          case ReportStatusEnum.Banned: {
            if (!row.untilDate) {
              return t("pages.reportsManagement.actions.fullBan");
            } else {
              return t("pages.reportsManagement.actions.partialBan");
            }
          }
          case ReportStatusEnum.BannedFromPosting:
            return t("pages.reportsManagement.actions.postsBan");
          case ReportStatusEnum.Ignored:
            return t("pages.reportsManagement.actions.ignored");
          default:
            return "—";
        }
      },
    },
  ];

  const actions: Action<Report>[] = [
    {
      render: (row) => (
        <Button
          variant="default"
          className="cursor-pointer rounded-xl text-lg py-6 px-8 !w-[120px] font-bold"
          onClick={() => {
            setSelectedRow(row);
            setOpen(true);
          }}
        >
          {t("pages.reportsManagement.actions.takeAction")}
        </Button>
      ),
    },
  ];

  if (isInitialLoading) {
    return <PageLoader message={t("pages.reportsManagement.loading")} />;
  }

  return (
    <>
      <PageHeading
        heading={t("pages.reportsManagement.title")}
        path={t("pages.reportsManagement.path")}
      />

      <CustomTable<Report>
        data={response?.response?.data || []}
        columns={columns}
        actions={actions}
        currentPage={currentPage}
        totalPages={totalPages}
        nextPageUrl={currentPage < totalPages ? "next" : null}
        prevPageUrl={currentPage > 1 ? "prev" : null}
        setPaginate={setPaginate}
      />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent dir={dir} className="sm:max-w-md py-8 ">
          <DialogHeader>
            <DialogTitle className="text-center mb-4 text-gray-700 font-bold text-xl">
              {t("pages.reportsManagement.takeAction")}
            </DialogTitle>

            <Separator />

            <DialogDescription className="text-center mb-4 text-gray-700 text-lg">
              {t("pages.reportsManagement.selectAction")}
            </DialogDescription>
          </DialogHeader>

          {/* --- Main Action Selection --- */}
          <div className="mt-4">
            <RadioGroup
              value={String(actionType ?? "")}
              onValueChange={(val) => setActionType(Number(val))}
              className={cn("grid gap-3")}
            >
              <Label
                className={` items-center gap-2 justify-end  ${
                  dir === "rtl" ? " flex " : "flex-row-reverse "
                }`}
              >
                <span>
                  {t("pages.reportsManagement.actions.dismissReport")}
                </span>
                <RadioGroupItem value={String(ReportStatusEnum.Ignored)} />
              </Label>

              <Label
                className={` items-center gap-2 justify-end  ${
                  dir === "rtl" ? " flex " : "flex-row-reverse "
                }`}
              >
                <span>{t("pages.reportsManagement.actions.panUser")}</span>
                <RadioGroupItem value={String(ReportStatusEnum.Banned)} />
              </Label>

              <Label
                className={` items-center gap-2 justify-end  ${
                  dir === "rtl" ? " flex " : "flex-row-reverse "
                }`}
              >
                <span>{t("pages.reportsManagement.actions.panPost")}</span>
                <RadioGroupItem
                  value={String(ReportStatusEnum.BannedFromPosting)}
                />
              </Label>
            </RadioGroup>
          </div>

          {/* --- Ban Options --- */}
          {(actionType === ReportStatusEnum.Banned ||
            actionType === ReportStatusEnum.BannedFromPosting) && (
            <div className="mt-6">
              <RadioGroup
                value={isFullBan === null ? "" : isFullBan ? "full" : "period"}
                onValueChange={(val) => setIsFullBan(val === "full")}
                className="grid gap-3"
              >
                <Label
                  className={` items-center gap-2 justify-end  ${
                    dir === "rtl" ? " flex " : "flex-row-reverse "
                  }`}
                >
                  <span>{t("pages.reportsManagement.actions.fullPan")}</span>
                  <RadioGroupItem value="full" />
                </Label>

                <Label
                  className={` items-center gap-2 justify-end  ${
                    dir === "rtl" ? " flex " : "flex-row-reverse "
                  }`}
                >
                  <span>{t("pages.reportsManagement.actions.addPeriod")}</span>
                  <RadioGroupItem value="period" />
                </Label>
              </RadioGroup>

              {isFullBan === false && (
                <div className="mt-4">
                  <Label className="mb-2 block">
                    {t("pages.reportsManagement.actions.untilDate")}
                  </Label>

                  <Popover modal={true}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !untilDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {untilDate ? (
                          format(untilDate, "PPP")
                        ) : (
                          <span>
                            {t("pages.reportsManagement.actions.pickDate")}
                          </span>
                        )}
                      </Button>
                    </PopoverTrigger>

                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={untilDate}
                        onSelect={(date) => {
                          setUntilDate(date);
                          setErrorMessage("");
                        }}
                        disabled={(date) => {
                          const today = new Date();
                          today.setHours(0, 0, 0, 0);
                          return date < today;
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>

                  {errorMessage && (
                    <p className="text-destructive text-sm mt-2">
                      {errorMessage}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* --- Footer Buttons --- */}
          <DialogFooter className="gap-2 mx-auto grid grid-cols-2 w-full mt-6">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              className="w-full"
            >
              {t("common.cancel")}
            </Button>
            <Button
              onClick={handleAction}
              disabled={reportAction.isPending}
              className="w-full"
            >
              {reportAction.isPending ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>{t("common.loading")}</span>
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
