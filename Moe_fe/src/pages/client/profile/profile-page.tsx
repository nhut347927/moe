"use client";

import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import PostCompo from "@/components/post/post";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/common/hooks/use-toast";
import axiosInstance from "@/services/axios/axios-instance";
import { Bell, EllipsisVertical, Eye, Home, Settings } from "lucide-react";
import { AccountDetail } from "../home/types";

export function ProfilePage() {
  const { toast } = useToast();
  const location = useLocation();
  const [accountDetail, setAccountDetail] = useState<AccountDetail | null>(
    null
  );
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Extract userCode from URL query parameter
  const userCode = new URLSearchParams(location.search).get("code");

  const fetchAccountProfile = async (code: string) => {
    try {
      const response = await axiosInstance.get(`account/get-account`, {
        params: { code: code },
      });

      return response.data.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch profile"
      );
    }
  };

  const followOrUnfollow = async (code: string) => {
    try {
      const response = await axiosInstance.post("account/follow", {
        code,
      });

      return response.data.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to toggle follow"
      );
    }
  };

  const handleFollow = async (userCode: string) => {
    try {
      await followOrUnfollow(userCode);
      setAccountDetail((prev) =>
        prev
          ? {
              ...prev,
              isFollowing: !prev.isFollowing,
              follower: (
                Number(prev.follower) + (prev.isFollowing ? -1 : 1)
              ).toString(),
            }
          : prev
      );
    } catch (error: any) {
      toast({
        variant: "destructive",
        description: error.message || "Failed to follow/unfollow",
      });
    }
  };

  useEffect(() => {
    if (userCode) {
      setIsLoading(true);
      Promise.all([
        fetchAccountProfile(userCode),
        fetchAccountPost(userCode, "0"),
      ])
        .then(([profileData, postsData]) => {
          setAccountDetail({
            ...profileData,
            posts: postsData.contents, // assuming postsData has a 'posts' array
            page: 1,
            hasNext: postsData.hasNext,
          });
        })
        .catch((error) => {
          toast({
            variant: "destructive",
            description: error.message || "Failed to load profile",
          });
        })
        .finally(() => setIsLoading(false));
    } else {
      toast({
        variant: "destructive",
        description: "No user code provided in URL",
      });
    }
  }, [userCode]);

  const loadMorePost = (userCode: string, page: string) => {
    fetchAccountPost(userCode, page)
      .then((newPosts) => {
        setAccountDetail((prev) =>
          prev
            ? {
                ...prev,
                posts: [...(prev.posts || []), ...(newPosts.contents || [])],
                page: Number(prev.page) + 1,
                hasNext: newPosts.hasNext,
              }
            : prev
        );
      })
      .catch((error) => {
        toast({
          variant: "destructive",
          description:
            error.response?.data?.message || "Failed to fetch more posts!",
        });
      });
  };

  const fetchAccountPost = async (code: string, page: string) => {
    const response = await axiosInstance.get(`account/posts`, {
      params: {
        code: code,
        page: page,
        size: "12",
        sort: "desc",
      },
    });
    return response.data.data;
  };

  if (!userCode) {
    return (
      <div className="flex-1 flex justify-center items-center">
        <p className="text-center text-zinc-500 dark:text-zinc-400">
          Invalid or missing user code
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex-1 flex justify-center items-center">
        <p className="text-center text-zinc-500 dark:text-zinc-400">
          Loading...
        </p>
      </div>
    );
  }

  if (!accountDetail) {
    return (
      <div className="flex-1 flex justify-center items-center">
        <p className="text-center text-zinc-500 dark:text-zinc-400">
          Profile not found
        </p>
      </div>
    );
  }

  return (
    <div className="relative flex-1 flex justify-center">
      <div className="absolute p-2 z-50 top-0 right-24">
        <Button
          variant="outline"
          size="icon"
          className="bg-zinc-100/60 text-zinc-800 hover:bg-zinc-200 border border-zinc-300 dark:bg-white/5 dark:text-white dark:border-white/10 dark:hover:bg-white/10 transition-colors rounded-full"
        >
          <EllipsisVertical className="w-5 h-5" />
        </Button>
      </div>
      <ScrollArea
        className="flex-1 max-h-full h-screen max-w-lg mt-5 p-2 overflow-y-auto overflow-x-hidden relative"
        data-scroll-ignore
      >
        <div className="w-full max-w-lg mx-auto px-2 pb-96">
          {/* Display name */}
          <h2 className="text-xl font-bold text-center text-zinc-900 dark:text-zinc-100">
            {accountDetail.displayName}
          </h2>

          {/* Avatar */}
          <div className="flex justify-center my-4">
            <Avatar className="w-28 h-28 border-4 border-zinc-300 dark:border-zinc-700">
              <AvatarImage
                src={`abc/image/upload/w_100,h_100,c_thumb,f_auto,q_auto/${accountDetail.avatarUrl}`}
              />
              <AvatarFallback>
                {accountDetail.displayName?.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Username */}
          <p className="text-center text-sm text-zinc-500 dark:text-zinc-400 mb-2">
            @{accountDetail.userName}
          </p>

          {/* Stats */}
          <div className="flex justify-center gap-6 text-center mb-4 text-sm text-zinc-700 dark:text-zinc-200">
            <div>
              <p className="font-semibold">{accountDetail.followed}</p>
              <p>Following</p>
            </div>
            <div>
              <p className="font-semibold">{accountDetail.follower}</p>
              <p>Followers</p>
            </div>
            <div>
              <p className="font-semibold">{accountDetail.likeCount}</p>
              <p>Likes</p>
            </div>
          </div>

          {/* Action button */}
          <div className="flex justify-center mb-3">
            <Button
              variant={accountDetail.isFollowing ? "outline" : "default"}
              className="rounded-full px-6 text-sm"
              disabled={
                accountDetail.userAccountCode === accountDetail.userCurrentCode
              }
              onClick={() => {
                if (
                  accountDetail.userAccountCode !==
                  accountDetail.userCurrentCode
                ) {
                  handleFollow(accountDetail.userCode);
                }
              }}
            >
              {accountDetail.userAccountCode === accountDetail.userCurrentCode
                ? "You"
                : accountDetail.isFollowing
                ? "Following"
                : "Follow"}
            </Button>
          </div>
          <p className="flex justify-center mb-6">{accountDetail?.bio}</p>
          {/* Posts */}
          <div className="grid grid-cols-3 gap-2">
            {accountDetail.posts?.map((post) => (
              <div
                key={post.postCode}
                className="aspect-square bg-zinc-200 dark:bg-zinc-800 overflow-hidden rounded-3xl relative"
              >
                {post.postType === "VID" ? (
                  <img
                    src={`abc/video/upload/w_300,c_fill,q_auto,so_${
                      post.videoThumbnail ?? "0"
                    }/${post.mediaUrl}.jpg`}
                    className="w-full h-full object-cover"
                    alt="post"
                    onClick={() => setSelectedPost(post.postCode)}
                  />
                ) : (
                  <img
                    src={`abc/image/upload/${post.mediaUrl}`}
                    className="w-full h-full object-cover"
                    alt="post"
                    onClick={() => setSelectedPost(post.postCode)}
                  />
                )}
                <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black bg-opacity-60 rounded-md px-2 py-0.5">
                  <Eye className="h-4 w-4 text-white" />
                  <span className="text-xs text-white font-medium">
                    {post.viewCount}
                  </span>
                </div>
              </div>
            ))}
          </div>
          {accountDetail?.hasNext && (
            <div className="flex justify-center">
              <button
                onClick={() => {
                  loadMorePost(
                    accountDetail.userCode,
                    String(accountDetail?.page)
                  );
                }}
                className="px-4 py-1.5 mt-4 text-sm rounded-full border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
              >
                Tải thêm bài viết
              </button>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Post Modal */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 max-h-screen bg-black/60 backdrop-blur-sm flex items-center justify-center">
          <div className="relative m-4 max-w-lg w-full rounded-lg overflow-y-auto max-h-[90vh]">
            <button
              className="absolute top-0 right-0 z-50 w-8 h-8 flex items-center justify-center bg-slate-200 text-zinc-600 rounded-full hover:bg-slate-300 hover:text-zinc-900 dark:bg-slate-700 dark:text-zinc-300 dark:hover:bg-slate-600 dark:hover:text-white transition-colors duration-200"
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

export default ProfilePage;
