import { useState, useEffect, useCallback, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Post } from "../types";
import { useGetApi } from "@/common/hooks/use-get-api";
import { Page } from "@/common/hooks/type";
import PostCompo from "@/components/post/post-compo";
import { Button } from "@/components/ui/button";
import { debounce } from "lodash";
import { Clapperboard, Images } from "lucide-react";

export default function ViewHistoryPage() {
  const [page, setPage] = useState(0);
  const [posts, setPosts] = useState<Post[]>([]);
  const [sort, setSort] = useState<"asc" | "desc">("desc");
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const size = 12;
  const scrollAreaRef = useRef<HTMLDivElement>(null); // Ref for ScrollArea viewport

  const { data, loading, error, refetch } = useGetApi<Page<Post>>({
    endpoint: "/activity/views",
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

  // const handleCloseModal = useCallback(() => {
  //   setSelectedPost(null);
  // }, []);

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
      <ScrollArea className="flex-1 max-h-full h-screen  w-full p-2 overflow-y-auto overflow-x-hidden relative">
    <div className="max-w-4xl mx-auto w-full">
          <div ref={scrollAreaRef} className="h-full overflow-y-auto">
          {/* Header with sort */}
          <div className="bg-zinc-100 dark:bg-zinc-800 rounded-3xl px-6 py-8 mb-6  transform transition-transform duration-300  border border-transparent hover:border-zinc-400 dark:hover:border-zinc-500">
            <div className="flex flex-col space-y-4">
              <div>
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                  View History <span className="animate-pulse">🕘</span>
                </h2>
                <p className="text-sm text-zinc-600 dark:text-zinc-300 mt-1">
                  A list of posts or items you’ve recently viewed.
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

          <div className="grid grid-cols-3 gap-0.5 mt-4">
            {posts.map((relatedPost) => (
              <div
                key={relatedPost.postCode}
                className="aspect-[4/5] bg-zinc-200 dark:bg-zinc-800 overflow-hidden rounded-xl relative cursor-pointer"
                onClick={() => handlePostClick(relatedPost.postCode)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handlePostClick(relatedPost.postCode);
                  }
                }}
                aria-label={`Open post ${relatedPost.postCode}`}
              >
                {relatedPost.postType === "VID" ? (
                  <img
                    src={`https://res.cloudinary.com/dazttnakn/video/upload/w_300,c_fill,q_auto,so_${
                      relatedPost.thumbnail ?? "0"
                    }/${relatedPost.videoUrl}.jpg`}
                    className="w-full h-full object-cover"
                    alt={`Video thumbnail for post ${relatedPost.postCode}`}
                    draggable={false}
                    loading="lazy"
                  />
                ) : (
                  <img
                    src={`https://res.cloudinary.com/dazttnakn/image/upload/${relatedPost.imageUrls[0]}`}
                    className="w-full h-full object-cover"
                    alt={`Image thumbnail for post ${relatedPost.postCode}`}
                    draggable={false}
                    loading="lazy"
                  />
                )}
  {/* Icon loại bài (video hoặc ảnh) */}
                    <div className="absolute top-3 right-3">
                      {relatedPost.postType === "VID" ? (
                        <Clapperboard  className="w-4 h-4 text-white" strokeWidth={3} />
                      ) : (
                        <Images className="w-4 h-4 text-white" strokeWidth={3}/>
                      )}
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
    </div>
      </ScrollArea>
      {/* Post modal */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 max-h-screen bg-black/60 backdrop-blur-sm flex items-center justify-center">
          <div className="relative w-full max-h-screen">
            <button
              className="absolute top-4 right-3 z-50 w-8 h-8 flex items-center justify-center bg-zinc-200 text-zinc-600 rounded-full hover:bg-zinc-300 hover:text-zinc-900 dark:bg-slate-700 dark:text-zinc-300 dark:hover:bg-slate-600 dark:hover:text-white transition-colors duration-200"
              onClick={() => setSelectedPost(null)}
              aria-label="Close post"
            >
              ✕
            </button>
            <PostCompo postCode={selectedPost} />
          </div>
        </div>
      )}
    </div>
  );
}
