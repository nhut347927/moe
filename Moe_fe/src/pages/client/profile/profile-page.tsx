"use client";

import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import PostCompo from "@/components/post/post";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/common/hooks/use-toast";
import axiosInstance from "@/services/axios/axios-instance";
import {
  Bell,
  EllipsisVertical,
  Eye,
  Pencil,
  UploadCloud,
  UserCog,
} from "lucide-react";
import { AccountDetail, PostAccount } from "../types";
import Spinner from "@/components/common/spiner";
import { Page } from "@/common/hooks/type";
import ActionMenuDialog from "@/components/dialog/action-menu-dialog";
import { DialogClose } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import Cookies from "js-cookie";
import { convertFileToBase64 } from "@/common/utils/utils";

export function ProfilePage() {
  const { toast } = useToast();
  const location = useLocation();
  const [accountDetail, setAccountDetail] = useState<AccountDetail | null>(
    null
  );
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Extract userCode from URL query parameter
  const [userCode, setUserCode] = useState<string>(
    new URLSearchParams(location.search).get("code") || ""
  );
  useEffect(() => {
    const code = new URLSearchParams(location.search).get("code") || "";
    setUserCode(code);
  }, [location.search]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const initialProfile = {
    displayName: accountDetail?.displayName || "",
    userName: accountDetail?.userName || "",
    bio: accountDetail?.bio || "",
  };
  const [form, setForm] = useState(initialProfile);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = async () => {
    if (!form.displayName.trim() || !form.userName.trim() || !form.bio.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all fields.",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      await axiosInstance.post("accounts/update-profile", form);
      setAccountDetail((prev) => (prev ? { ...prev, ...form } : prev));
      toast({
        title: "Success",
        description: "Profile updated successfully.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Update failed",
        description:
          error.response?.data?.message || "An unknown error occurred.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditAvatar = () => {
    document.getElementById("avatarUploadInput")?.click();
  };

  const handleAvatarFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({
        variant: "destructive",
        description: "File must be an image (e.g., PNG, JPEG).",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        variant: "destructive",
        description: "Image file is too large. Maximum size allowed is 5MB.",
      });
      return;
    }

    try {
      const base64 = await convertFileToBase64(file);
      toast({
        description: "Processing avatar upload...",
      });
      const response = await axiosInstance.post("accounts/update-avatar", {
        code: base64,
      });
      const newAvatarUrl = response.data.data;
      Cookies.set("avatar", newAvatarUrl);
      setAccountDetail((prev) =>
        prev ? { ...prev, avatarUrl: newAvatarUrl } : prev
      );
      toast({
        description: "Avatar updated successfully!",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        description: error.response?.data?.message || "Failed to upload avatar",
      });
    }
  };

  const fetchAccountProfile = async (code: string): Promise<AccountDetail> => {
    try {
      const response = await axiosInstance.get<{ data: AccountDetail }>(
        code ? `accounts/detail` : `accounts/me`,
        code ? { params: { code } } : undefined
      );
      console.log("fetchAccountProfile response:", response.data); // Debug log
      if (!code) {
        setUserCode(response.data.data.userCode);
      }
      return response.data.data;
    } catch (error: any) {
      console.error(
        "fetchAccountProfile error:",
        error.response?.data || error
      ); // Debug log
      throw new Error(
        error.response?.data?.message || "Failed to fetch profile"
      );
    }
  };

  const fetchAccountPost = async (
    code: string,
    page: string
  ): Promise<Page<PostAccount>> => {
    try {
      const response = await axiosInstance.get<{ data: Page<PostAccount> }>(
        `accounts/posts`,
        {
          params: { code, page, size: "12", sort: "desc" },
        }
      );
      console.log("fetchAccountPost response:", response.data); // Debug log
      return response.data.data;
    } catch (error: any) {
      console.error("fetchAccountPost error:", error.response?.data || error); // Debug log
      throw new Error(error.response?.data?.message || "Failed to fetch posts");
    }
  };

  const followOrUnfollow = async (code: string): Promise<void> => {
    try {
      await axiosInstance.post<{ data: void }>("accounts/follow", { code });
    } catch (error: any) {
      console.error("followOrUnfollow error:", error.response?.data || error); // Debug log
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
              follower: String(
                Number(prev.follower) + (prev.isFollowing ? -1 : 1)
              ),
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

  const loadMorePost = async (userCode: string, page: string) => {
    try {
      const newPosts = await fetchAccountPost(userCode, page);
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
    } catch (error: any) {
      toast({
        variant: "destructive",
        description:
          error.response?.data?.message || "Failed to fetch more posts!",
      });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const profileData = await fetchAccountProfile(userCode);
        const postsData = await fetchAccountPost(profileData.userCode, "0");
        setAccountDetail({
          ...profileData,
          posts: postsData.contents || [],
          page: 1,
          hasNext: postsData.hasNext,
        });
      } catch (error: any) {
        toast({
          variant: "destructive",
          description: error.message || "Failed to load profile or posts",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [userCode]);

  return (
    <div className="relative flex-1 flex justify-center">
      {(isLoading || !userCode || !accountDetail) && (
        <div className="absolute z-50 inset-0 flex flex-col items-center justify-center bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm text-muted-foreground">
          <Spinner className="h-8 w-8 mb-3" />
          <p className="text-sm font-medium">Loading profile...</p>
        </div>
      )}
      <div className="absolute p-2 z-50 top-0 right-1">
        <Button
          variant="outline"
          size="icon"
          className="bg-zinc-100/60 text-zinc-800 hover:bg-zinc-200 border border-zinc-300 dark:bg-white/5 dark:text-white dark:border-white/10 dark:hover:bg-white/10 transition-colors rounded-full"
        >
          <EllipsisVertical className="w-5 h-5" />
        </Button>
      </div>
      <ScrollArea
        className="flex-1 max-h-full h-screen max-w-3xl w-full p-2 overflow-y-auto overflow-x-hidden relative"
        data-scroll-ignore
      >
        <div className="w-full mx-auto px-2 pb-96">
          <div className="grid grid-cols-[auto,1fr] gap-4 py-6 mb-6 mt-6 items-start">
            {/* Avatar */}
            <div className="w-24 sm:w-36 aspect-square overflow-hidden">
              <div className="relative group">
                <Avatar className="w-full h-full z-10 border-4 border-zinc-300 dark:border-zinc-700 rounded-full">
                  <AvatarImage
                    src={`https://res.cloudinary.com/dwv76nhoy/image/upload/w_200,h_200,c_thumb,f_auto,q_auto/${accountDetail?.avatarUrl}`}
                  />
                  <AvatarFallback>
                    {accountDetail?.displayName?.charAt(0) ?? "MOE"}
                  </AvatarFallback>
                </Avatar>
                <input
                  id="avatarUploadInput"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarFileChange}
                />
                <Button
                  onClick={handleEditAvatar}
                  className="absolute w-9 h-9 z-30 bottom-0 right-1 p-1 rounded-full bg-white dark:bg-zinc-800 border shadow hover:scale-105 transition"
                  aria-label="Edit avatar"
                >
                  <Pencil className="w-4 h-4 text-zinc-700 dark:text-zinc-200" />
                </Button>
              </div>
            </div>

            {/* Info */}
            <div className="space-y-2 min-w-0 overflow-hidden">
              {/* Name + Follow button */}
              <div className="grid grid-cols-[1fr_auto] items-start gap-2 mb-4">
                <div className="min-w-0 max-w-full">
                  <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 truncate">
                    {accountDetail?.displayName ?? "[DisplayName]"}
                  </h2>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 truncate">
                    @{accountDetail?.userName ?? "[UserName]"}
                  </p>
                </div>

                <Button
                  variant={accountDetail?.isFollowing ? "outline" : "default"}
                  className="rounded-full px-4 text-sm shrink-0"
                  disabled={
                    accountDetail?.userAccountCode ===
                    accountDetail?.userCurrentCode
                  }
                  onClick={() => handleFollow(accountDetail?.userCode ?? "0")}
                >
                  {accountDetail?.userAccountCode ===
                  accountDetail?.userCurrentCode
                    ? "You"
                    : accountDetail?.isFollowing
                    ? "Following"
                    : "Follow"}
                </Button>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-4 text-sm text-zinc-700 dark:text-zinc-200">
                <p className="text-xs">{accountDetail?.followed} Following</p>
                <p className="text-xs">{accountDetail?.follower} Followers</p>
                <p className="text-xs">{accountDetail?.likeCount} Likes</p>
              </div>

              {accountDetail?.userAccountCode ===
              accountDetail?.userCurrentCode ? (
                <div className="flex justify-start gap-2">
                  <ActionMenuDialog
                    trigger={
                      <Button
                        className="bg-white text-black border border-zinc-300 hover:bg-zinc-100 
                  dark:bg-zinc-900 dark:text-white dark:border-zinc-600 dark:hover:bg-zinc-800
                  flex items-center gap-2 rounded-xl"
                        aria-label="Edit profile"
                      >
                        <UserCog className="w-4 h-4" />
                        Edit Profile
                      </Button>
                    }
                    size="sm"
                    className="!rounded-3xl p-0 overflow-hidden"
                  >
                    <div className="p-5 space-y-5 text-sm">
                      {/* Display Name */}
                      <div className="space-y-1">
                        <label className="block font-medium text-zinc-700 dark:text-zinc-300">
                          Display Name
                        </label>
                        <Input
                          name="displayName"
                          value={form.displayName}
                          onChange={handleChange}
                          placeholder="Your display name"
                          className="text-sm rounded-xl"
                        />
                      </div>

                      {/* Username */}
                      <div className="space-y-1">
                        <label className="block font-medium text-zinc-700 dark:text-zinc-300">
                          Username
                        </label>
                        <Input
                          name="userName"
                          value={form.userName}
                          onChange={handleChange}
                          placeholder="Your username"
                          className="text-sm rounded-xl"
                        />
                      </div>

                      {/* Bio */}
                      <div className="space-y-1">
                        <label className="block font-medium text-zinc-700 dark:text-zinc-300">
                          Bio
                        </label>
                        <Textarea
                          name="bio"
                          value={form.bio}
                          onChange={handleChange}
                          placeholder="Tell us something about yourself..."
                          className="text-sm min-h-[100px] resize-none rounded-xl"
                        />
                      </div>

                      {/* Actions */}
                      <div className="flex justify-end gap-3 pt-2">
                        <DialogClose asChild>
                          <Button variant="ghost" className="text-sm">
                            Cancel
                          </Button>
                        </DialogClose>
                        <Button
                          onClick={handleSubmit}
                          disabled={isSubmitting}
                          className="text-sm"
                        >
                          {isSubmitting ? "Saving..." : "Save Changes"}
                        </Button>
                      </div>
                    </div>
                  </ActionMenuDialog>
                  <Link to="/client/upload">
                    <Button
                      className="bg-white text-black border border-zinc-300 hover:bg-zinc-100 
                dark:bg-zinc-900 dark:text-white dark:border-zinc-600 dark:hover:bg-zinc-800
                flex items-center gap-2 rounded-xl"
                      aria-label="Upload new post"
                    >
                      <UploadCloud className="w-4 h-4" />
                      Upload
                    </Button>
                  </Link>
                </div>
              ) : (
                ""
              )}
              {/* Bio */}
              {accountDetail?.bio && (
                <p className="text-sm text-zinc-600 dark:text-zinc-300 line-clamp-3 break-words">
                  {accountDetail?.bio}
                </p>
              )}
            </div>
          </div>

          {/* Posts */}
          <div className="grid grid-cols-3 gap-1">
            {accountDetail?.posts?.length ? (
              accountDetail?.posts.map((post) => (
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
                  <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black bg-opacity-60 rounded-lg px-2 py-0.5">
                    <Eye className="h-4 w-4 text-white" />
                    <span className="text-xs text-white font-medium">
                      {post.viewCount}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-zinc-500 dark:text-zinc-400 col-span-3 py-4">
                No posts available
              </p>
            )}
          </div>
          {accountDetail?.hasNext && (
            <div className="flex justify-center">
              <button
                onClick={() =>
                  loadMorePost(
                    accountDetail?.userCode,
                    String(accountDetail?.page)
                  )
                }
                className="px-4 py-1.5 mt-12 text-sm rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
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
