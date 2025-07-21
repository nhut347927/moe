import { useEffect, useState, useRef } from "react";
import { useToast } from "@/common/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import axiosInstance from "@/services/axios/AxiosInstance";
import { Post } from "../types";
import { Page } from "@/common/hooks/type";
import { useGetApi } from "@/common/hooks/useGetApi";
import { Play, Pause, Heart, MessageSquareHeart } from "lucide-react";
import PostCompo from "@/components/post/PostCompo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function AudioPage() {
  const { toast } = useToast();
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const [page, setPage] = useState(0); // Start from page 0
  const [post, setPost] = useState<Post | null>(null); // Original post
  const [posts, setPosts] = useState<Post[]>([]); // Related posts
  const [postCode, setPostCode] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false); // Audio playback state
  const audioRef = useRef<HTMLAudioElement | null>(null); // Reference to audio element
  const [hasNext, setHasNext] = useState<boolean>(false);

  // Extract postCode from URL query parameter
  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("code") || "";
    setPostCode(code);
  }, []);

  // Fetch the original post
  useEffect(() => {
    if (postCode) {
      const fetchOriginalPost = async () => {
        try {
          const response = await axiosInstance.get<{ data: Post }>(
            "/posts/get",
            {
              params: { code: postCode },
            }
          );
          setPost(response.data.data);
        } catch (error) {
          toast({
            variant: "destructive",
            description: "Failed to load original post",
          });
        }
      };
      fetchOriginalPost();
    }
  }, [postCode, toast]);

  // Fetch posts associated with the audio
  const {} = useGetApi<Page<Post>>({
    endpoint: "audios/posts-by-audio",
    params: { code: post?.audioCode || "", page, size: 10, sort: "desc" },
    enabled: !!post?.audioCode, // Only fetch when audioCode is available
    onSuccess: (data) => {
      if (!data?.contents || !Array.isArray(data.contents)) return;

      // Cập nhật trạng thái phân trang
      setHasNext(data.hasNext ?? false);

      setPosts((prev) => {
        const existingCodes = new Set(prev.map((post) => post.postCode));
        const newPosts = data.contents.filter(
          (post) => !existingCodes.has(post.postCode)
        );
        return [...prev, ...newPosts];
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        description: error.message || "Failed to load related posts",
      });
    },
  });

  // Load more posts
  const loadMorePost = () => {
    setPage((prev) => prev + 1);
  };

  // Handle play/pause toggle
  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(() => {
          toast({
            variant: "destructive",
            description: "Failed to play audio",
          });
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="relative flex-1 flex justify-center">
      <ScrollArea className="flex-1 max-h-full h-screen max-w-3xl w-full p-3 overflow-y-auto overflow-x-hidden relative">
        {/* Audio header with gradient background and spinning avatar */}
        <div className="w-full relative h-auto rounded-3xl overflow-hidden bg-zinc-900">
          {/* Background + Gradient */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{
              backgroundImage: post?.avatarUrl
                ? `url(https://res.cloudinary.com/dazttnakn/image/upload/w_600,h_300,c_fill,f_auto,q_auto/${post.avatarUrl})`
                : "none",
              backgroundColor: !post?.avatarUrl ? "#1e293b" : "transparent",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-10" />

          {/* Content */}
          <div className="relative z-20 px-4 py-5 md:px-6 md:py-8 flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
            {/* Avatar + Info */}
            <div className="flex items-center gap-4 md:gap-6">
              <Avatar
                className={`w-24 h-24 md:w-28 md:h-28 border-4 border-white dark:border-zinc-700 rounded-full shadow-md ${
                  isPlaying ? "animate-spin-slow" : ""
                }`}
              >
                <AvatarImage
                  src={`https://res.cloudinary.com/dazttnakn/image/upload/w_200,h_200,c_thumb,f_auto,q_auto/${post?.avatarUrl}`}
                  alt="Audio avatar"
                />
                <AvatarFallback className="text-base md:text-xl">
                  {post?.audioOwnerDisplayName?.charAt(0) ?? "M"}
                </AvatarFallback>
              </Avatar>

              <div className="max-w-xs sm:max-w-md">
                <h1 className="text-white text-lg sm:text-xl md:text-2xl font-bold leading-snug">
                  {post?.title || "Untitled Audio"}
                </h1>
                <p className="text-zinc-300 text-sm sm:text-base">
                  Original sound by{" "}
                  <span className="underline font-medium">
                    {post?.audioOwnerDisplayName ?? "MOE"}
                  </span>
                </p>
                <p className="text-xs text-zinc-400 mt-1">
                  {post?.createdAt
                    ? new Date(post.createdAt).toLocaleDateString()
                    : ""}
                </p>
              </div>
            </div>

            {/* Controls + Stats */}
            <div className="flex items-center gap-4 flex-wrap sm:flex-nowrap">
              {post?.audioUrl && (
                <button
                  onClick={togglePlay}
                  className="w-14 h-14 md:w-16 md:h-16 flex items-center justify-center bg-white text-black dark:bg-zinc-800 dark:text-white rounded-full hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors duration-200 shadow-lg"
                  aria-label={isPlaying ? "Pause audio" : "Play audio"}
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6 md:w-7 md:h-7" />
                  ) : (
                    <Play className="w-6 h-6 md:w-7 md:h-7" />
                  )}
                </button>
              )}

              {/* Like & Comment */}
              <div className="flex gap-4 text-sm text-zinc-300 dark:text-zinc-100">
                <div className="flex items-center gap-1.5">
                  <Heart className="w-4 h-4" />
                  <span>{post?.likeCount ?? 0}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MessageSquareHeart className="w-4 h-4" />
                  <span>{post?.commentCount ?? 0}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          {post?.description && (
            <div className="relative z-20 px-4 md:px-6 pb-4 text-white">
              <p className="text-sm text-zinc-300 line-clamp-3">
                {post.description}
              </p>
            </div>
          )}

          {/* Hidden audio */}
          {post?.audioUrl && (
            <audio
              ref={audioRef}
              src={`https://res.cloudinary.com/dazttnakn/video/upload/${post.audioUrl}.mp3`}
              preload="auto"
              loop
            />
          )}
        </div>

        {/* Posts grid */}
        <div className="grid grid-cols-3 gap-2 mt-4">
          {/* Original post */}
          {post && (
            <div
              key={post.postCode}
              className="aspect-square overflow-hidden rounded-xl relative"
            >
              {post.postType === "VID" ? (
                <img
                  src={`https://res.cloudinary.com/dazttnakn/video/upload/w_300,c_fill,q_auto,so_${
                    post.thumbnail ?? "0"
                  }/${post.videoUrl}.jpg`}
                  className="w-full h-full object-cover"
                  alt="Original post"
                  onClick={() => setSelectedPost(post.postCode)}
                />
              ) : (
                <img
                  src={`https://res.cloudinary.com/dazttnakn/image/upload/${post.imageUrls[0]}`}
                  className="w-full h-full object-cover"
                  alt="Original post"
                  onClick={() => setSelectedPost(post.postCode)}
                />
              )}
              <div
                className="absolute bottom-2 left-2 flex items-center gap-1 
  rounded-lg px-2 py-0.5 text-xs font-medium
  bg-zinc-900/60 text-white 
  dark:bg-zinc-100/70 dark:text-black"
              >
                Original
              </div>
            </div>
          )}

          {/* Related posts */}
          {posts.length > 0
            ? posts.map((relatedPost) => (
                <div
                  key={relatedPost.postCode}
                  className="aspect-square bg-zinc-200 dark:bg-zinc-800 overflow-hidden rounded-xl relative"
                >
                  {relatedPost.postType === "VID" ? (
                    <img
                      src={`https://res.cloudinary.com/dazttnakn/video/upload/w_300,c_fill,q_auto,so_${
                        relatedPost.thumbnail ?? "0"
                      }/${relatedPost.videoUrl}.jpg`}
                      className="w-full h-full object-cover"
                      alt="post"
                      onClick={() => setSelectedPost(relatedPost.postCode)}
                    />
                  ) : (
                    <img
                      src={`https://res.cloudinary.com/dazttnakn/image/upload/${relatedPost.imageUrls[0]}`}
                      className="w-full h-full object-cover"
                      alt="post"
                      onClick={() => setSelectedPost(relatedPost.postCode)}
                    />
                  )}
                </div>
              ))
            : !post && (
                <p className="text-center text-zinc-500 dark:text-zinc-400 col-span-3 py-4">
                  No posts available
                </p>
              )}
        </div>

        {/* Load more button */}
        {hasNext && (
          <div className="flex justify-center">
            <button
              onClick={loadMorePost}
              className="px-4 py-1.5 mt-12 text-sm rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
            >
              Load more posts
            </button>
          </div>
        )}
      </ScrollArea>

      {/* Post modal */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 max-h-screen bg-black/60 backdrop-blur-sm flex items-center justify-center">
          <div className="relative w-full max-h-screen">
            <button
              className="absolute top-4 right-4 z-50 w-8 h-8 flex items-center justify-center bg-zinc-200 text-zinc-600 rounded-full hover:bg-zinc-300 hover:text-zinc-900 dark:bg-slate-700 dark:text-zinc-300 dark:hover:bg-slate-600 dark:hover:text-white transition-colors duration-200"
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
