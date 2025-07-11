import {
  ChevronDown,
  ChevronUp,
  Copy,
  Ellipsis,
  EllipsisVertical,
  FileX,
  Flag,
  Heart,
  Send,
  Smile,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Post, Comment, Reply, commonEmojis } from "../../types";
import { getTimeAgo } from "@/common/utils/utils";
import { ActionMenuItem } from "@/components/dialog/ActionMenuItem";
import ActionMenuDialog from "@/components/dialog/ActionMenuDialog";
import DeleteConfirmationDialog from "@/components/dialog/DeleteConfirmationDialog";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import ReportDialog from "@/components/dialog/ReportDialog";
import axiosInstance from "@/services/axios/AxiosInstance";
import { useToast } from "@/common/hooks/use-toast";
import { Page } from "@/common/hooks/type";
import Spinner from "@/components/common/Spiner";

interface CommentsProps {
  postCode: string;
}

const Comments = ({ postCode }: CommentsProps) => {
  const [expanded, setExpanded] = useState(false);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [isLoadingPost, setIsLoadingPost] = useState(false);
  const [activePostCode, setActivePostCode] = useState<string | null>(null);
  const [loadingReplies, setLoadingReplies] = useState<Record<string, boolean>>(
    {}
  );
  const [visibleReplies, setVisibleReplies] = useState<Record<string, boolean>>(
    {}
  );
  const { toast } = useToast();

  // ------------------- State Management -------------------
  const [postData, setPostData] = useState<Post | null>(null);
  const [newComment, setNewComment] = useState<string>("");
  const [replyTarget, setReplyTarget] = useState<{
    commentCode: string;
    displayName: string;
  } | null>(null);

  // ------------------- API Functions -------------------
  const fetchPostByCode = async (postCode: string): Promise<Post> => {
    const response = await axiosInstance.get<{ data: Post }>("/posts/get", {
      params: { code: postCode },
    });
    return response.data.data;
  };

  const fetchComments = async (
    code: string,
    page: number
  ): Promise<Page<Comment>> => {
    const response = await axiosInstance.get<{ data: Page<Comment> }>(
      "/comments/comments",
      {
        params: { code, page, size: 5, sort: "desc" },
      }
    );
    return response.data.data;
  };

  const fetchReplies = async (
    code: string,
    page: number
  ): Promise<Page<Reply>> => {
    const response = await axiosInstance.get<{ data: Page<Reply> }>(
      "/comments/replies",
      {
        params: { code, page, size: 5, sort: "desc" },
      }
    );
    return response.data.data;
  };

  const addComment = async (
    postCode: string,
    content: string
  ): Promise<Comment> => {
    const response = await axiosInstance.post<{ data: Comment }>("/comments", {
      code: postCode,
      content,
    });
    return {
      ...response.data.data,
      replies: [], // Initialize replies for new comment
      replyPage: 0,
      hasNext: false,
      isOpenReply: false,
    };
  };

  const addReply = async (
    commentCode: string,
    content: string
  ): Promise<Reply> => {
    const response = await axiosInstance.post<{ data: Reply }>(
      "/comments/reply",
      {
        code: commentCode,
        content,
      }
    );
    return response.data.data;
  };

  const likeOrUnlike = async (code: string): Promise<void> => {
    await axiosInstance.post<{ data: void }>("/comments/like", { code });
  };

  const deleteComment = async (code: string): Promise<void> => {
    await axiosInstance.delete<{ data: void }>("/comments/delete", {
      data: { code },
    });
  };

  const deletePost = async (postCode: string): Promise<void> => {
    await axiosInstance.delete<{ data: void }>("/posts/delete", {
      data: { code: postCode },
    });
  };

  // ------------------- Data Fetching Logic -------------------
  useEffect(() => {
    const fetchData = async () => {
      if (!postCode || postData) return;

      setIsLoadingPost(true);
      try {
        const post = await fetchPostByCode(postCode);
        setPostData({
          ...post,
          comments: [],
          commentPage: 0,
          hasNext: Number(post.commentCount) > 0,
          isPlaying: false,
        });
        await handleLoadComments();
      } catch (error: any) {
        toast({
          variant: "destructive",
          description: error.response?.data?.message || "Failed to load post!",
        });
      } finally {
        setIsLoadingPost(false);
      }
    };

    fetchData();
  }, [postCode]);

  // ------------------- Comment Handling Logic -------------------
  const handleLoadComments = async () => {
    if (isLoadingComments) return;

    setIsLoadingComments(true);
    try {
      const data = await fetchComments(postCode, postData?.commentPage ?? 0);

      setPostData((prev) => {
        if (!prev) return prev;

        const existingCodes = new Set(prev.comments.map((c) => c.commentCode));

        const newComments = (Array.isArray(data?.contents) ? data.contents : [])
          .filter((c: Comment) => !existingCodes.has(c.commentCode)) // ❌ loại trùng
          .map((c: Comment) => ({
            ...c,
            replies: [],
            replyPage: 0,
            hasNext: Number(c.replyCount) > 0,
            isOpenReply: false,
          }));

        return {
          ...prev,
          comments: [...prev.comments, ...newComments],
          commentPage: Number(data?.page ?? prev.commentPage) + 1,
          hasNext: data?.hasNext ?? false,
        };
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        description:
          error.response?.data?.message || "Failed to load comments!",
      });
    } finally {
      setIsLoadingComments(false);
    }
  };

  const toggleReplies = async (commentCode: string) => {
    if (!postData || visibleReplies[commentCode]) {
      setVisibleReplies((prev) => ({ ...prev, [commentCode]: false }));
      return;
    }
    const cmt = postData.comments.find((c) => c.commentCode === commentCode);
    if (!cmt) return;
    if (cmt?.replies?.length > 0 && !visibleReplies[commentCode]) {
      setVisibleReplies((prev) => ({
        ...prev,
        [commentCode]: true,
      }));
      return;
    }

    const comment = postData.comments.find(
      (c) => c.commentCode === commentCode
    );
    if (!comment || comment.replies?.length) return;

    setLoadingReplies((prev) => ({ ...prev, [commentCode]: true }));
    try {
      const data = await fetchReplies(commentCode, 0);
      setPostData((prev) =>
        prev
          ? {
              ...prev,
              comments: prev.comments.map((c) =>
                c.commentCode === commentCode
                  ? {
                      ...c,
                      replies: Array.isArray(data.contents)
                        ? data.contents
                        : [],
                      replyPage: Number(data.page ?? c.replyPage) + 1,
                      hasNext: data.hasNext ?? false,
                    }
                  : c
              ),
            }
          : prev
      );

      setVisibleReplies((prev) => ({ ...prev, [commentCode]: true }));
    } catch (error: any) {
      toast({
        variant: "destructive",
        description: error.response?.data?.message || "Failed to load replies!",
      });
    } finally {
      setLoadingReplies((prev) => ({ ...prev, [commentCode]: false }));
    }
  };

  const handleLoadReplies = async (commentCode: string) => {
    if (!postData || loadingReplies[commentCode]) return;

    const comment = postData.comments.find(
      (c) => c.commentCode === commentCode
    );
    if (!comment || !comment.hasNext) return;

    setLoadingReplies((prev) => ({ ...prev, [commentCode]: true }));
    try {
      const data = await fetchReplies(commentCode, comment.replyPage);
      setPostData((prev) =>
        prev
          ? {
              ...prev,
              comments: prev.comments.map((c) =>
                c.commentCode === commentCode
                  ? {
                      ...c,
                      replies: [
                        ...(c.replies || []),
                        ...(Array.isArray(data.contents) ? data.contents : []),
                      ],
                      replyPage: Number(data.page ?? c.replyPage) + 1,
                      hasNext: data.hasNext ?? false,
                    }
                  : c
              ),
            }
          : prev
      );
    } catch (error: any) {
      toast({
        variant: "destructive",
        description: error.response?.data?.message || "Failed to load replies!",
      });
    } finally {
      setLoadingReplies((prev) => ({ ...prev, [commentCode]: false }));
    }
  };

  const handleSendComment = async () => {
    if (!newComment.trim() || !postData) return;

    try {
      if (replyTarget) {
        const res = await addReply(replyTarget.commentCode, newComment);
        setPostData((prev) =>
          prev
            ? {
                ...prev,
                comments: prev.comments.map((comment) =>
                  comment.commentCode === replyTarget.commentCode
                    ? {
                        ...comment,
                        replies: [res, ...(comment.replies || [])],
                        replyCount: String(Number(comment.replyCount) + 1),
                      }
                    : comment
                ),
              }
            : prev
        );
      } else {
        const res = await addComment(postData.postCode, newComment);
        setPostData((prev) =>
          prev
            ? {
                ...prev,
                comments: [res, ...(prev.comments || [])],
                commentCount: String(Number(prev.commentCount) + 1),
              }
            : prev
        );
      }
      setNewComment("");
      setReplyTarget(null);
    } catch (error: any) {
      toast({
        variant: "destructive",
        description:
          error.response?.data?.message || "Failed to send comment/reply!",
      });
    }
  };

  const handleLikeOrUnlike = async (code: string) => {
    try {
      await likeOrUnlike(code);
      setPostData((prev) =>
        prev
          ? {
              ...prev,
              comments: prev.comments.map((comment) => {
                if (comment.commentCode === code) {
                  return {
                    ...comment,
                    isLiked: !comment.liked,
                    likeCount: String(
                      Number(comment.likeCount) + (comment.liked ? -1 : 1)
                    ),
                  };
                }
                return {
                  ...comment,
                  replies: comment.replies?.map((reply) =>
                    reply.commentCode === code
                      ? {
                          ...reply,
                          isLiked: !reply.liked,
                          likeCount: String(
                            Number(reply.likeCount) + (reply.liked ? -1 : 1)
                          ),
                        }
                      : reply
                  ),
                };
              }),
            }
          : prev
      );
    } catch (error: any) {
      toast({
        variant: "destructive",
        description: error.response?.data?.message || "Failed to like/unlike!",
      });
    }
  };

  const handleDeleteComment = async (code: string) => {
    try {
      await deleteComment(code);
      setPostData((prev) =>
        prev
          ? {
              ...prev,
              comments: prev.comments
                .map((comment) => {
                  if (comment.commentCode === code) return null;
                  if (
                    comment.replies?.some((reply) => reply.commentCode === code)
                  ) {
                    return {
                      ...comment,
                      replies: comment.replies.filter(
                        (reply) => reply.commentCode !== code
                      ),
                      replyCount: String(Number(comment.replyCount) - 1),
                    };
                  }
                  return comment;
                })
                .filter((comment): comment is Comment => comment !== null),
              commentCount: prev.comments.some((c) => c.commentCode === code)
                ? String(Number(prev.commentCount) - 1)
                : prev.commentCount,
            }
          : prev
      );
      toast({
        variant: "default",
        description: "Comment deleted successfully!",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        description:
          error.response?.data?.message || "Failed to delete comment!",
      });
    }
  };

  const handleDeletePost = async (postCode: string) => {
    try {
      await deletePost(postCode);
      setPostData(null);
      toast({
        variant: "default",
        description: "Post deleted successfully!",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        description: error.response?.data?.message || "Failed to delete post!",
      });
    }
  };

  // ------------------- Render Logic -------------------
  return (
    <ScrollArea className="relative max-h-screen flex-1 h-full scroll-but-hidden rounded-t-[50px] bg-white dark:bg-zinc-900">
      {isLoadingPost && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm text-muted-foreground">
          <Spinner className="h-8 w-8 mb-3" />
          <p className="text-sm font-medium">Loading post...</p>
        </div>
      )}

      {!isLoadingPost && !postData && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm text-muted-foreground">
          <FileX className="h-10 w-10 mb-3 text-zinc-400" />
          <p className="text-sm font-medium">Post not found.</p>
        </div>
      )}
      <div className="p-6 w-full space-y-4">
        <div className="w-full flex flex-wrap items-center gap-3">
          {/* Avatar */}
          <Avatar className="w-9 h-9 shrink-0">
            <AvatarImage
              src={`https://res.cloudinary.com/dwv76nhoy/image/upload/w_80,h_80/${postData?.avatarUrl}`}
            />
            <AvatarFallback>
              {postData?.userDisplayName?.charAt(0) ?? "MOE"}
            </AvatarFallback>
          </Avatar>

          {/* User info */}
          <div className="flex-1 overflow-hidden min-w-0">
            <h3 className="flex items-center space-x-1 overflow-hidden">
              <div className="flex space-x-1 overflow-hidden max-w-full">
                <Link
                  to={`/client/profile?code=${postData?.userCode}`}
                  className="truncate block max-w-[60%]"
                >
                  <span className="truncate block font-semibold text-[15px] text-zinc-800 dark:text-zinc-50">
                    {postData?.userDisplayName ?? "[DisplayName]"}
                  </span>
                </Link>
                <span className="text-zinc-400 text-sm">•</span>
                <Link
                  to={`/client/profile?code=${postData?.userCode}`}
                  className="truncate block max-w-[60%] md:max-w-full"
                >
                  <span className="truncate block text-zinc-500 text-sm hover:underline hover:text-zinc-800 dark:text-zinc-300 dark:hover:text-zinc-50">
                    @{postData?.userName ?? "[UserName]"}
                  </span>
                </Link>
              </div>
            </h3>
            <p className="text-xs text-muted-foreground">
              {postData?.createdAt
                ? getTimeAgo(postData?.createdAt)
                : "Unknown time"}
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 ms-auto">
            <Button
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
              className="!rounded-3xl p-2 overflow-hidden"
            >
              <ReportDialog
                postCode={postData?.postCode ?? "0"}
                trigger={
                  <ActionMenuItem
                    icon={<Flag className="h-4 w-4 text-red-500" />}
                    className="text-red-500 font-semibold hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  >
                    Report
                  </ActionMenuItem>
                }
              />

              {postData?.userCode === postData?.userCurrentCode && (
                <DeleteConfirmationDialog
                  itemName="Post"
                  onConfirm={() => handleDeletePost(postData?.postCode ?? "0")}
                  trigger={
                    <ActionMenuItem
                      icon={<Trash2 className="h-4 w-4 text-red-500" />}
                      className="text-red-500 font-semibold hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    >
                      Delete
                    </ActionMenuItem>
                  }
                />
              )}
            </ActionMenuDialog>
          </div>
        </div>

        <h2 className="text-3xl font-bold tracking-tight">
          {postData?.title ?? "[Title]"}
        </h2>
        <div className="mt-4">
          <p
            className={`w-full text-muted-foreground text-sm leading-relaxed whitespace-pre-wrap transition-all duration-300 overflow-hidden ${
              !expanded
                ? (postData?.title?.length ?? 0) * 2 +
                    (postData?.description?.length ?? 0) >
                    400 && (postData?.title?.length ?? 0) * 2 > 60
                  ? "line-clamp-8"
                  : (postData?.title?.length ?? 0) * 2 +
                      (postData?.description?.length ?? 0) >
                    500
                  ? "line-clamp-10"
                  : ""
                : ""
            }`}
          >
            {postData?.description ?? "[Description]"}
          </p>

          {(((postData?.title?.length ?? 0) * 2 +
            (postData?.description?.length ?? 0) >
            400 &&
            (postData?.title?.length ?? 0) * 2 > 60) ||
            (postData?.title?.length ?? 0) * 2 +
              (postData?.description?.length ?? 0) >
              500) && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-sm text-zinc-500 dark:text-zinc-300 hover:text-zinc-700 dark:hover:text-zinc-400 mt-2 transition-colors duration-300"
            >
              {expanded ? "Thu gọn" : "Xem thêm"}
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          {postData?.tags?.map((tag, index) => (
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

      {/* Comments Section */}
      <div className="p-6 space-y-6 pb-96">
        <div className="flex flex-col items-center justify-center text-muted-foreground cursor-pointer hover:text-foreground transition-colors">
          <p className="text-sm font-medium">
            View {postData?.comments?.length ?? 0} comments
          </p>
          <ChevronDown className="h-5 w-5 mt-1 animate-bounce" />
        </div>

        <div className="pt-5 mt-10 border-t">
          <h3 className="font-medium mb-6">
            Comments ({postData?.comments?.length ?? 0})
          </h3>

          <div className="space-y-6">
            {postData?.comments && postData?.comments.length > 0 ? (
              postData?.comments?.map((comment) => (
                <div key={comment.commentCode} className="space-y-3">
                  <div className="flex gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarImage
                        src={`https://res.cloudinary.com/dwv76nhoy/image/upload/w_80,h_80/${comment.avatarUrl}`}
                      />
                      <AvatarFallback>{comment.displayName[0]}</AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <Link
                        to={`/client/profile?code=${comment.userCommentCode}`}
                      >
                        <span className="text-sm font-medium text-black dark:text-white">
                          {comment.displayName}
                        </span>
                      </Link>
                      {comment.userCommentCode === postData.userCode && (
                        <span className="ml-2 px-2 py-0.5 text-[11px] text-black bg-zinc-300 rounded-full">
                          author
                        </span>
                      )}
                      <p className="text-sm text-black/90 dark:text-zinc-300 mt-0.5 break-all">
                        {comment.content}
                      </p>

                      <div className="flex justify-between gap-4 text-xs text-muted-foreground mt-1">
                        <div className="space-x-3 flex items-center">
                          <span>{getTimeAgo(comment.createdAt)}</span>
                          <button
                            onClick={() =>
                              setReplyTarget({
                                commentCode: comment.commentCode,
                                displayName: comment.displayName,
                              })
                            }
                            className="hover:underline"
                          >
                            Reply
                          </button>
                          <ActionMenuDialog
                            trigger={
                              <button className="rounded-full hover:bg-muted transition">
                                <Ellipsis className="w-4 h-4 text-muted-foreground" />
                              </button>
                            }
                            className="!rounded-3xl p-2"
                          >
                            <ActionMenuItem
                              icon={
                                <Copy className="h-4 w-4 text-muted-foreground" />
                              }
                              className="justify-start text-sm px-4 py-2 hover:bg-accent rounded-lg transition-colors"
                              onClick={() => {
                                const textToCopy = comment?.content ?? "";
                                if (!textToCopy) {
                                  toast({
                                    variant: "destructive",
                                    title: "Error",
                                    description: "No content to copy.",
                                  });
                                  return;
                                }

                                if (
                                  navigator.clipboard &&
                                  typeof navigator.clipboard.writeText ===
                                    "function"
                                ) {
                                  navigator.clipboard
                                    .writeText(textToCopy)
                                    .then(() => {
                                      toast({
                                        title: "Success",
                                        description:
                                          "Content copied to clipboard!",
                                      });
                                    })
                                    .catch((err) => {
                                      console.error(
                                        "Clipboard copy failed:",
                                        err
                                      );
                                      toast({
                                        variant: "destructive",
                                        title: "Error",
                                        description: "Failed to copy content.",
                                      });
                                    });
                                } else {
                                  toast({
                                    variant: "destructive",
                                    title: "Clipboard API not supported",
                                    description:
                                      "Your browser does not support clipboard copying.",
                                  });
                                }
                              }}
                            >
                              Copy
                            </ActionMenuItem>

                            <DeleteConfirmationDialog
                              itemName="this comment"
                              onConfirm={() =>
                                handleDeleteComment(comment.commentCode)
                              }
                              trigger={
                                <ActionMenuItem
                                  icon={
                                    <Trash2 className="h-4 w-4 text-destructive text-red-500" />
                                  }
                                  variant="destructive"
                                  className="justify-start text-sm text-red-500 px-4 py-2 hover:bg-destructive/10 rounded-lg transition-colors"
                                >
                                  Delete
                                </ActionMenuItem>
                              }
                            />
                          </ActionMenuDialog>
                        </div>

                        <div className="flex items-center me-2 gap-1 text-xs text-muted-foreground">
                          <Heart
                            onClick={() =>
                              handleLikeOrUnlike(comment.commentCode)
                            }
                            className={`h-4 w-4 cursor-pointer ${
                              comment.liked ? "text-red-500 fill-red-500" : ""
                            }`}
                          />
                          {comment.likeCount}
                        </div>
                      </div>

                      {Number(comment.replyCount) > 0 &&
                        !visibleReplies[comment.commentCode] && (
                          <div className="mt-2">
                            <button
                              className="flex text-xs text-muted-foreground hover:underline"
                              onClick={() => toggleReplies(comment.commentCode)}
                            >
                              ——View {comment.replyCount} replies
                              <ChevronDown className="h-4 w-4 ms-1 mt-0.5" />
                            </button>
                          </div>
                        )}

                      {visibleReplies[comment.commentCode] && (
                        <div
                          className={`mt-3 space-y-3 border-l border-zinc-600 ps-4 overflow-hidden transition-all duration-500 ease-in-out ${
                            visibleReplies[comment.commentCode]
                              ? "max-h-[1000px] opacity-100 translate-y-0"
                              : "max-h-0 opacity-0 -translate-y-2"
                          }`}
                        >
                          {comment.replies?.map((reply) => (
                            <div key={reply.commentCode}>
                              <div className="flex gap-2">
                                <Avatar className="h-7 w-7">
                                  <AvatarImage
                                    src={`https://res.cloudinary.com/dwv76nhoy/image/upload/w_80,h_80/${reply.avatarUrl}`}
                                  />
                                  <AvatarFallback>
                                    {reply.displayName[0]}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <Link
                                    to={`/client/profile?code=${reply.userCommentCode}`}
                                  >
                                    <span className="text-sm font-medium text-black dark:text-white">
                                      {reply.displayName}
                                    </span>
                                  </Link>
                                  {reply.userCommentCode ===
                                    postData.userCode && (
                                    <span className="ml-2 px-2 py-0.5 text-[11px] text-black bg-zinc-300 rounded-full">
                                      author
                                    </span>
                                  )}
                                  <p className="text-sm text-black/90 dark:text-zinc-300 mt-0.5 break-all">
                                    {reply.content}
                                  </p>

                                  <div className="flex justify-between gap-4 text-xs text-muted-foreground mt-1">
                                    <div className="space-x-3 flex items-center">
                                      <span>{getTimeAgo(reply.createdAt)}</span>
                                      <ActionMenuDialog
                                        trigger={
                                          <button className="rounded-full hover:bg-muted transition">
                                            <Ellipsis className="w-4 h-4 text-muted-foreground" />
                                          </button>
                                        }
                                        className="!rounded-3xl p-2"
                                      >
                                        <ActionMenuItem
                                          icon={
                                            <Copy className="h-4 w-4 text-muted-foreground" />
                                          }
                                          className="justify-start text-sm px-4 py-2 hover:bg-accent rounded-lg transition-colors"
                                          onClick={() => {
                                            const textToCopy =
                                              reply?.content ?? "";
                                            if (!textToCopy) {
                                              toast({
                                                variant: "destructive",
                                                title: "Error",
                                                description:
                                                  "No content to copy.",
                                              });
                                              return;
                                            }

                                            if (
                                              navigator.clipboard &&
                                              typeof navigator.clipboard
                                                .writeText === "function"
                                            ) {
                                              navigator.clipboard
                                                .writeText(textToCopy)
                                                .then(() => {
                                                  toast({
                                                    title: "Success",
                                                    description:
                                                      "Content copied to clipboard!",
                                                  });
                                                })
                                                .catch((err) => {
                                                  console.error(
                                                    "Clipboard copy failed:",
                                                    err
                                                  );
                                                  toast({
                                                    variant: "destructive",
                                                    title: "Error",
                                                    description:
                                                      "Failed to copy content.",
                                                  });
                                                });
                                            } else {
                                              toast({
                                                variant: "destructive",
                                                title:
                                                  "Clipboard API not supported",
                                                description:
                                                  "Your browser does not support clipboard copying.",
                                              });
                                            }
                                          }}
                                        >
                                          Copy
                                        </ActionMenuItem>

                                        {reply.userCommentCode ===
                                          reply.userCurrentCode && (
                                          <DeleteConfirmationDialog
                                            itemName="this reply"
                                            onConfirm={() =>
                                              handleDeleteComment(
                                                reply.commentCode
                                              )
                                            }
                                            trigger={
                                              <ActionMenuItem
                                                icon={
                                                  <Trash2 className="h-4 w-4 text-red-500" />
                                                }
                                                variant="destructive"
                                                className="justify-start text-sm text-red-500 px-4 py-2 hover:bg-destructive/10 rounded-lg transition-colors"
                                              >
                                                Delete
                                              </ActionMenuItem>
                                            }
                                          />
                                        )}
                                      </ActionMenuDialog>
                                    </div>
                                    <span className="flex items-center me-2 gap-1">
                                      <Heart
                                        onClick={() =>
                                          handleLikeOrUnlike(reply.commentCode)
                                        }
                                        className={`h-4 w-4 cursor-pointer ${
                                          reply.liked
                                            ? "text-red-500 fill-red-500"
                                            : ""
                                        }`}
                                      />
                                      {reply.likeCount}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}

                          {loadingReplies[comment.commentCode] ? (
                            <p className="text-xs text-muted-foreground flex items-center">
                              <Spinner className="h-4 w-4 mr-2" /> Loading
                              replies...
                            </p>
                          ) : (
                            <div className="flex gap-4">
                              {comment.hasNext && (
                                <button
                                  className="flex items-center text-xs text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors mt-2"
                                  onClick={() =>
                                    handleLoadReplies(comment.commentCode)
                                  }
                                  disabled={loadingReplies[comment.commentCode]}
                                >
                                  {loadingReplies[comment.commentCode]
                                    ? "Loading..."
                                    : "—— Load more replies"}
                                  <ChevronDown className="h-4 w-4 ms-1 " />
                                </button>
                              )}
                              {visibleReplies[comment.commentCode] && (
                                <button
                                  onClick={() => {
                                    setVisibleReplies((prev) => ({
                                      ...prev,
                                      [comment.commentCode]:
                                        !prev[comment.commentCode],
                                    }));
                                  }}
                                  className="flex items-center text-xs text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors mt-2"
                                >
                                  Hide
                                  <ChevronUp className="h-4 w-4 ms-1 " />
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No comments yet. Be the first to comment!
              </p>
            )}
          </div>

          {postData?.comments && postData?.comments.length > 0 && (
            <div className="text-center mt-6">
              {postData?.hasNext ? (
                <Button
                  variant="outline"
                  size="sm"
                   className="px-4 py-1.5 mt-4 text-sm rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                  onClick={handleLoadComments}
                  disabled={isLoadingComments}
                >
                  {isLoadingComments ? "Loading..." : "Load more comments"}
                </Button>
              ) : (
                <p className="text-xs text-muted-foreground italic">
                  No more comments.
                </p>
              )}
            </div>
          )}

          <div className="w-full fixed bottom-0 left-0 right-0 z-50 backdrop-blur-sm pt-4 pb-2 px-4 border-t bg-white dark:bg-zinc-900">
            {replyTarget && (
              <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground">
                Replying to:{" "}
                <span className="font-medium">@{replyTarget.displayName}</span>
                <button
                  onClick={() => setReplyTarget(null)}
                  className="text-red-500 hover:underline ml-2 text-xs"
                >
                  ✕
                </button>
              </div>
            )}

            <div className="flex gap-3 items-center pb-2.5">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-9 w-9">
                    <Smile className="h-5 w-5 text-muted-foreground" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-2" align="start">
                  <div className="grid grid-cols-5 gap-2">
                    {commonEmojis.map((emoji, idx) => (
                      <Button
                        key={idx}
                        variant="ghost"
                        className="h-9 w-9 p-0 text-lg"
                        onClick={() => setNewComment(newComment + emoji)}
                      >
                        {emoji}
                      </Button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>

              <Input
                placeholder={
                  replyTarget
                    ? `Reply to @${replyTarget.displayName}...`
                    : "Add a comment..."
                }
                value={activePostCode === postData?.postCode ? newComment : ""}
                onChange={(e) => setNewComment(e.target.value)}
                onFocus={() => setActivePostCode(postData?.postCode ?? "0")}
                className="flex-1 rounded-full"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey && newComment.trim()) {
                    e.preventDefault();
                    handleSendComment();
                  }
                }}
              />

              <Button
                onClick={handleSendComment}
                disabled={!newComment.trim() || isLoadingComments}
                className="px-4 bg-zinc-50 rounded-3xl"
              >
                <Send className="h-4 w-4 text-zinc-500" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
};

export default Comments;
