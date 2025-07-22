import { useState, useEffect, useCallback, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useGetApi } from "@/common/hooks/use-get-api";
import { Page } from "@/common/hooks/type";
import { Button } from "@/components/ui/button";
import { debounce } from "lodash";
import { KeywordSearch } from "../types";
import { Clock, Search } from "lucide-react";

export default function KeywordPage() {
  const [page, setPage] = useState(0);
  const [posts, setPosts] = useState<KeywordSearch[]>([]);
  const [sort, setSort] = useState<"asc" | "desc">("desc");
  // const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const size = 12;
  const scrollAreaRef = useRef<HTMLDivElement>(null); // Ref for ScrollArea viewport

  const { data, loading, error, refetch } = useGetApi<Page<KeywordSearch>>({
    endpoint: "/activity/search-history",
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
      <ScrollArea className="flex-1 max-h-full h-screen w-full p-2 overflow-y-auto overflow-x-hidden relative">
        <div className="max-w-4xl mx-auto w-full">
          <div ref={scrollAreaRef} className="h-full overflow-y-auto">
            {/* Header with sort */}
            <div className="bg-zinc-100 dark:bg-zinc-800 rounded-3xl px-6 py-8 mb-6 transform transition-transform duration-300  border border-transparent hover:border-zinc-400 dark:hover:border-zinc-500">
              <div className="flex flex-col space-y-4">
                <div>
                  <h2 className="text-2xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                    Search History
                    <span className="text-blue-500 animate-pulse">🔍</span>
                  </h2>
                  <p className="text-sm text-zinc-600 dark:text-zinc-300 mt-1">
                    A record of your recent searches to help you revisit what
                    you’ve explored.
                  </p>
                </div>

                <div className="flex justify-end gap-3">
                  <Button
                    variant={sort === "desc" ? "default" : "outline"}
                    onClick={() => handleSortChange("desc")}
                    aria-pressed={sort === "desc"}
                    className="rounded-lg px-4 py-2 text-sm"
                  >
                    Newest First
                  </Button>
                  <Button
                    variant={sort === "asc" ? "default" : "outline"}
                    onClick={() => handleSortChange("asc")}
                    aria-pressed={sort === "asc"}
                    className="rounded-lg px-4 py-2 text-sm"
                  >
                    Oldest First
                  </Button>
                </div>
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
                <a
                  href={`${
                    window.location.origin
                  }/client/search?q=${encodeURIComponent(item.keyWord)}`}
                  key={index}
                  className="w-full p-4 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all duration-200 flex flex-col gap-1"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 text-base font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                      <Search className="w-5 h-5" />
                      {item.keyWord}
                    </div>
                    <div className="text-xs italic text-zinc-500 dark:text-zinc-400 whitespace-nowrap ml-4">
                      Search for this keyword
                    </div>
                  </div>

                  <div className="flex justify-end items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
                    <Clock className="w-4 h-4" />
                    {new Date(item.createdAt).toLocaleString()}
                  </div>
                </a>
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
        </div>
      </ScrollArea>
    </div>
  );
}
