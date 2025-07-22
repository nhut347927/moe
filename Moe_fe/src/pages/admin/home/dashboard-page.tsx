"use client";

import { useState, useEffect } from "react";
import { useGetApi } from "@/common/hooks/use-get-api";
import { useToast } from "@/common/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RefreshCw, ChevronLeft, ChevronRight } from "lucide-react";
import { UserActivity } from "../type";
import { Page } from "@/common/hooks/type";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Dashboard = () => {
  const { toast } = useToast();
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [query, setQuery] = useState("");
  const [autoRefresh, setAutoRefresh] = useState<string>("off"); // Auto-refresh state: "off", "30s", "60s", "10m"

  // Fetch paginated active users
  const { data, loading, error, refetch } = useGetApi<Page<UserActivity>>({
    endpoint: "/logs/active-users",
    params: { keyWord: query, page, size },
    enabled: true,
    onSuccess: (data) => {
      toast({
        description: `Fetched ${data?.contents.length || 0} active users (Page ${(typeof data?.page === "number" ? data.page : 0) + 1})`,
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        description: error.message || "Failed to fetch active users",
      });
    },
  });

  // Handle size input change
  const handleSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSize = parseInt(e.target.value, 10);
    if (!isNaN(newSize) && newSize > 0) {
      setSize(newSize);
      setPage(0); // Reset to first page when size changes
    }
  };

  // Auto-refresh effect
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    if (autoRefresh !== "off") {
      const intervalTime = {
        "30s": 30 * 1000, // 30 seconds
        "60s": 60 * 1000, // 60 seconds
        "10m": 10 * 60 * 1000, // 10 minutes
      }[autoRefresh];

      intervalId = setInterval(() => {
        refetch();
        toast({
          description: `Auto-refreshed at ${new Date().toLocaleTimeString()}`,
        });
      }, intervalTime);
    }

    // Cleanup interval on component unmount or when autoRefresh changes
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [autoRefresh, refetch, toast]);

  return (
    <div className="flex-1 flex justify-center">
      <div className="w-full">
        <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">Admin Dashboard</h3>

        {/* Search, Size Input, and Active Users Count */}
        <div className="flex items-center justify-between mb-4 gap-4">
          <Input
            type="text"
            placeholder="Search by user code, display name, or IP..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(0); // Reset to first page on search
            }}
            className="max-w-xs px-4 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
          />
          <Input
            type="number"
            placeholder="Page size"
            value={size}
            onChange={handleSizeChange}
            min="1"
            className="max-w-[100px] px-4 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
          />
          <p className="text-lg text-zinc-700 dark:text-zinc-300">
            Active Users: <span className="font-semibold">{Number(data?.totalElements) || 0}</span>
          </p>
        </div>

        {/* Refresh Button, Auto-Refresh Select, and Pagination */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={refetch}
              disabled={loading}
              className="flex items-center gap-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-700"
              aria-label="Refresh active users"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Select value={autoRefresh} onValueChange={setAutoRefresh}>
              <SelectTrigger className="w-[120px] rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100">
                <SelectValue placeholder="Auto-refresh" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="off">Off</SelectItem>
                <SelectItem value="30s">30s</SelectItem>
                <SelectItem value="60s">60s</SelectItem>
                <SelectItem value="10m">10m</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
              disabled={!data?.hasPrevious || loading}
              className="p-2 rounded-xl border border-zinc-300 dark:border-zinc-700"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm text-zinc-700 dark:text-zinc-300">
              Page {data ? (Number(data.page) + 1) : 1} of {Number(data?.totalPages) || 1}
            </span>
            <Button
              variant="outline"
              onClick={() => setPage((prev) => prev + 1)}
              disabled={!data?.hasNext || loading}
              className="p-2 rounded-xl border border-zinc-300 dark:border-zinc-700"
              aria-label="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Active Users Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User Code</TableHead>
              <TableHead>Display Name</TableHead>
              <TableHead>IP Address</TableHead>
              <TableHead>First Access Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.contents.length === 0 && !loading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-zinc-500 dark:text-zinc-400">
                  No active users found
                </TableCell>
              </TableRow>
            ) : (
              data?.contents.map((user) => (
                <TableRow key={user.userCode}>
                  <TableCell className="text-zinc-900 dark:text-zinc-100">{user.userCode}</TableCell>
                  <TableCell className="text-zinc-900 dark:text-zinc-100">{user.displayName}</TableCell>
                  <TableCell className="text-zinc-900 dark:text-zinc-100">{user.ip}</TableCell>
                  <TableCell className="text-zinc-900 dark:text-zinc-100">
                    {new Date(user.firstAccessTime).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center mt-4">
            <svg className="animate-spin h-5 w-5 text-zinc-500" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            <span className="ml-2 text-sm text-zinc-500">Loading...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center text-red-500 mt-4">
            Failed to load active users: {error.message}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;