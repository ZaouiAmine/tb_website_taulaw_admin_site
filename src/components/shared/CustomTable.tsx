import { useCallback, useState, useEffect } from "react";
import { Search } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import CustomPagination from "./CustomPagination";

type ColumnType = "text" | "avatar" | "switch" | "link" | "badge" | "custom";

// --------------------------------
// 1. Utility types for nested keys
// --------------------------------
type NestedKeyOf<T> = T extends object
  ? {
      [K in keyof T & (string | number)]: T[K] extends object
        ? `${K}` | `${K}.${NestedKeyOf<T[K]>}`
        : `${K}`;
    }[keyof T & (string | number)]
  : never;

// Map nested path → value type
type NestedValue<
  T,
  Path extends string
> = Path extends `${infer Key}.${infer Rest}`
  ? Key extends keyof T
    ? NestedValue<T[Key], Rest>
    : never
  : Path extends keyof T
  ? T[Path]
  : never;

// --------------------------------
// 2. Column definition
// --------------------------------
export interface Column<T, K extends NestedKeyOf<T> = NestedKeyOf<T>> {
  key: K;
  header: string | (() => React.ReactNode);
  type?: ColumnType;
  headerClass?: string;
  cellClass?: string;
  width?: string;
  alt?: string;
  fallback?: string;
  displayValue?: ((value: NestedValue<T, K>) => string) | string;
  badgeClass?: (value: NestedValue<T, K>) => string;
  onChange?: (row: T, checked: boolean) => void;
  render?: (row: T, value: NestedValue<T, K>) => React.ReactNode;
}

interface BaseAction {
  className?: string;
  actionButtonVariant?: "ghost" | "default";
}

interface RenderAction<T> extends BaseAction {
  render: (row: T) => React.ReactNode;
  onClick?: (row: T) => void;
  icon?: never;
  label?: never;
}

interface ClickAction<T> extends BaseAction {
  onClick: (row: T) => void;
  icon?: LucideIcon;
  label?: string;
  render?: never;
}

export type Action<T> = RenderAction<T> | ClickAction<T>;

// --------------------------------
// 3. Props for DataTable
// --------------------------------
interface DataTableProps<T> {
  data: T[];
  columns: Array<Column<T>>;
  actions?: Action<T>[];
  actionsHeaderClass?: string;
  actionsCellClass?: string;
  currentPage?: number;
  nextPageUrl?: string | null;
  prevPageUrl?: string | null;
  totalPages?: number;
  setPaginate?: (params: {
    page?: number;
    search?: string;
    limit?: number;
  }) => void;
  searchPlaceholder?: string;
  onRowClick?: (row: T) => void;
  className?: string;
  emptyMessage?: string;
  loading?: boolean;
  rowsPerPageOptions?: number[];
  headerActions?: React.ReactNode;
}

// --------------------------------
// 4. Helper to safely get nested values
// --------------------------------
function getNestedValue<T, K extends NestedKeyOf<T>>(
  obj: T,
  path: K
): NestedValue<T, K> {
  return path.split(".").reduce((acc: any, key) => acc?.[key], obj);
}

