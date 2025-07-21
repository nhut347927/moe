"use client";

import { useState, useEffect } from "react";
import { useGetApi } from "@/common/hooks/use-get-api";
import { useToast } from "@/common/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RefreshCw, Search, ArrowUpDown, ArrowRight } from "lucide-react";
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
import Spinner from "@/components/common/spiner";
import { Page } from "@/common/hooks/type";
import { Users } from "../type";

const UserPage = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [page, setPage] = useState<number>(0);
  const [size, setSize] = useState<number>(25);
  const [sort, setSort] = useState<string>("desc");
  const [users, setUsers] = useState<Users[]>([]);
  const [hasNext, setHasNext] = useState<boolean>(false);

  // Debounce search term
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("");
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setPage(0); // Reset to first page on new search
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Fetch users
  const { loading, error, refetch } = useGetApi<Page<Users>>({
    endpoint: "/user",
    params: {
      keyWord: debouncedSearchTerm,
      page,
      size,
      sort,
    },
    enabled: true,
    onSuccess: (data) => {
      setUsers(
        page === 0
          ? data?.contents || []
          : [...users, ...(data?.contents || [])]
      );
      setHasNext(data?.hasNext || false);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        description: error.message || "Failed to load users",
      });
    },
  });

  // Handle sort toggle
  const toggleSort = () => {
    setSort((prev) => (prev === "desc" ? "asc" : "desc"));
    setPage(0);
    setUsers([]);
  };

  // Handle size change
  const onChangeSize = (newSize: string) => {
    setSize(Number(newSize));
    setPage(0);
    setUsers([]);
  };

  return (
    <div className="w-full flex-1 flex justify-center">
      <ScrollArea className="max-w-full overflow-auto">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
          User Management
        </h1>

        {/* Search Input and Actions */}
        <div className="flex items-center gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <Input
              placeholder="Search users by keyword..."
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
            onClick={refetch}
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

        {/* Users Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Avatar</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Display Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Gender</TableHead>
              <TableHead>Provider</TableHead>
              <TableHead>Verified</TableHead>
              <TableHead>Bio</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 && !loading ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center text-zinc-500 dark:text-zinc-400"
                >
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.code}>
                  <TableCell>
                    <img
                      src={
                        user.avatar
                          ? `https://res.cloudinary.com/dazttnakn/image/upload/w_80,h_80/${user.avatar}`
                          : "/default-avatar.png"
                      }
                      alt={user.displayName}
                      className="w-8 h-8 rounded-full"
                    />
                  </TableCell>
                  <TableCell>{user.userName}</TableCell>
                  <TableCell>{user.displayName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.gender}</TableCell>
                  <TableCell>{user.provider || "N/A"}</TableCell>
                  <TableCell>{user.isVerified ? "Yes" : "No"}</TableCell>
                  <TableCell>{user.bio}</TableCell>
                  <TableCell>
                    {new Date(user.createdAt).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <a
                      href={`/admin/permissions?code=${encodeURIComponent(
                        user.code
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                      title="View Permissions"
                    >
                      <ArrowRight className="w-5 h-5" />
                    </a>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

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
            Failed to load users: {error.message}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default UserPage;
