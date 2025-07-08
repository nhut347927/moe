import {
  ChevronDown,
  Copy,
  Ellipsis,
  EllipsisVertical,
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
import { ActionMenuItem } from "@/components/dialog/action-menu-item";
import ActionMenuDialog from "@/components/dialog/action-menu-dialog";
import DeleteConfirmationDialog from "@/components/dialog/delete-confirmation-dialog";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import ReportDialog from "@/components/dialog/report-dialog";
import { usePostApi } from "@/common/hooks/usePostApi";
import { useToast } from "@/common/hooks/use-toast";
import { useGetApi } from "@/common/hooks/useGetApi";
import { Page } from "@/common/hooks/type";
import axiosInstance from "@/services/axios/axios-instance";

interface CommentsProps {
  postCode: string;
}

const Comments = ({ postCode }: CommentsProps) => {
  const [expanded, setExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activePostId, setActivePostId] = useState<string | null>(null);
  const [visibleReplies, setVisibleReplies] = useState<Record<string, boolean>>(
    {}
  );
  const [hasMoreReplies, setHasMoreReplies] = useState<Record<string, boolean>>(
    {}
  );
  const [loadingReplies, setLoadingReplies] = useState<Record<string, boolean>>(
    {}
  );
  const { toast } = useToast();

  // ------------------- State Management -------------------
  const [post, setPost] = useState<Post | undefined>(undefined);
  const [newComment, setNewComment] = useState<string>("");
  const [replyTarget, setReplyTarget] = useState<{
    commentCode: string;
    displayName: string;
  } | null>(null);

  // ----------------------- FETCH POST ----------------------------
  const { loading: loadingPost } = useGetApi<Post>({
    endpoint: "/posts/get",
    params: { code: postCode },
    enabled: !!postCode,
    onSuccess: (data) => {
      if (!data) return;
      setPost({
        ...data,
        comments: [],
        commentPage: 0,
        hasNext: Number(data.commentCount) > 5,
        isPlaying: false,
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

  // ----------------------- FETCH COMMENTS ----------------------------
  const fetchComments = async (postCode: string, commentPage: number = 0) => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const res = await axiosInstance.get<Page<Comment[]>>(
        "/comments/comments",
        {
          params: {
            code: postCode,
            page: commentPage,
            size: 5,
            sort: "desc",
          },
        }
      );

      const data = res.data;
      if (!data || !data.contents) {
        setIsLoading(false);
        return;
      }

      setPost((prev) => {
        if (!prev) return undefined;

        const mappedComments: Comment[] =
          data.contents?.map((d: Comment) => ({
            ...d,
            replies: [],
            replyPage: 0,
            hasNext: Number(d?.replyCount ?? 0) > 5,
            isOpenReply: false,
            isLoading: false,
          })) ?? [];

        return {
          ...prev,
          comments:
            commentPage === 0
              ? mappedComments
              : [...(prev.comments ?? []), ...mappedComments],
          commentPage: Number(data.page ?? commentPage) + 1,
          hasNext: data.hasNext ?? false,
        };
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Lỗi tải bình luận",
        description: error?.response?.data?.message ?? "Đã xảy ra lỗi",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // ----------------------- FETCH REPLIES ----------------------------
  const fetchReplies = async (commentCode: string, replyPage: number = 0) => {
    setLoadingReplies((prev) => ({ ...prev, [commentCode]: true }));

    try {
      const res = await axiosInstance.get<Page<Reply[]>>("/comments/replies", {
        params: {
          code: commentCode,
          page: replyPage,
          size: 5,
          sort: "desc",
        },
      });

      const data = res.data;
      if (!data || !data.contents) {
        setLoadingReplies((prev) => ({ ...prev, [commentCode]: false }));
        return;
      }

      setPost((prev) => {
        if (!prev) return prev;

        const updatedComments: Comment[] =
          prev.comments?.map((comment) =>
            comment.commentCode === commentCode
              ? {
                  ...comment,
                  replies:
                    replyPage === 0
                      ? data?.contents ?? []
                      : [...(comment.replies ?? []), ...(data?.contents ?? [])],
                  replyPage: Number(data.page ?? replyPage) + 1,
                  hasNext: data.hasNext ?? false,
                }
              : comment
          ) ?? [];

        return {
          ...prev,
          comments: updatedComments.length > 0 ? updatedComments : null,
        };
      });

      setHasMoreReplies((prev) => ({
        ...prev,
        [commentCode]: data.hasNext ?? false,
      }));
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Lỗi tải phản hồi",
        description: error?.response?.data?.message ?? "Đã xảy ra lỗi",
      });
    } finally {
      setLoadingReplies((prev) => ({ ...prev, [commentCode]: false }));
    }
  };

  // ----------------------- API HOOKS ----------------------------
  const { callApi: callAddCommentApi } = usePostApi<Comment>({
    endpoint: "/comments",
    onSuccess: (newComment) => {
    setPost((prev) => {
  if (!prev) return undefined;

  // Lọc bỏ null và undefined trong mảng comments
  const filteredComments = (prev.comments ?? []).filter(
    (c): c is Comment => c !== null && c !== undefined
  );

  return {
    ...prev,
    comments: [newComment, ...filteredComments],
    commentCount: String(Number(prev.commentCount) + 1),
  };
});

      setNewComment("");
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    },
  });

  const { callApi: callAddReplyApi } = usePostApi<Reply>({
    endpoint: "/comments/reply",
    onSuccess: (newReply) => {
      setPost((prev) => {
        if (!prev || !replyTarget) return undefined;
        const updatedComments = prev.comments.map((comment) =>
          comment.commentCode === replyTarget.commentCode
            ? {
                ...comment,
                replies: [newReply, ...(comment.replies ?? [])],
                replyCount: String(Number(comment.replyCount) + 1),
              }
            : comment
        );
        return { ...prev, comments: updatedComments };
      });
      setNewComment("");
      setReplyTarget(null);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    },
  });

  const { callApi: callDeleteCommentApi } = usePostApi<void>({
    endpoint: "/comments/delete",
    onSuccess: () => {
      toast({
        variant: "default",
        title: "Success",
        description: "Comment deleted successfully",
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

  const { callApi: callDeletePostApi } = usePostApi<void>({
    endpoint: "/posts/delete",
    onSuccess: () => {
      toast({
        variant: "default",
        title: "Success",
        description: "Post deleted successfully",
      });
      setPost(undefined);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    },
  });

  const { callApi: callReportApi } = usePostApi<void>({
    endpoint: "/reports",
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    },
  });

  const { callApi: callLikeApi } = usePostApi<void>({
    endpoint: "/comments/like",
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    },
  });

  // ----------------------- HANDLERS ----------------------------
  const handleSendComment = async () => {
    if (!newComment.trim() || !post) return;

    if (replyTarget) {
      await callAddReplyApi({
        code: replyTarget.commentCode,
        content: newComment,
      });
    } else {
      await callAddCommentApi({
        code: post.postCode,
        content: newComment,
      });
    }
  };

  const handleDeleteComment = async (commentCode: string) => {
    await callDeleteCommentApi({ code: commentCode });
    setPost((prev) => {
      if (!prev) return undefined;
      const updatedComments = prev.comments.filter(
        (comment) => comment.commentCode !== commentCode
      );
      return {
        ...prev,
        comments: updatedComments,
        commentCount: String(Number(prev.commentCount) - 1),
      };
    });
  };

  const handleDeletePost = async (postCode: string) => {
    await callDeletePostApi({ code: postCode });
  };

  const handleLikeOrUnlike = async (commentCode: string) => {
    await callLikeApi({ code: commentCode });
    setPost((prev) => {
      if (!prev) return undefined;
      const updatedComments = prev.comments.map((comment) =>
        comment.commentCode === commentCode
          ? {
              ...comment,
              isLiked: !comment.isLiked,
              likeCount: comment.isLiked
                ? Number(comment.likeCount) - 1
                : Number(comment.likeCount) + 1,
            }
          : comment
      );
      return { ...prev, comments: updatedComments };
    });
  };

  const toggleReplies = (commentCode: string) => {
    setVisibleReplies((prev) => ({
      ...prev,
      [commentCode]: !prev[commentCode],
    }));
    if (!visibleReplies[commentCode]) {
      fetchReplies(commentCode, 0);
    }
  };

  const handleLoadMoreReplies = (commentCode: string) => {
    const comment = post?.comments?.find((c) => c.commentCode === commentCode);
    if (comment) {
      fetchReplies(commentCode, comment.replyPage);
    }
  };

  const handleLoadMoreComments = () => {
    if (post && post.hasNext) {
      fetchComments(postCode, post.commentPage);
    }
  };

  // ----------------------- FETCH INITIAL DATA ----------------------------
  useEffect(() => {
    if (postCode && post) {
      fetchComments(postCode, 0);
    }
  }, [postCode, post]);

  return (
    <ScrollArea className="max-h-full flex-1 h-full overflow-y-auto w-full overflow-x-hidden rounded-t-3xl shadow-xl bg-white dark:bg-zinc-900">
      <div className="p-3 pt-4 w-full space-y-4">
        <div className="w-full flex flex-wrap items-center gap-3">
          {/* Avatar */}
          <Avatar className="w-9 h-9 shrink-0">
            <AvatarImage
              src={`abc/image/upload/w_80,h_80/${post?.avatarUrl}`}
            />
            <AvatarFallback>{post?.userDisplayName?.charAt(0)}</AvatarFallback>
          </Avatar>

          {/* User info */}
          <div className="flex-1 overflow-hidden min-w-0">
            <h3 className="flex items-center space-x-1 overflow-hidden">
              <div className="flex space-x-1 overflow-hidden max-w-full">
                <Link
                  to={`/client/profile?code=${post?.userCode}`}
                  className="truncate block max-w-[60%]"
                >
                  <span className="truncate block font-semibold text-[15px] text-zinc-800 dark:text-zinc-50">
                    {post?.userDisplayName}
                  </span>
                </Link>
                <span className="text-zinc-400 text-sm">•</span>
                <Link
                  to={`/client/profile?code=${post?.userCode}`}
                  className="truncate block max-w-[60%] md:max-w-full"
                >
                  <span className="truncate block text-zinc-500 text-sm hover:underline hover:text-zinc-800 dark:text-zinc-300 dark:hover:text-zinc-50">
                    @{post?.userName}
                  </span>
                </Link>
              </div>
            </h3>
            <p className="text-xs text-muted-foreground">
              {post?.createdAt ? getTimeAgo(post.createdAt) : "Unknown time"}
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
              className="rounded-3xl p-0 overflow-hidden"
            >
              <div className="flex flex-col text-center text-sm">
                <div className="py-3 font-semibold text-red-500 hover:bg-gray-100 dark:hover:bg-gray-800">
                  <ReportDialog
                    postCode={post?.postCode ?? "0.0.0.0"}
                    trigger={<span>Report</span>}
                    onConfirm={(data) => callReportApi(data)}
                  />
                </div>
                {post?.userCode === post?.userCurrentCode && (
                  <div className="py-3 font-semibold text-red-500 hover:bg-gray-100 dark:hover:bg-gray-800">
                    <DeleteConfirmationDialog
                      trigger={<span>Delete</span>}
                      itemName="Post"
                      onConfirm={() => handleDeletePost(post?.postCode ?? "")}
                    />
                  </div>
                )}
              </div>
            </ActionMenuDialog>
          </div>
        </div>

        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
          {post?.title}
        </h2>
        <div className="mt-4">
          <p
            className={`w-full text-muted-foreground text-base md:text-lg leading-relaxed break-all whitespace-pre-wrap transition-all duration-300 overflow-hidden ${
              !expanded
                ? (post?.title?.length ?? 0) * 2 +
                    (post?.description?.length ?? 0) >
                    400 && (post?.title?.length ?? 0) * 2 > 60
                  ? "line-clamp-8"
                  : (post?.title?.length ?? 0) * 2 +
                      (post?.description?.length ?? 0) >
                    500
                  ? "line-clamp-10"
                  : ""
                : ""
            }`}
          >
            {post?.description ?? ""}
          </p>

          {(((post?.title?.length ?? 0) * 2 + (post?.description?.length ?? 0) >
            400 &&
            (post?.title?.length ?? 0) * 2 > 60) ||
            (post?.title?.length ?? 0) * 2 + (post?.description?.length ?? 0) >
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

      {/* Comments Section */}
      <div className="p-3 space-y-6 pb-32">
        <div className="flex flex-col items-center justify-center py-6 text-muted-foreground cursor-pointer hover:text-foreground transition-colors">
          <p className="text-sm font-medium">
            View {post?.comments?.length ?? 0} comments
          </p>
          <ChevronDown className="h-5 w-5 mt-1 animate-bounce" />
        </div>

        <div className="pt-10 mt-10 border-t">
          <h3 className="font-medium mb-6">
            Comments ({post?.comments?.length ?? 0})
          </h3>

          <div className="space-y-6">
            {post && post.comments && post.comments.length > 0 ? (
              post.comments.map((comment) => (
                <div key={comment.commentCode} className="space-y-3">
                  <div className="flex gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarImage
                        src={`abc/image/upload/w_80,h_80/${comment.avatarUrl}`}
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
                      {comment.userCommentCode === post.userCode && (
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
                            title="Options"
                            trigger={
                              <button className="rounded-full hover:bg-muted transition">
                                <Ellipsis className="w-4 h-4 text-muted-foreground" />
                              </button>
                            }
                            className="rounded-3xl"
                          >
                            <ActionMenuItem
                              icon={
                                <Copy className="h-4 w-4 text-muted-foreground" />
                              }
                              className="justify-start text-sm px-4 py-2 hover:bg-accent rounded-lg transition-colors"
                              onClick={() => {
                                navigator.clipboard
                                  .writeText(comment.content)
                                  .then(() => {
                                    toast({
                                      title: "Success",
                                      description:
                                        "Content copied to clipboard!",
                                    });
                                  })
                                  .catch(() => {
                                    toast({
                                      variant: "destructive",
                                      title: "Error",
                                      description: "Failed to copy content.",
                                    });
                                  });
                              }}
                            >
                              Copy
                            </ActionMenuItem>

                            {comment.userCommentCode ===
                              comment.userCurrentCode && (
                              <DeleteConfirmationDialog
                                itemName="this comment"
                                onConfirm={() =>
                                  handleDeleteComment(comment.commentCode)
                                }
                                trigger={
                                  <ActionMenuItem
                                    icon={
                                      <Trash2 className="h-4 w-4 text-destructive" />
                                    }
                                    variant="destructive"
                                    className="justify-start text-sm px-4 py-2 hover:bg-destructive/10 rounded-lg transition-colors"
                                  >
                                    Delete
                                  </ActionMenuItem>
                                }
                              />
                            )}
                          </ActionMenuDialog>
                        </div>

                        <div className="flex items-center me-2 gap-1 text-xs text-muted-foreground">
                          {!comment.isLiked ? (
                            <Heart
                              onClick={() =>
                                handleLikeOrUnlike(comment.commentCode)
                              }
                              className="h-4 w-4 cursor-pointer"
                            />
                          ) : (
                            <Heart
                              onClick={() =>
                                handleLikeOrUnlike(comment.commentCode)
                              }
                              className="w-4 h-4 text-red-500 fill-red-500 cursor-pointer"
                            />
                          )}
                          {comment.likeCount}
                        </div>
                      </div>

                      {parseInt(comment.replyCount) > 0 &&
                        !visibleReplies[comment.commentCode] && (
                          <div className="mt-2">
                            <button
                              className="flex text-sm text-muted-foreground hover:underline"
                              onClick={() => toggleReplies(comment.commentCode)}
                            >
                              ——View {comment.replyCount} replies{" "}
                              <ChevronDown className="h-4 w-4 ms-1 mt-0.5" />
                            </button>
                          </div>
                        )}

                      {visibleReplies[comment.commentCode] && (
                        <div className="mt-3 space-y-3 border-l border-gray-300 ps-4">
                          {loadingReplies[comment.commentCode] ? (
                            <p className="text-sm text-muted-foreground italic">
                              Loading replies...
                            </p>
                          ) : (
                            comment.replies?.map((reply) => (
                              <div key={reply.commentCode}>
                                <div className="flex gap-2">
                                  <Avatar className="h-7 w-7">
                                    <AvatarImage
                                      src={`abc/image/upload/w_80,h_80/${reply.avatarUrl}`}
                                    />
                                    <AvatarFallback>
                                      {reply.displayName[0]}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1">
                                    <Link
                                      to={`/client/profile?code=${reply.userCommentCode}`}
                                    >
                                      <span className="font-medium text-black dark:text-white">
                                        {reply.displayName}
                                      </span>
                                    </Link>
                                    {reply.userCommentCode ===
                                      post.userCode && (
                                      <span className="ml-2 px-2 py-0.5 text-[11px] text-black bg-zinc-300 rounded-full">
                                        author
                                      </span>
                                    )}
                                    <p className="text-sm text-black/90 mt-0.5 dark:text-zinc-300 break-all">
                                      {reply.content}
                                    </p>

                                    <div className="flex justify-between gap-4 text-xs text-muted-foreground mt-1">
                                      <div className="space-x-3 flex items-center">
                                        <span>
                                          {getTimeAgo(reply.createdAt)}
                                        </span>
                                        <ActionMenuDialog
                                          title="Options"
                                          trigger={
                                            <button className="rounded-full hover:bg-muted transition">
                                              <Ellipsis className="w-4 h-4 text-muted-foreground" />
                                            </button>
                                          }
                                          className="rounded-3xl"
                                        >
                                          <ActionMenuItem
                                            icon={
                                              <Copy className="h-4 w-4 text-muted-foreground" />
                                            }
                                            className="justify-start text-sm px-4 py-2 hover:bg-accent rounded-lg transition-colors"
                                            onClick={() => {
                                              navigator.clipboard
                                                .writeText(reply.content)
                                                .then(() => {
                                                  toast({
                                                    title: "Success",
                                                    description:
                                                      "Content copied to clipboard!",
                                                  });
                                                })
                                                .catch(() => {
                                                  toast({
                                                    variant: "destructive",
                                                    title: "Error",
                                                    description:
                                                      "Failed to copy content.",
                                                  });
                                                });
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
                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                  }
                                                  variant="destructive"
                                                  className="justify-start text-sm px-4 py-2 hover:bg-destructive/10 rounded-lg transition-colors"
                                                >
                                                  Delete
                                                </ActionMenuItem>
                                              }
                                            />
                                          )}
                                        </ActionMenuDialog>
                                      </div>
                                      <span className="flex items-center me-2 gap-1">
                                        {!reply.isLiked ? (
                                          <Heart
                                            onClick={() =>
                                              handleLikeOrUnlike(
                                                reply.commentCode
                                              )
                                            }
                                            className="h-4 w-4 cursor-pointer"
                                          />
                                        ) : (
                                          <Heart
                                            onClick={() =>
                                              handleLikeOrUnlike(
                                                reply.commentCode
                                              )
                                            }
                                            className="w-4 h-4 text-red-500 fill-red-500 cursor-pointer"
                                          />
                                        )}
                                        {reply.likeCount}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))
                          )}

                          {visibleReplies[comment.commentCode] &&
                            hasMoreReplies[comment.commentCode] && (
                              <div className="text-center mt-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="rounded-full cursor-pointer text-muted-foreground"
                                  onClick={() =>
                                    handleLoadMoreReplies(comment.commentCode)
                                  }
                                  disabled={loadingReplies[comment.commentCode]}
                                >
                                  {loadingReplies[comment.commentCode]
                                    ? "Loading..."
                                    : "Load more replies"}
                                </Button>
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

          {post && post.comments && post.comments.length > 0 && (
            <div className="text-center mt-6">
              {post.hasNext ? (
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full cursor-pointer"
                  onClick={handleLoadMoreComments}
                  disabled={isLoading}
                >
                  {isLoading ? "Loading..." : "Load more comments"}
                </Button>
              ) : (
                <p className="text-xs text-muted-foreground italic">
                  No more comments.
                </p>
              )}
            </div>
          )}

          <div
            className={`w-full transition-all duration-500 ease-in-out mt-8 sticky bottom-0 backdrop-blur-sm pt-4 pb-2 border-t`}
          >
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

            <div className="flex gap-2 items-center pb-11">
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
                value={activePostId === post?.postCode ? newComment : ""}
                onChange={(e) => setNewComment(e.target.value)}
                onFocus={() => setActivePostId(post?.postCode ?? null)}
                className="flex-1"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey && newComment.trim()) {
                    e.preventDefault();
                    handleSendComment();
                  }
                }}
              />

              <Button
                onClick={handleSendComment}
                disabled={!newComment.trim() || isLoading}
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
