"use client";

import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useToast } from "@/common/hooks/use-toast";
import { Post } from "@/pages/client/types";
import PostContent from "@/pages/client/home/item/Media";
import PostComments from "@/pages/client/home/item/Comments";
import { Heart, MessageSquareHeart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn, getTimeAgo } from "@/common/utils/utils";
import { useGetApi } from "@/common/hooks/useGetApi";
import { usePostApi } from "@/common/hooks/usePostApi";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Spinner from "../common/Spiner";

interface PostProps {
  postCode: string | null;
}

const PostCompo = ({ postCode }: PostProps) => {
  const { toast } = useToast();
  const mediaRef = useRef<HTMLDivElement | null>(null);
  // State management
  const [postData, setPostData] = useState<Post | null>(null);
  const [openComment, setOpenComment] = useState<boolean>(false);

  // Fetch post data
  const { loading, error } = useGetApi<Post>({
    endpoint: "/posts/get",
    enabled: !!postCode,
    params: { code: postCode },

    onSuccess: (data) => {
      setPostData({ ...(data as Post), isPlaying: true });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to load post",
      });
    },
  });

  // Handle view and like API calls
  const { callApi: callViewApi } = usePostApi<void>({
    endpoint: "/posts/view",
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to record view",
      });
    },
  });

  const { callApi: callLikeApi } = usePostApi<void>({
    endpoint: "/posts/like",
    onSuccess: () => {
      setPostData((prev) =>
        prev
          ? {
              ...prev,
              isLiked: !prev.isLiked,
              likeCount: String(
                Number(prev.likeCount) + (prev.isLiked ? -1 : 1)
              ),
            }
          : null
      );
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to like/unlike",
      });
    },
  });

  // Handle view on mount
  useEffect(() => {
    if (postCode) {
      callViewApi({ code: postCode });
    }
  }, [postCode]);

  // Handle like button click
  const handleLike = async () => {
    if (!postData || !postCode) return;

    try {
      await callLikeApi({ code: postCode });
    } catch (error: any) {
      // Error is handled by onError in callLikeApi
      setPostData((prev) =>
        prev ? { ...prev, isLiked: postData.isLiked } : null
      ); // Revert on error
    }
  };
  const updateImageSelect = (newImageSelect: number) => {
    setPostData((prev) => {
      if (!prev) return prev; // nếu null hoặc undefined thì giữ nguyên
      return { ...prev, imageSelect: newImageSelect };
    });
  };

  return (
    <div className="max-h-screen h-screen relative overflow-hidden">
      {loading && (
        <div className="absolute z-50 inset-0 flex flex-col items-center justify-center bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm text-muted-foreground">
          <Spinner className="h-8 w-8 mb-3" />
          <p className="text-sm font-medium">Loading...</p>
        </div>
      )}

      {error && (
        <div className="flex-1 flex justify-center items-center h-screen">
          <p className="text-center text-zinc-500 dark:text-zinc-400">
            Failed to load post
          </p>
        </div>
      )}

      {postData && (
        <div className="h-full">
          {/* Background blur */}
          <div className="z-10 absolute inset-0 flex justify-center items-center">
            {postData?.postType === "VID" ? (
              <img
                src={`https://res.cloudinary.com/dwv76nhoy/video/upload/so_${
                  postData.thumbnail ?? "0"
                }/${postData.videoUrl}.jpg`}
                className="z-10 max-w-full max-h-full object-contain blur-3xl scale-125 opacity-90 brightness-75 transition-all"
                alt="Blur background"
              />
            ) : (
              <img
                src={`https://res.cloudinary.com/dwv76nhoy/image/upload/${
                  postData?.imageUrls[postData.imageSelect ?? 0]
                }.jpg`}
                className="z-10 max-w-full max-h-full object-contain blur-3xl scale-125 opacity-90 brightness-75 transition-all"
                alt="Blur background"
              />
            )}
          </div>
          {/* Post content */}
          <div className="z-20 overflow-y-auto h-full max-w-3xl mx-auto">
            <div className="h-full flex flex-col">
              <PostContent
                updateImageSelect={updateImageSelect}
                post={postData}
                index={0}
                mediaRefs={{ current: [mediaRef.current] }}
                isPlaying={postData.isPlaying}
              />
            </div>
          </div>
          {/* Post info and actions */}
          <div className="z-30 absolute bottom-2 left-0 right-0 px-4 flex items-end justify-between">
            <div className=" opacity-80 mb-2 max-w-3xl w-full mx-auto  flex items-center space-x-3">
              <Link to={`/client/profile?code=${postData?.userCode}`}>
                <Avatar className="w-10 h-10 transition-all">
                  <AvatarImage
                    src={`https://res.cloudinary.com/dwv76nhoy/image/upload/w_80,h_80/${postData?.avatarUrl}`}
                  />
                  <AvatarFallback className="bg-zinc-400 text-white text-sm">
                    {postData.userDisplayName?.charAt(0) || "MOE"}
                  </AvatarFallback>
                </Avatar>
              </Link>
              <Button
                onClick={handleLike}
                className={cn(
                  "w-[42px] h-[42px] p-2 rounded-full flex items-center justify-center transition-all",
                  postData.isLiked
                    ? "bg-red-100 hover:bg-red-200"
                    : "bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700"
                )}
              >
                <Heart
                  className={cn(
                    "w-5 h-5 mt-0.5 transition-colors",
                    postData.isLiked
                      ? "text-red-500 fill-red-500"
                      : "text-zinc-500 dark:text-zinc-500"
                  )}
                />
              </Button>
              <Button
                onClick={() => setOpenComment(true)}
                className="w-[42px] h-[42px] p-2 rounded-full flex items-center justify-center bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700"
              >
                <MessageSquareHeart className="w-5 h-5 mt-0.5 text-zinc-500 dark:text-zinc-500" />
              </Button>
              <div className="leading-tight">
                <p className="text-[12px] text-zinc-400 dark:text-zinc-500 mb-0.5">
                  [{getTimeAgo(postData.createdAt)}]
                </p>
                <p className="text-sm font-medium text-zinc-600 dark:text-zinc-300 truncate">
                  {postData.title}
                </p>
              </div>
            </div>
          </div>
          {/* Comments modal */}
          {openComment && (
            <>
              <div
                onClick={() => setOpenComment(false)}
                className="fixed inset-0 top-0 right-0 bg-black/40 z-40 transition-opacity"
              />
              <div className="fixed inset-0 z-50 flex justify-center items-center pointer-events-none">
                <div
                  className={cn(
                    "max-w-2xl w-full mt-auto transform transition-all duration-300 ease-in-out pointer-events-auto",
                    openComment
                      ? "opacity-100 translate-y-0 scale-100"
                      : "opacity-0 translate-y-10 scale-95"
                  )}
                >
                  <div className="max-h-[80vh]" data-scroll-ignore>
                    <PostComments postCode={postData.postCode} />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default PostCompo;
