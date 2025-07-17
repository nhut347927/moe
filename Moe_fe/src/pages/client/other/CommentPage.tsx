import { useState, useEffect, useCallback, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useGetApi } from "@/common/hooks/useGetApi";
import { Page } from "@/common/hooks/type";
import PostCompo from "@/components/post/PostCompo";
import { Button } from "@/components/ui/button";
import { debounce } from "lodash";
import { Link } from "react-router-dom";
import { ArrowRight, Clock, MessageCircle, Search } from "lucide-react";
import { UserComment } from "../types";

export default function CommentPage() {
  const [page, setPage] = useState(0);
  const [posts, setPosts] = useState<UserComment[]>([]);
  const [sort, setSort] = useState<"asc" | "desc">("desc");
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const size = 12;
  const scrollAreaRef = useRef<HTMLDivElement>(null); // Ref for ScrollArea viewport

  const { data, loading, error, refetch } = useGetApi<Page<UserComment>>({
    endpoint: "/user/activity/comments",
    params: { page, size, sort },
    enabled: true,
    onSuccess: (responseData) => {
      if (responseData && Array.isArray(responseData.contents)) {
        setPosts((prev) =>
          page === 0
            ? responseData.contents
            : [...prev, ...responseData.contents]
        );
      }
    },
    onError: (err) => {
      console.error("Error fetching viewed posts:", err.message);
    },
  });

  const handleScroll = useCallback(
    debounce(() => {
      const target = scrollAreaRef.current;
      if (!target) return;

      const isBottom =
        target.scrollHeight - target.scrollTop <= target.clientHeight + 50;

      console.log({
        scrollHeight: target.scrollHeight,
        scrollTop: target.scrollTop,
        clientHeight: target.clientHeight,
        isBottom,
        page,
        totalPages: data?.totalPages,
        currentPage: data?.page,
        loading,
      });

      if (
        isBottom &&
        !loading &&
        data?.page != null &&
        data?.totalPages != null &&
        Number(data.page) < Number(data.totalPages) - 1
      ) {
        console.log("Loading next page:", page + 1);
        setPage((prev) => prev + 1);
      }
    }, 200),
    [loading, data?.page, data?.totalPages, page]
  );

  const handleSortChange = useCallback(
    (newSort: "asc" | "desc") => {
      if (newSort !== sort) {
        setSort(newSort);
        setPage(0);
        setPosts([]);
      }
    },
    [sort]
  );

  useEffect(() => {
    if (page === 0) {
      setPosts([]);
    }
  }, [page]);

  useEffect(() => {
    const scrollElement = scrollAreaRef.current;
    if (scrollElement) {
      scrollElement.addEventListener("scroll", handleScroll);
      return () => scrollElement.removeEventListener("scroll", handleScroll);
    }
  }, [handleScroll]);

  const handlePostClick = useCallback((postCode: string) => {
    setSelectedPost(postCode);
  }, []);

  const handleLoadMore = () => {
    if (
      !loading &&
      data?.page != null &&
      data?.totalPages != null &&
      Number(data.page) < Number(data.totalPages) - 1
    ) {
      setPage((prev) => prev + 1);
    }
  };

  return (
    <div className="relative flex-1 flex justify-center bg-white dark:bg-zinc-900">
      <ScrollArea className="flex-1 max-h-full h-screen max-w-3xl w-full p-3 overflow-y-auto overflow-x-hidden relative">
        <div ref={scrollAreaRef} className="h-full overflow-y-auto">
          {/* Header with sort */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
              Recent Searches
            </h2>
            <div className="flex gap-2">
              <Button
                variant={sort === "desc" ? "default" : "outline"}
                onClick={() => handleSortChange("desc")}
                aria-pressed={sort === "desc"}
              >
                Newest First
              </Button>
              <Button
                variant={sort === "asc" ? "default" : "outline"}
                onClick={() => handleSortChange("asc")}
                aria-pressed={sort === "asc"}
              >
                Oldest First
              </Button>
            </div>
          </div>

          {loading && page === 0 && (
            <div className="text-center py-4 text-gray-500 dark:text-gray-400">
              Loading...
            </div>
          )}

          {error && (
            <div className="text-center py-4 text-red-500 dark:text-red-400">
              Error: {error.message}
              <button
                className="ml-2 text-blue-500 underline"
                onClick={refetch}
                aria-label="Retry fetching viewed posts"
              >
                Retry
              </button>
            </div>
          )}

          {!loading && !error && posts.length === 0 && (
            <div className="text-center py-4 text-gray-500 dark:text-gray-400">
              No viewed posts found.
            </div>
          )}

          <div className="flex flex-col gap-3 mt-4">
            {posts.map((item, index) => (
              <div
                key={index}
                className="w-full p-4 rounded-xl bg-zinc-100 dark:bg-zinc-800 transition-all duration-200 flex flex-col gap-2"
              >
                {/* Nội dung comment */}
                <div className="flex items-center gap-2 text-base font-medium text-zinc-900 dark:text-zinc-100 truncate">
                  <MessageCircle className="w-4 h-4" />
                  {item.content}
                </div>

                {/* Thời gian comment */}
                <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
                  <Clock className="w-4 h-4" />
                  {new Date(item.createAt).toLocaleString()}
                </div>

                {/* Hiện postCode và link */}
                <div className="flex items-center justify-between pt-2 text-sm text-blue-600 dark:text-blue-400">
                  <div className="truncate">Post code: {item.postCode}</div>
                  <a
                    href={`${window.location.origin}/client/home?code=${encodeURIComponent(
                      item.postCode
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 hover:underline text-sm"
                  >
                    View Post <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>

          {loading && page > 0 && (
            <div className="text-center py-4 text-gray-500 dark:text-gray-400">
              Loading more...
            </div>
          )}

          {/* Manual Load More Button for Testing */}
          {!loading &&
            data?.page != null &&
            data?.totalPages != null &&
            Number(data.page) < Number(data.totalPages) - 1 && (
              <div className="text-center py-4">
                <Button onClick={handleLoadMore}>Load More</Button>
              </div>
            )}
        </div>
      </ScrollArea>
    </div>
  );
}
