"use client";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PostCompo from "@/components/post/post";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/common/hooks/use-toast";
import axiosInstance from "@/services/axios/axios-instance";
import {
  Bell,
  Clock,
  Clipboard,
  EllipsisVertical,
  Eye,
  Heart,
  Home,
  Pencil,
  Settings,
  User,
  UserCog,
  UploadCloud,
} from "lucide-react";
import { AccountDetail, AccountPost } from "../home/types";
import { convertFileToBase64 } from "@/common/utils/utils";
import ActionMenuDialog from "@/components/dialog/action-menu-dialog";
import { ModeToggle } from "@/components/common/mode-toggle";

export function MyProfilePage() {
  const { toast } = useToast();
  const [accountDetail, setAccountDetail] = useState<AccountDetail | null>(
    null
  );
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchAccountProfile = async () => {
    try {
      console.log("Fetching my profile");
      const response = await axiosInstance.post(
        `account/get-my-account-detail`
      );
      return response.data.data;
    } catch (error: any) {
      console.error("Profile fetch error:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch profile"
      );
    }
  };

  const handleEditProfile = () => {
    // Placeholder for edit profile action
    toast({
      description: "Edit profile feature coming soon!",
    });
    // TODO: Implement navigation to edit profile page or modal
    // e.g., navigate("/client/edit-profile");
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchAccountProfile();
        setAccountDetail(data);
      } catch (error: any) {
        toast({
          variant: "destructive",
          description: error.message,
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  if (isLoading && !accountDetail) {
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

  const editImg = async (base64: string) => {
    const response = await axiosInstance.post("account/update-avatar", {
      code: base64,
    });
    return response.data.data;
  };
  const handleEditAvatar = () => {
    document.getElementById("avatarUploadInput")?.click();
  };
  const handleAvatarFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const base64 = await convertFileToBase64(file);
      toast({
        variant: "default",
        description: "Processing request, please wait.",
      });
      const rp = await editImg(base64); // gọi API
      setAccountDetail((prev) => (prev ? { ...prev, avatarUrl: rp } : prev));
      toast({
        variant: "default",
        description: "Cập nhật ảnh đại diện thành công!",
      });
    } catch (err) {
      toast({
        variant: "destructive",
        description: "Có lỗi khi tải ảnh lên",
      });
    }
  };

  return (
    <div className="relative flex-1 flex justify-center">
      <div className="absolute p-2 right-0 top-0 z-50 flex">
        <ActionMenuDialog
          trigger={
            <Button
              variant="outline"
              className="flex justify-center items-center p-2.5 rounded-full"
            >
              <Settings className="h-4 w-4" />
            </Button>
          }
          size="sm"
          className="rounded-3xl p-0 overflow-hidden"
        >
          <div className="p-4 space-y-4">
            {/* Toggle theme */}
            <div className="w-full my-4 flex items-center justify-between">
              <ModeToggle />
            </div>

            <Button
              variant="ghost"
              className="w-full justify-start gap-2 text-sm px-3 py-2"
              // onClick={handleCopyUsername}
            >
              <Clipboard className="w-4 h-4" />
              Copy username to clipboard
            </Button>

            <Button
              variant="ghost"
              className="w-full justify-start gap-2 text-sm px-3 py-2"
              // onClick={handleViewHistory}
            >
              <Clock className="w-4 h-4" />
              View history
            </Button>

            <Button
              variant="ghost"
              className="w-full justify-start gap-2 text-sm px-3 py-2"
              //onClick={handleViewFavorites}
            >
              <Heart className="w-4 h-4" />
              Favorite posts
            </Button>
          </div>
        </ActionMenuDialog>
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
            <div className="relative group">
              <Avatar className="w-28 h-28 border-4 border-zinc-300 dark:border-zinc-700">
                <AvatarImage
                  src={`https://res.cloudinary.com/dwv76nhoy/image/upload/w_100,h_100,c_thumb,f_auto,q_auto/${accountDetail.avatarUrl}`}
                />
                <AvatarFallback>
                  {accountDetail.displayName?.charAt(0)}
                </AvatarFallback>
              </Avatar>

              {/* Icon edit overlay */}
              <input
                id="avatarUploadInput"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarFileChange}
              />

              <button
                onClick={handleEditAvatar}
                className="absolute bottom-0 right-1 p-1 rounded-full bg-white dark:bg-zinc-800 border shadow hover:scale-105 transition"
                title="Chỉnh sửa ảnh đại diện"
              >
                <Pencil className="w-4 h-4 text-zinc-700 dark:text-zinc-200" />
              </button>
            </div>
          </div>

          {/* Username */}
          <p className="text-center text-sm text-zinc-500 dark:text-zinc-400 mb-2">
            @{accountDetail.userName}
          </p>

          {/* Stats */}
          <div className="flex justify-center gap-6 text-center mb-4 text-sm text-zinc-700 dark:text-zinc-200">
            <div>
              <p className="font-semibold">{accountDetail.follower}</p>
              <p>Following</p>
            </div>
            <div>
              <p className="font-semibold">{accountDetail.followed}</p>
              <p>Followers</p>
            </div>
            <div>
              <p className="font-semibold">{accountDetail.likeCount}</p>
              <p>Likes</p>
            </div>
          </div>

          <div className="flex justify-center mb-2 gap-2">
            <Button
              className="bg-white text-black border border-zinc-300 hover:bg-zinc-100 
               dark:bg-zinc-900 dark:text-white dark:border-zinc-600 dark:hover:bg-zinc-800
               flex items-center gap-2 rounded-xl"
            >
              <UserCog className="w-4 h-4" />
              Edit Profile
            </Button>

            <Link to={"/client/upload"}>
              <Button
                className="bg-white text-black border border-zinc-300 hover:bg-zinc-100 
               dark:bg-zinc-900 dark:text-white dark:border-zinc-600 dark:hover:bg-zinc-800
               flex items-center gap-2 rounded-xl"
              >
                <UploadCloud className="w-4 h-4" />
                Upload
              </Button>
            </Link>
          </div>

          <p className="flex justify-center mb-6">{accountDetail?.bio}</p>
          {/* Posts */}
          <div className="grid grid-cols-3 gap-2">
            {accountDetail.posts?.length === 0 ? (
              <p className="col-span-3 text-center text-sm text-zinc-500 dark:text-zinc-400 mt-4">
                No posts available
              </p>
            ) : (
              accountDetail.posts.map((post) => (
                <div
                  key={post.postCode}
                  className="aspect-square bg-zinc-200 dark:bg-zinc-800 overflow-hidden rounded-3xl relative"
                >
                  {post.postType === "VID" ? (
                    <img
                      src={`https://res.cloudinary.com/dwv76nhoy/video/upload/w_300,c_fill,q_auto,so_${
                        post.videoThumbnail ?? "0"
                      }/${post.mediaUrl}.jpg`}
                      className="w-full h-full object-cover"
                      alt="post"
                      onClick={() => setSelectedPost(post.postCode)}
                    />
                  ) : (
                    <img
                      src={`https://res.cloudinary.com/dwv76nhoy/image/upload/${post.mediaUrl}`}
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
              ))
            )}
          </div>
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

export default MyProfilePage;