// --------------------------------
// 5. Table component
// --------------------------------
function CustomTable<T extends { id?: string | number }>({
  data,
  columns,
  actions = [],
  actionsHeaderClass,
  actionsCellClass,
  currentPage = 1,
  nextPageUrl = null,
  prevPageUrl = null,
  totalPages,
  setPaginate,
  searchPlaceholder = "",
  onRowClick,
  className = "",
  emptyMessage = "",
  loading = false,
  rowsPerPageOptions = [10, 20, 50],
  headerActions,
}: DataTableProps<T>) {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchInput, setSearchInput] = useState(
    searchParams.get("search") || ""
  );
  const [isSearching, setIsSearching] = useState(false);

  const currentSearch = searchParams.get("search") || "";
  const currentLimit = searchParams.get("limit") || "10";

  const finalSearchPlaceholder = searchPlaceholder || t("table.search");
  const noDataMessage = emptyMessage || t("table.noData");

  // Handle search debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const newParams = new URLSearchParams(searchParams);

      if (searchInput.trim()) {
        newParams.set("search", searchInput.trim());
      } else {
        newParams.delete("search");
      }
      newParams.set("page", "1");

      if (searchInput.trim() !== currentSearch) {
        setSearchParams(newParams);

        if (setPaginate) {
          setPaginate({
            search: searchInput.trim(),
            page: 1,
            limit: parseInt(currentLimit),
          });
        }
      }

      setIsSearching(false);
    }, 500);

    if (searchInput.trim() !== currentSearch) {
      setIsSearching(true);
    }

    return () => clearTimeout(timeoutId);
  }, [
    searchInput,
    currentSearch,
    searchParams,
    setSearchParams,
    setPaginate,
    currentLimit,
  ]);

  useEffect(() => {
    setSearchInput(currentSearch);
  }, [currentSearch]);

  const handleSearchInputChange = useCallback((value: string) => {
    setSearchInput(value);
  }, []);

  const handlePageChange = useCallback(
    (page: number) => {
      const newParams = new URLSearchParams(searchParams);
      newParams.set("page", page.toString());
      setSearchParams(newParams);

      if (setPaginate) {
        setPaginate({
          page,
          search: currentSearch,
          limit: parseInt(currentLimit),
        });
      }
    },
    [searchParams, setSearchParams, setPaginate, currentSearch, currentLimit]
  );

  const handleRowsPerPageChange = useCallback(
    (newLimit: string) => {
      const newParams = new URLSearchParams(searchParams);
      newParams.set("limit", newLimit);
      newParams.set("page", "1");
      setSearchParams(newParams);

      if (setPaginate) {
        setPaginate({
          limit: parseInt(newLimit),
          page: 1,
          search: currentSearch,
        });
      }
    },
    [searchParams, setSearchParams, setPaginate, currentSearch]
  );

  // ----------------------------
  // Render cell with nested key
  // ----------------------------
  const renderCellContent = <K extends NestedKeyOf<T>>(
    row: T,
    column: Column<T, K>
  ) => {
    const value = getNestedValue(row, column.key);

    const badgeClass =
      column.badgeClass?.(value as any) || "bg-gray-100 text-gray-800";

    switch (column.type) {
      case "avatar":
        return (
          <Avatar>
            <AvatarImage
              src={`${import.meta.env.VITE_API_BASE_URL}${value as string}`}
              alt={column.alt || ""}
            />
            <AvatarFallback>
              {column.fallback ||
                (value as string)?.toString().slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        );

      case "switch":
        return (
          <Switch
            checked={!!value}
            onCheckedChange={(checked) => column.onChange?.(row, checked)}
          />
        );

      case "link":
        return (
          <a
            href={value as string}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-secondary"
          >
            {typeof column.displayValue === "string"
              ? column.displayValue
              : (value as string)}
          </a>
        );

      case "badge":
        return (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${badgeClass}`}
          >
            {column.displayValue
              ? typeof column.displayValue === "function"
                ? column.displayValue(value as any)
                : column.displayValue
              : (value as string)}
          </span>
        );

      case "custom":
        return column.render ? column.render(row, value as any) : null;

      default:
        return column.render
          ? column.render(row, value as any)
          : (value as React.ReactNode);
    }
  };

  // ----------------------------
  // Main render
  // ----------------------------
  return (
    <div className={`w-full min-w-0 ${className}`}>
      {/* Header with search */}
      <div className="w-full bg-muted py-4 px-2 md:px-6 min-h-20 rounded-t-3xl flex justify-end items-center gap-4 min-w-fit">
        {headerActions && (
          <div className="flex items-center gap-2">{headerActions}</div>
        )}
        <div className="relative flex-shrink max-w-sm w-full ms-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
          {isSearching && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="w-4 h-4 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          <Input
            placeholder={finalSearchPlaceholder}
            className={`pl-10 py-6 border-none bg-white ${
              isSearching ? "pr-10" : ""
            }`}
            value={searchInput}
            onChange={(e) => handleSearchInputChange(e.target.value)}
            autoFocus
          />
        </div>
      </div>

      {/* Table */}
      <div
        className="overflow-x-auto overflow-y-visible"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        <div className="min-w-max border">
          <Table className="w-auto min-w-full text-primary">
            <TableHeader>
              <TableRow>
                {columns.map((column, index) => (
                  <TableHead
                    key={column.key || index}
                    className={`${
                      column.headerClass || ""
                    } whitespace-nowrap capitalize py-5 text-muted-foreground`}
                    style={{ width: column.width, minWidth: column.width }}
                  >
                    {typeof column.header === "function"
                      ? column.header()
                      : column.header}
                  </TableHead>
                ))}
                {actions.length > 0 && (
                  <TableHead
                    className={`w-32 min-w-32 whitespace-nowrap capitalize text-muted-foreground ${
                      actionsHeaderClass || ""
                    }`}
                  >
                    {t("table.actions", { defaultValue: "Actions" })}
                  </TableHead>
                )}
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length + (actions.length > 0 ? 1 : 0)}
                    className="text-center py-8"
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                      <span>{t("table.loading")}</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : data.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length + (actions.length > 0 ? 1 : 0)}
                    className="text-center py-8"
                  >
                    {noDataMessage}
                  </TableCell>
                </TableRow>
              ) : (
                data.map((row, index) => (
                  <TableRow
                    key={row.id || index}
                    className={
                      onRowClick ? "cursor-pointer hover:bg-muted/50" : ""
                    }
                    onClick={() => onRowClick?.(row)}
                  >
                    {columns.map((column, colIndex) => (
                      <TableCell
                        key={column.key || colIndex}
                        className={`${
                          column.cellClass || ""
                        } whitespace-nowrap`}
                      >
                        {renderCellContent(row, column)}
                      </TableCell>
                    ))}
                    {actions.length > 0 && (
                      <TableCell
                        className={`whitespace-nowrap ${
                          actionsCellClass || ""
                        }`}
                      >
                        <div
                          className={`flex items-center space-x-2 ${
                            actionsCellClass ? "justify-center" : ""
                          }`}
                        >
                          {actions.map((action, actionIndex) =>
                            action.render ? (
                              <div
                                key={actionIndex}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  action.onClick?.(row);
                                }}
                              >
                                {action.render(row)}
                              </div>
                            ) : (
                              <Button
                                type="button"
                                key={actionIndex}
                                variant={action.actionButtonVariant || "ghost"}
                                size="sm"
                                className={action.className || ""}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  action.onClick(row);
                                }}
                              >
                                {action.icon && (
                                  <action.icon className="h-4 w-4 mr-1" />
                                )}
                                {action.label}
                              </Button>
                            )
                          )}
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      {(setPaginate || totalPages) && (
        <div className="bg-muted py-4 px-6 min-w-fit rounded-b-3xl">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-2 w-full lg:w-auto">
              <span className="text-sm font-medium whitespace-nowrap">
                {t("table.rowsPerPage")}
              </span>
              <Select
                value={currentLimit}
                onValueChange={handleRowsPerPageChange}
              >
                <SelectTrigger className="w-18 text-xs py-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {rowsPerPageOptions.map((option) => (
                    <SelectItem
                      key={option}
                      value={option.toString()}
                      className="py-2"
                    >
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {totalPages ? (
              <CustomPagination
                totalPages={totalPages}
                currentPage={currentPage}
                onPageChange={handlePageChange}
              />
            ) : (
              <Pagination className="flex justify-center lg:justify-end">
                <PaginationContent className="flex-wrap">
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={
                        !prevPageUrl
                          ? undefined
                          : () => handlePageChange(currentPage - 1)
                      }
                      className={
                        !prevPageUrl
                          ? "opacity-50 cursor-not-allowed pointer-events-none"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>

                  <PaginationItem>
                    <PaginationLink isActive>{currentPage}</PaginationLink>
                  </PaginationItem>

                  <PaginationItem>
                    <PaginationNext
                      onClick={
                        !nextPageUrl
                          ? undefined
                          : () => handlePageChange(currentPage + 1)
                      }
                      className={
                        !nextPageUrl
                          ? "opacity-50 cursor-not-allowed pointer-events-none"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default CustomTable;
