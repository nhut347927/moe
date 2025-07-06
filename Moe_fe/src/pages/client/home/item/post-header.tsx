import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getTimeAgo } from "@/common/utils/utils";
import { Post, TabType } from "../types";
import { useState } from "react";
import ActionMenuDialog from "@/components/dialog/action-menu-dialog";
import { Button } from "@/components/ui/button";
import { EllipsisVertical } from "lucide-react";
import ReportDialog from "@/components/dialog/report-dialog";
import DeleteConfirmationDialog from "@/components/dialog/delete-confirmation-dialog";
import { Link } from "react-router-dom";

interface PostHeaderProps {
  post: Post;
  onchangeTab?: (tab: TabType) => void;
  handleDeletePost?: (postCode: string) => void;
}

const PostHeader = ({
  post,
  onchangeTab,
  handleDeletePost,
}: PostHeaderProps) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="p-3 pt-4 w-full space-y-4">
      <div className="w-full flex flex-wrap items-center gap-3">
  {/* Avatar */}
  <Avatar className="w-9 h-9 shrink-0">
    <AvatarImage
      src={`abc/image/upload/w_80,h_80/${post.userAvatar}`}
    />
    <AvatarFallback>{post.userDisplayName.charAt(0)}</AvatarFallback>
  </Avatar>

  {/* User info */}
  <div className="flex-1 overflow-hidden min-w-0">
    <h3 className="flex items-center space-x-1 overflow-hidden">
      <div className="flex space-x-1 overflow-hidden max-w-full">
        <Link
          to={`/client/profile?code=${post.userCode}`}
          className="truncate block max-w-[60%]"
        >
          <span className="truncate block font-semibold text-[15px] text-zinc-800 dark:text-zinc-50">
            {post.userDisplayName}
          </span>
        </Link>
        <span className="text-zinc-400 text-sm">•</span>
        <Link
          to={`/client/profile?code=${post.userCode}`}
          className="truncate block max-w-[60%] md:max-w-full"
        >
          <span
            onClick={() => onchangeTab?.("acc")}
            className="truncate block text-zinc-500 text-sm hover:underline hover:text-zinc-800 dark:text-zinc-300 dark:hover:text-zinc-50"
          >
            @{post.userName}
          </span>
        </Link>
      </div>
    </h3>
    <p className="text-xs text-muted-foreground">
      {getTimeAgo(post.createdAt)}
    </p>
  </div>

  {/* Actions */}
  <div className="flex items-center gap-2 ms-auto">
    <Button
      onClick={() => onchangeTab?.("acc")}
      variant="outline"
      className="text-xs px-2 h-7 hidden sm:flex"
    >
      Theo dõi
    </Button>
    <ActionMenuDialog
      trigger={
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full h-8 w-8 hover:bg-muted"
        >
          <EllipsisVertical className="h-5 w-5" />
        </Button>
      }
      size="sm"
      className="rounded-3xl p-0 overflow-hidden"
    >
      <div className="flex flex-col text-center text-sm">
        <div className="py-3 font-semibold text-red-500 hover:bg-gray-100 dark:hover:bg-gray-800">
          <ReportDialog
            postCode={post.postCode}
            trigger={<span>Report</span>}
          />
        </div>
        {post.userCode === post.userCurrentCode && (
          <div className="py-3 font-semibold text-red-500 hover:bg-gray-100 dark:hover:bg-gray-800">
            <DeleteConfirmationDialog
              trigger={<span>Delete</span>}
              itemName="Post"
              onConfirm={() => handleDeletePost?.(post.postCode)}
            />
          </div>
        )}
      </div>
    </ActionMenuDialog>
  </div>
</div>


      <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
        {post.title}
      </h2>
      <div className="mt-4">
        <p
          className={`w-full text-muted-foreground text-base md:text-lg leading-relaxed break-all whitespace-pre-wrap transition-all duration-300 overflow-hidden ${
            !expanded
              ? post.title.length * 2 + post.description.length > 400 &&
                post.title.length * 2 > 60
                ? "line-clamp-8"
                : post.title.length * 2 + post.description.length > 500
                ? "line-clamp-10"
                : ""
              : ""
          }`}
        >
          {post.description}
        </p>

        {(post.title.length * 2 + post.description.length > 400 &&
          post.title.length * 2 > 60) ||
        post.title.length * 2 + post.description.length > 500 ? (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-sm text-zinc-500 dark:text-zinc-300 hover:text-zinc-700 dark:hover:text-zinc-400 mt-2 transition-colors duration-300"
          >
            {expanded ? "Thu gọn" : "Xem thêm"}
          </button>
        ) : null}
      </div>

      <div className="flex flex-wrap gap-2 mt-4">
        {post?.tags?.map((tag, index) => (
          <span
            key={index}
            className="
        bg-zinc-100/60 dark:bg-zinc-900/70
        text-zinc-700 dark:text-zinc-200
        px-3 py-1 text-sm rounded-full
        shadow-sm ring-1 ring-zinc-300 dark:ring-zinc-700
        backdrop-blur-md
      "
          >
            #{tag}
          </span>
        ))}
      </div>
    </div>
  );
};

export default PostHeader;
