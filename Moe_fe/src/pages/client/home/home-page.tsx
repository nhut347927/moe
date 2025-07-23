import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useToast } from "@/common/hooks/use-toast";
import { Post } from "../types";
import PostContent from "./item/media";
import PostComments from "./item/comments";
import { Heart, MessageSquareHeart } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { cn, getTimeAgo } from "@/common/utils/utils";
import { useGetApi } from "@/common/hooks/use-get-api";
import { usePostApi } from "@/common/hooks/use-post-api";
import Spinner from "@/components/common/spiner";
import axiosInstance from "@/services/axios/axios-instance";

// Define fetchPostByCode function
const fetchPostByCode = async (postCode: string): Promise<Post> => {
  const response = await axiosInstance.get<{ data: Post }>("/posts/get", {
    params: { code: postCode },
  });
  return response.data.data;
};

export default function HomePage() {
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [postData, setPostData] = useState<Post[]>([]);
  const [isInitialPostFetched, setIsInitialPostFetched] = useState(false); // Track if initial post is fetched
  const mediaRefs = useRef<(HTMLDivElement | null)[]>([]);
  const currentIndex = useRef<number>(0);
  const [openComment, setOpenComment] = useState<boolean>(false);

  // Extract code from URL
  const postCodeFromUrl = searchParams.get("code");

  // Fetch initial post if code is present in URL
  useEffect(() => {
    if (postCodeFromUrl && !isInitialPostFetched) {
      const fetchInitialPost = async () => {
        try {
          const post = await fetchPostByCode(postCodeFromUrl);
          setPostData((prev) => {
            const existing = new Set(prev.map((p) => p.postCode));
            if (!existing.has(post.postCode)) {
              return [
                { ...post, comments: post.comments ?? [], isPlaying: true },
                ...prev,
              ];
            }
            return prev;
          });
          setIsInitialPostFetched(true);
        } catch (error) {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to fetch post from URL",
          });
        }
      };
      fetchInitialPost();
    }
  }, [postCodeFromUrl, isInitialPostFetched, toast]);

  // Fetch posts from /posts endpoint
  const { refetch, loading } = useGetApi<Post[]>({
    endpoint: "/posts",
    enabled: true,
    onSuccess: (data) => {
      if (!data) return;

      setPostData((prev) => {
        const existing = new Set(prev.map((p) => p.postCode));
        const newPosts = data
          .filter((p) => !existing.has(p.postCode))
          .map((p) => ({ ...p, comments: p.comments ?? [], isPlaying: false }));

        return [...prev, ...newPosts];
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    },
  });

  // Scroll Navigation Logic
  useEffect(() => {
    if (!loading) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const index = mediaRefs.current.findIndex(
                (ref) => ref === entry.target
              );

              if (index !== -1 && index !== currentIndex.current) {
                currentIndex.current = index;
                setPostData((prev) =>
                  prev.map((post, idx) => ({
                    ...post,
                    isPlaying: idx === index,
                  }))
                );
                handleView(postData[index]?.postCode);

                if (!loading && index >= postData.length - 3) {
                  refetch();
                }
              }
            }
          });
        },
        { root: null, threshold: 0.6 }
      );

      mediaRefs.current.forEach((ref) => {
        if (ref) observer.observe(ref);
      });

      return () => {
        mediaRefs.current.forEach((ref) => {
          if (ref) observer.unobserve(ref);
        });
      };
    }
  }, [postData, loading, refetch]);

  useEffect(() => {
    if (
      postData.length > 0 &&
      currentIndex.current === 0 &&
      !postData[0].isPlaying
    ) {
      setPostData((prev) =>
        prev.map((post, idx) => ({
          ...post,
          isPlaying: idx === 0,
        }))
      );
    }
  }, [postData]);

  // Handle API Calls
  const { callApi: callViewApi } = usePostApi<Post>({
    endpoint: "/posts/view",
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    },
  });

  const { callApi: callLikeApi } = usePostApi<Post>({
    endpoint: "/posts/like",
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    },
  });

  const handleView = async (code: string) => {
    if (code) {
      await callViewApi({ code });
    }
  };

  const handleLike = async (code: string) => {
    const previousPosts = [...postData];

    setPostData((prevPosts) =>
      prevPosts.map((post) =>
        post.postCode === code ? { ...post, isLiked: !post.isLiked } : post
      )
    );

    const response = await callLikeApi({ code });

    if (response.code !== 200) {
      setPostData(previousPosts);
    }
  };

  const updateImageSelect = (newImageSelect: number) => {
    setPostData((prev) =>
      prev.map((post) =>
        post.postCode === postData[currentIndex.current]?.postCode
          ? { ...post, imageSelect: newImageSelect }
          : post
      )
    );
  };

  // Render Logic
  return (
    <div className="max-h-screen h-screen w-full relative">
      <div className="absolute z-30 right-2 top-2 px-2 h-[30px] flex items-center rounded-lg">
        <span className="text-xs text-zinc-500 dark:text-zinc-500">
          {currentIndex.current + 1}/{postData.length}
        </span>
      </div>

      <div className="z-10 absolute inset-0 flex justify-center items-center">
        {postData[currentIndex.current]?.postType === "VID" ? (
          <img
            src={`https://res.cloudinary.com/dazttnakn/video/upload/so_${
              postData[currentIndex.current]?.thumbnail ?? "0"
            }/${postData[currentIndex.current]?.videoUrl}.jpg`}
            className="z-10 max-w-full max-h-full object-contain blur-3xl scale-125 opacity-90 brightness-75 transition-all"
            alt="Blur background"
          />
        ) : (
          <img
            src={`https://res.cloudinary.com/dazttnakn/image/upload/${
              postData[currentIndex.current]?.imageUrls[
                postData[currentIndex.current]?.imageSelect ?? 0
              ]
            }.jpg`}
            className="z-10 max-w-full max-h-full object-contain blur-3xl scale-125 opacity-90 brightness-75 transition-all"
            alt="Blur background"
          />
        )}
      </div>

      <div className="max-h-screen h-screen w-full flex flex-col">
        <div
          id="video-container"
          className="z-10 overflow-y-auto scroll-but-hidden snap-y snap-mandatory h-full w-full"
        >
          {postData?.length === 0 && !loading && (
            <div className="h-full w-full flex justify-center items-center space-x-2">
              <Spinner className="mr-2" /> Loading...
            </div>
          )}

          {postData?.map((post, index) => (
            <div key={index} className="h-full">
              <div
                ref={(el) => (mediaRefs.current[index] = el)}
                className="max-h-full h-full snap-center flex flex-col"
              >
                <PostContent
                  post={post}
                  updateImageSelect={updateImageSelect}
                  index={index}
                  mediaRefs={mediaRefs}
                  isPlaying={post.isPlaying}
                />
              </div>
              {index === postData?.length - 1 && !loading && (
                <div className="h-full w-full flex justify-center items-center text-sm text-gray-500">
                  <Spinner className="mr-2" /> Loading more...
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="z-30 relative sm:absolute bottom-2 left-0 right-0  pointer-events-none px-4 pt-3 flex items-end justify-between">
          <div className="pointer-events-auto mb-2 max-w-full flex items-center space-x-3">
            <Link
              to={`/client/profile?code=${
                postData[currentIndex.current]?.userCode
              }`}
            >
              <Avatar className="w-10 h-10 transition-all">
                <AvatarImage
                  src={`https://res.cloudinary.com/dazttnakn/image/upload/w_80,h_80/${
                    postData[currentIndex.current]?.avatarUrl
                  }`}
                />
                <AvatarFallback className="bg-zinc-400 text-white text-sm">
                  CN
                </AvatarFallback>
              </Avatar>
            </Link>
            <span
              onClick={() =>
                handleLike?.(postData[currentIndex.current]?.postCode)
              }
              className={cn(
                "opacity-80 min-w-[42px] min-h-[42px] w-[42px] h-[42px] p-2 rounded-full flex items-center justify-center transition-all",
                postData[currentIndex.current]?.isLiked
                  ? "bg-red-100 hover:bg-red-200"
                  : "bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700"
              )}
            >
              <Heart
                className={cn(
                  "w-5 h-5 mt-0.5 transition-colors",
                  postData[currentIndex.current]?.isLiked
                    ? "text-red-500 fill-red-500"
                    : "text-zinc-500 dark:text-zinc-500"
                )}
              />
            </span>

            <span
              className="opacity-80 min-w-[42px] min-h-[42px] w-[42px] h-[42px] p-2 rounded-full flex items-center justify-center bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700"
              onClick={() => setOpenComment(true)}
            >
              <MessageSquareHeart className="w-5 h-5 mt-0.5 text-zinc-500 dark:text-zinc-500" />
            </span>

            <div className="w-full leading-tight">
              <p className="text-[12px] text-zinc-400 dark:text-zinc-500 mb-0.5">
                [{getTimeAgo(postData[currentIndex.current]?.createdAt)}]
              </p>
              <p className="w-56 sm:w-full text-sm font-medium text-zinc-600 dark:text-zinc-300 truncate">
                {postData[currentIndex.current]?.title}
              </p>
            </div>
          </div>
        </div>
      </div>

      {openComment && (
        <>
          <div
            onClick={() => setOpenComment(false)}
            className="fixed inset-0 top-0 right-0 bg-black/40 z-40 transition-opacity"
          />
          <div className="fixed inset-0 z-50 flex justify-center items-center pointer-events-none">
            <div
              className={`
                max-w-2xl w-full mt-auto
                transform transition-all duration-300 ease-in-out
                ${
                  openComment
                    ? "opacity-100 translate-y-0 scale-100"
                    : "opacity-0 translate-y-10 scale-95"
                }
                pointer-events-auto
              `}
            >
              <div className="max-h-[80vh]" data-scroll-ignore>
                <PostComments
                  postCode={postData[currentIndex.current]?.postCode}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
