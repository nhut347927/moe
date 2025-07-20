"use client";

import { useState, useEffect } from "react";
import { useGetApi } from "@/common/hooks/useGetApi";
import { useToast } from "@/common/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Search,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  ArrowUpDown,
  Clipboard,
  RefreshCw,
} from "lucide-react";
import { ActivityLog } from "../type";
import { Page } from "@/common/hooks/type";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Spinner from "@/components/common/Spiner";

// Component
const ActivityLogPage = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [page, setPage] = useState<number>(0);
  const [size, setSize] = useState<number>(10);
  const [sort, setSort] = useState<string>("desc");
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [hasNext, setHasNext] = useState<boolean>(false);
  const [viewDetail, setViewDetail] = useState<string | null>(null);
  // Debounce search term
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("");
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setPage(0); // Reset to first page on new search
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Fetch activity logs
  const { loading, error, refetch } = useGetApi<Page<ActivityLog>>({
    endpoint: "/logs",
    params: {
      keyWord: debouncedSearchTerm,
      page,
      size,
      sort,
    },
    enabled: true,
    onSuccess: (data) => {
      setLogs(
        page === 0 ? data?.contents || [] : [...logs, ...(data?.contents || [])]
      );
      setHasNext(data?.hasNext || false);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        description: error.message || "Failed to load activity logs",
      });
    },
  });

  // Handle sort toggle
  const toggleSort = () => {
    setSort((prev) => (prev === "desc" ? "asc" : "desc"));
    setPage(0); // Reset to first page on sort change
    setLogs([]); // Clear logs to avoid stale data
  };

  // Handle refresh
  const handleRefresh = () => {
    setPage(0);
    setLogs([]);
    refetch();
  };

  const onChangeSize = (newSize: string) => {
    setSize(Number(newSize));
    setPage(0); // Reset to first page on size change
    setLogs([]); // Clear logs to avoid stale data
  };

  const closeDetail = () => {
    setViewDetail(null);
  };

  // Render status icon based on response code
  const renderStatusIcon = (responseCode: string) => {
    switch (responseCode) {
      case "200":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "400":
      case "404":
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case "500":
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        description: "Copied to clipboard!",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed",
        description: "Failed to copy to clipboard",
      });
    }
  };

  return (
    <div className="w-full flex-1 flex justify-center">
      <ScrollArea className="max-w-full overflow-auto">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
          Activity Log
        </h1>

        {/* Search Input, Sort, and Refresh */}
        <div className="flex items-center gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <Input
              placeholder="Search activity logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 h-10 rounded-xl"
            />
          </div>
          <Button
            variant="outline"
            onClick={toggleSort}
            className="h-10 px-3 rounded-xl"
            title={`Sort ${sort === "desc" ? "ascending" : "descending"}`}
          >
            <ArrowUpDown className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            onClick={handleRefresh}
            className="h-10 px-3 rounded-xl"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
          <div className="w-24">
            <Select onValueChange={onChangeSize} defaultValue={size.toString()}>
              <SelectTrigger className="h-10 rounded-xl">
                <SelectValue placeholder="Size" />
              </SelectTrigger>
              <SelectContent>
                {[10, 25, 50, 100, 200].map((value) => (
                  <SelectItem key={value} value={value.toString()}>
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Table */}
        <div className="w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Status</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Error</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>IP</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.length === 0 && !loading ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-center text-zinc-500 dark:text-zinc-400"
                  >
                    No activity logs found
                  </TableCell>
                </TableRow>
              ) : (
                logs.map((log) => (
                  <TableRow key={log.code}>
                    <TableCell>{renderStatusIcon(log.responseCode)}</TableCell>

                    <TableCell
                      onClick={() => setViewDetail(log.type)}
                      className="uppercase cursor-pointer"
                    >
                      {log.type}
                    </TableCell>

                    <TableCell
                      onClick={() => setViewDetail(log.data)}
                      className="max-w-xs overflow-hidden text-ellipsis whitespace-nowrap cursor-pointer"
                      title={log.data}
                    >
                      {log.data}
                    </TableCell>

                    <TableCell
                      onClick={() => setViewDetail(log.error)}
                      className="max-w-xs overflow-hidden text-ellipsis whitespace-nowrap cursor-pointer"
                      title={log.error}
                    >
                      {log.error || "No error"}
                    </TableCell>

                    <TableCell
                      onClick={() => setViewDetail(log.message)}
                      className="max-w-xs overflow-hidden text-ellipsis whitespace-nowrap cursor-pointer"
                      title={log.message}
                    >
                      {log.message}
                    </TableCell>

                    <TableCell
                      onClick={() => setViewDetail(log.ip)}
                      className="max-w-xs overflow-hidden text-ellipsis whitespace-nowrap cursor-pointer"
                      title={log.ip}
                    >
                      {log.ip}
                    </TableCell>

                    <TableCell
                      onClick={() => setViewDetail(log.userCode)}
                      className="max-w-xs overflow-hidden text-ellipsis whitespace-nowrap cursor-pointer"
                      title={log.userCode}
                    >
                      {log.userCode}
                    </TableCell>

                    <TableCell
                      onClick={() => setViewDetail(log.createdAt)}
                      className="flex items-center gap-1 cursor-pointer whitespace-nowrap"
                      title={new Date(log.createdAt).toLocaleString()}
                    >
                      <Clock className="w-4 h-4 text-zinc-400" />
                      {new Date(log.createdAt).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {hasNext && !loading && (
          <div className="text-center mt-4">
            <Button
              variant="outline"
              onClick={() => setPage((prev) => prev + 1)}
              disabled={loading}
              className="px-4 py-1.5 text-sm rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-700"
            >
              Load More
            </Button>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center mt-4">
            <Spinner className="w-6 h-6 text-zinc-500" />
            <span className="ml-2 text-sm text-zinc-500">Loading...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center text-red-500 mt-4">
            Failed to load activity logs: {error.message}
          </div>
        )}

        {/* Detail Modal */}
        {viewDetail && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 w-[95vw] max-w-3xl shadow-lg relative">
              <h2 className="text-lg font-semibold mb-4">
                Activity Log Details
              </h2>
              <div className="max-h-[60vh] overflow-y-auto mb-4">
                <p className="whitespace-pre-wrap break-words">{viewDetail}</p>
              </div>
              <div className="flex justify-end items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => copyToClipboard(viewDetail)}
                  className="text-sm h-9 rounded-lg"
                >
                  <Clipboard className="w-4 h-4 mr-2" />
                  Copy Data
                </Button>
                <Button
                  variant="default"
                  onClick={closeDetail}
                  className="text-sm h-8 rounded-lg"
                >
                  Close
                </Button>
              </div>
              <button
                onClick={closeDetail}
                className="absolute top-4 right-4 text-xl text-gray-500 hover:text-black dark:hover:text-white"
              >
                ×
              </button>
            </div>
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default ActivityLogPage;
