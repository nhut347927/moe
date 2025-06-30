import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AccountDetail } from "../types";
import { Eye } from "lucide-react";
import { useState } from "react";
import PostCompo from "@/components/post/post";

interface AccountProfileProps {
  accountDetail?: AccountDetail;
  handleFollowOrUnfollow: (userCode: string) => Promise<void>;
  handleDeletePost?: (postCode: string) => void;
}

export function AccountProfile({
  accountDetail,
  handleFollowOrUnfollow,
  handleDeletePost,
}: AccountProfileProps) {
  const [selectedPost, setSelectedPost] = useState<string | null>(null);

  return (
    <ScrollArea
      className="flex-1 max-h-full h-full max-w-lg mt-5 p-2 overflow-y-auto overflow-x-hidden relative"
      data-scroll-ignore
    >
      <div className="w-full max-w-lg mx-auto px-2 pb-96">
        {/* Tên hiển thị ở giữa */}
        <h2 className="text-xl font-bold text-center text-zinc-900 dark:text-zinc-100">
          {accountDetail?.displayName}
        </h2>

        {/* Ảnh avatar */}
        <div className="flex justify-center my-4">
          <Avatar className="w-28 h-28 border-4 border-zinc-300 dark:border-zinc-700">
            <AvatarImage
              src={`https://res.cloudinary.com/dwv76nhoy/image/upload/w_100,h_100,c_thumb,f_auto,q_auto/${accountDetail?.avatarUrl}`}
            />
            <AvatarFallback>
              {accountDetail?.displayName?.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </div>

        {/* username */}
        <p className="text-center text-sm text-zinc-500 dark:text-zinc-400 mb-2">
          @{accountDetail?.userName}
        </p>

        {/* Stats */}
        <div className="flex justify-center gap-6 text-center mb-4 text-sm text-zinc-700 dark:text-zinc-200">
          <div>
            <p className="font-semibold">{accountDetail?.followed}</p>
            <p>Following</p>
          </div>
          <div>
            <p className="font-semibold">{accountDetail?.follower}</p>
            <p>Followers</p>
          </div>
          <div>
            <p className="font-semibold">{accountDetail?.likeCount}</p>
            <p>Likes</p>
          </div>
        </div>

        {/* Nút hành động */}
        <div className="flex justify-center mb-3">
          <Button
            variant={accountDetail?.isFollowing ? "outline" : "default"}
            className="rounded-full px-6 text-sm"
            disabled={
              accountDetail?.userAccountCode === accountDetail?.userCurrentCode
            }
            onClick={() => {
              if (
                accountDetail?.userAccountCode !==
                accountDetail?.userCurrentCode
              ) {
                if (accountDetail?.userCode) {
                  handleFollowOrUnfollow(accountDetail.userCode);
                }
              }
            }}
          >
            {accountDetail?.userAccountCode === accountDetail?.userCurrentCode
              ? "You"
              : accountDetail?.isFollowing
              ? "Following"
              : "Follow"}
          </Button>
        </div>
        <p className="flex justify-center mb-6">{accountDetail?.bio}</p>
        {/* Bài đăng */}
        <div className="grid grid-cols-3 gap-2">
          {accountDetail?.posts?.map((post, index) => (
            <div
              key={index}
              className="aspect-square bg-zinc-200 dark:bg-zinc-800 overflow-hidden rounded-3xl relative"
            >
              {post.postType === "VID" ? (
                <img
                  src={`https://res.cloudinary.com/dwv76nhoy/video/upload/w_300,so_${
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
          ))}
        </div>
      </div>
      {selectedPost && (
        <div className="fixed inset-0 z-50 max-h-screen bg-black/60 backdrop-blur-sm flex items-center justify-center">
          <div className="relative m-4 max-w-lg w-full overflow-y-auto">
            {/* Nút đóng */}
            <button
              className="absolute top-0 right-0 z-50 w-8 h-8 flex items-center justify-center bg-slate-200 text-zinc-600 rounded-full hover:bg-slate-300 hover:text-zinc-900 dark:bg-slate-700 dark:text-zinc-300 dark:hover:bg-slate-600 dark:hover:text-white transition-colors duration-200"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedPost(null);
              }}
            >
              ✕
            </button>

            {/* Component chi tiết bài viết */}
            <PostCompo postCode={selectedPost} />
          </div>
        </div>
      )}
    </ScrollArea>
  );
}
