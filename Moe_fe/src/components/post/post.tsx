import { useState, useRef, useEffect } from "react";
import { useToast } from "@/common/hooks/use-toast";
import { Post, Comment, TabType } from "@/pages/client/home/types";
import PostHeader from "@/pages/client/home/item/post-header";
import PostContent from "@/pages/client/home/item/post-content";
import PostComments from "@/pages/client/home/item/post-comments";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Home, MessageCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import axiosInstance from "@/services/axios/axios-instance";

interface PostProps {
  postCode: string | null;
}

const PostCompo = ({ postCode }: PostProps) => {
  // ------------------- State Management -------------------
  const [postData, setPostData] = useState<Post | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const mediaRef = useRef<HTMLDivElement | null>(null);
  const { toast } = useToast();

  // States for comments
  const [newComment, setNewComment] = useState<string>("");
  const [replyTarget, setReplyTarget] = useState<{
    commentCode: string;
    displayName: string;
  } | null>(null);
  const [activePostId, setActivePostId] = useState<string>("");
  const [visibleReplies, setVisibleReplies] = useState<{
    [key: string]: boolean;
  }>({});
  const [loadingReplies, setLoadingReplies] = useState<{
    [key: string]: boolean;
  }>({});
  const [replyPage, setReplyPage] = useState<{ [key: string]: number }>({});
  const [hasMoreReplies, setHasMoreReplies] = useState<{
    [key: string]: boolean;
  }>({});
  const [commentPage, setCommentPage] = useState<number>(1);
  const [hasMoreComments, setHasMoreComments] = useState<boolean>(true);

  // ------------------- Data Fetching Logic -------------------
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!postData) {
          let response;
          if (postCode) {
            response = await fetchPostByCode(postCode);
          } else {
            return;
          }

          setPostData({
            ...response,
            comments: response.comments || [],
            currentTab: "home",
            isPlaying: true,
            isLoadingComments: false,
          });
          setCommentPage(1);
          setHasMoreComments(true);
        }
      } catch (error: any) {
        toast({
          variant: "destructive",
          description: error.response?.data?.message || "An error occurred!",
        });
      }
    };

    fetchData();
  }, [postCode, toast]);

  // ------------------- Fullscreen Handling -------------------
  useEffect(() => {
    const handleChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleChange);
    return () => document.removeEventListener("fullscreenchange", handleChange);
  }, []);

  // ------------------- Comment Handling Logic -------------------
  const toggleReplies = async (commentCode: string) => {
    const isVisible = visibleReplies[commentCode];
    setVisibleReplies((prev) => ({ ...prev, [commentCode]: !isVisible }));

    if (!isVisible && postData) {
      const targetIndex = postData.comments?.findIndex(
        (c) => c.commentCode === commentCode
      );
      if (
        targetIndex === undefined ||
        targetIndex === -1 ||
        postData.comments[targetIndex].replies?.length > 0
      )
        return;

      setLoadingReplies((prev) => ({ ...prev, [commentCode]: true }));
      try {
        const replies = await fetchReplies(commentCode, "0");
        setPostData((prev) =>
          prev
            ? {
                ...prev,
                comments: prev.comments.map((c, idx) =>
                  idx === targetIndex ? { ...c, replies: replies || [] } : c
                ),
              }
            : prev
        );
        setReplyPage((prev) => ({ ...prev, [commentCode]: 1 }));
        setHasMoreReplies((prev) => ({
          ...prev,
          [commentCode]: replies?.length > 0,
        }));
      } catch (err) {
        console.error("Failed to fetch replies:", err);
        toast({
          variant: "destructive",
          description: "Failed to fetch replies!",
        });
      } finally {
        setLoadingReplies((prev) => ({ ...prev, [commentCode]: false }));
      }
    }
  };

  const handleLoadMoreComments = async () => {
    if (!postData) return;

    try {
      if (!postCode) return;
      const newComments = await fetchComments(postCode, String(commentPage));
      setPostData((prev) =>
        prev
          ? {
              ...prev,
              comments: [...(prev.comments || []), ...newComments],
            }
          : prev
      );
      setCommentPage((prev) => prev + 1);
      if (!newComments || newComments.length === 0) {
        setHasMoreComments(false);
      }
    } catch (error) {
      console.error("Failed to load more comments:", error);
      toast({
        variant: "destructive",
        description: "Failed to load more comments!",
      });
    }
  };

  const handleLoadMoreReplies = async (commentCode: string) => {
    if (loadingReplies[commentCode] || !postData) return;

    const page = replyPage[commentCode] || 1;
    setLoadingReplies((prev) => ({ ...prev, [commentCode]: true }));

    try {
      const newReplies = await fetchReplies(commentCode, String(page));
      if (newReplies && newReplies.length > 0) {
        setPostData((prev) =>
          prev
            ? {
                ...prev,
                comments: prev.comments.map((comment) =>
                  comment.commentCode === commentCode
                    ? {
                        ...comment,
                        replies: [...(comment.replies || []), ...newReplies],
                      }
                    : comment
                ),
              }
            : prev
        );
        setReplyPage((prev) => ({ ...prev, [commentCode]: page + 1 }));
      } else {
        setHasMoreReplies((prev) => ({ ...prev, [commentCode]: false }));
      }
    } catch (error) {
      console.error("Failed to load more replies:", error);
      toast({
        variant: "destructive",
        description: "Failed to load more replies!",
      });
    } finally {
      setLoadingReplies((prev) => ({ ...prev, [commentCode]: false }));
    }
  };

  const handleSendComment = async () => {
    if (!newComment.trim() || !postData) return;

    try {
      if (replyTarget) {
        const res = await reply(replyTarget.commentCode, newComment);
        if (res) {
          setPostData((prev) =>
            prev
              ? {
                  ...prev,
                  comments: prev.comments.map((comment) =>
                    comment.commentCode === replyTarget.commentCode
                      ? {
                          ...comment,
                          replies: [res, ...(comment.replies || [])],
                          replyCount: (
                            Number(comment.replyCount) + 1
                          ).toString(),
                        }
                      : comment
                  ),
                }
              : prev
          );
          setVisibleReplies((prev) => ({
            ...prev,
            [replyTarget.commentCode]: true,
          }));
        }
      } else {
        const res = await comment(postData.postCode, newComment);
        if (res) {
          setPostData((prev) =>
            prev
              ? {
                  ...prev,
                  comments: [{ ...res, replies: [] }, ...(prev.comments || [])],
                  commentCount: (Number(prev.commentCount) + 1).toString(),
                }
              : prev
          );
        }
      }

      setNewComment("");
      setReplyTarget(null);
    } catch (error) {
      console.error("Failed to send comment/reply:", error);
      toast({
        variant: "destructive",
        description: "Failed to send comment/reply!",
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
                    liked: !comment.liked,
                    likeCount: comment.liked
                      ? (Number(comment.likeCount) - 1).toString()
                      : (Number(comment.likeCount) + 1).toString(),
                  };
                }

                const updatedReplies = comment.replies?.map((reply) =>
                  reply.commentCode === code
                    ? {
                        ...reply,
                        liked: !reply.liked,
                        likeCount: reply.liked
                          ? (Number(reply.likeCount) - 1).toString()
                          : (Number(reply.likeCount) + 1).toString(),
                      }
                    : reply
                );

                return {
                  ...comment,
                  replies: updatedReplies ?? comment.replies,
                };
              }),
            }
          : prev
      );
    } catch (error) {
      console.error("Failed to like/unlike:", error);
      toast({
        variant: "destructive",
        description: "Failed to like/unlike!",
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
                  if (comment.commentCode === code) {
                    return null;
                  }
                  if (
                    comment.replies?.some((reply) => reply.commentCode === code)
                  ) {
                    return {
                      ...comment,
                      replies: comment.replies.filter(
                        (reply) => reply.commentCode !== code
                      ),
                      replyCount: (Number(comment.replyCount) - 1).toString(),
                    };
                  }
                  return comment;
                })
                .filter((comment): comment is Comment => comment !== null),
              commentCount: prev.comments.some((c) => c.commentCode === code)
                ? (Number(prev.commentCount) - 1).toString()
                : prev.commentCount,
            }
          : prev
      );
    } catch (error) {
      console.error("Failed to delete comment:", error);
      toast({
        variant: "destructive",
        description: "Failed to delete comment!",
      });
    }
  };

  const handleLikePost = async (postCode: string) => {
    try {
      await likePost(postCode);
      setPostData((prev) =>
        prev
          ? {
              ...prev,
              isLiked: !prev.isLiked,
              likeCount: prev.isLiked
                ? (Number(prev.likeCount) - 1).toString()
                : (Number(prev.likeCount) + 1).toString(),
            }
          : prev
      );
    } catch (error: any) {
      toast({
        variant: "destructive",
        description:
          error.response?.data?.message || "Failed to like the post!",
      });
    }
  };

  const onchangeTab = async (tabType: TabType) => {
    if (!postData || tabType === "acc") return;

    if (
      tabType === "cmt" &&
      (postData.comments === null || postData.comments?.length === 0)
    ) {
      try {
        setPostData((prev) =>
          prev ? { ...prev, isLoadingComments: true } : prev
        );
        const comments = await fetchComments(postData.postCode, "0");
        setPostData((prev) =>
          prev
            ? {
                ...prev,
                comments,
                currentTab: tabType,
                isLoadingComments: false,
              }
            : prev
        );
        setCommentPage(1);
        setHasMoreComments(comments?.length > 0);
      } catch (error) {
        setPostData((prev) =>
          prev ? { ...prev, isLoadingComments: false } : prev
        );
        toast({
          variant: "destructive",
          description: "Failed to fetch comments!",
        });
      }
    } else {
      setPostData((prev) => (prev ? { ...prev, currentTab: tabType } : prev));
    }
  };
  const handleDeletePost = async (postCode: string) => {
    try {
      const response = await deletePost(postCode);
      toast({
        variant: "default", // hoặc "success" nếu bạn định nghĩa biến thể này
        description: response?.data?.message || "Post deleted successfully!",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        description: error.response?.data?.message || "Failed to delete post!",
      });
    }
  };

  // ------------------- API Functions -------------------
  const fetchPostByCode = async (postCode: string) => {
    const response = await axiosInstance.post("post/get-post-by-code", {
      code: postCode,
    });
    return response.data.data;
  };

  const fetchComments = async (code: string, page: string) => {
    const response = await axiosInstance.post("comment/get-main-comment", {
      code: code,
      page: page,
      size: 5,
    });
    return response.data.data;
  };

  const fetchReplies = async (code: string, page: string) => {
    const response = await axiosInstance.post("comment/get-replies", {
      code: code,
      page: page,
      size: 5,
    });
    return response.data.data;
  };

  const comment = async (postCode: string, content: string) => {
    const response = await axiosInstance.post("comment/comment", {
      postCode: postCode,
      content: content,
    });
    return response.data.data;
  };

  const reply = async (commentCode: string, content: string) => {
    const response = await axiosInstance.post("comment/reply", {
      commentCode: commentCode,
      content: content,
    });
    return response.data.data;
  };

  const likeOrUnlike = async (code: string) => {
    const response = await axiosInstance.post("comment/like", {
      code: code,
    });
    return response.data.data;
  };

  const deleteComment = async (code: string) => {
    const response = await axiosInstance.post("comment/delete", {
      code: code,
    });
    return response.data.data;
  };

  const likePost = async (postCode: string) => {
    const response = await axiosInstance.post("post/like", {
      code: postCode,
    });
    return response.data.data;
  };

  const deletePost = async (postCode: string) => {
    const response = await axiosInstance.post("post/delete", {
      code: postCode,
    });
    return response.data.data;
  };
  // ------------------- Render Logic -------------------
  if (!postData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-h-[80vh] h-screen flex flex-col ">
      <div className="flex-1 flex justify-center items-center rounded-[50px] overflow-hidden">
        {(() => {
          switch (postData.currentTab || "home") {
            case "home":
              return (
                <PostContent
                  post={postData}
                  index={0}
                  mediaRefs={{ current: [mediaRef.current] }}
                  isPlaying={postData.isPlaying}
                  handleLikePost={handleLikePost}
                />
              );
            case "cmt":
              return (
                <ScrollArea
                  className="flex-1 max-h-full h-full max-w-[500px] mt-20 p-2 bg-white dark:bg-zinc-900 rounded-[50px] overflow-y-auto overflow-x-hidden"
                  data-scroll-ignore
                >
                  <PostHeader
                    post={postData}
                    onchangeTab={onchangeTab}
                    handleDeletePost={handleDeletePost}
                  />
                  <PostComments
                    post={postData}
                    newComment={newComment}
                    setNewComment={setNewComment}
                    replyTarget={replyTarget}
                    setReplyTarget={setReplyTarget}
                    activePostId={activePostId}
                    setActivePostId={setActivePostId}
                    visibleReplies={visibleReplies}
                    loadingReplies={loadingReplies}
                    hasMoreReplies={hasMoreReplies}
                    hasMoreComments={hasMoreComments}
                    toggleReplies={toggleReplies}
                    handleLoadMoreComments={handleLoadMoreComments}
                    handleLoadMoreReplies={handleLoadMoreReplies}
                    handleSendComment={handleSendComment}
                    handleLikeOrUnlike={handleLikeOrUnlike}
                    handleDeleteComment={handleDeleteComment}
                    isFullscreen={isFullscreen}
                  />
                </ScrollArea>
              );
            default:
              return <div>Không có tab phù hợp</div>;
          }
        })()}
      </div>

      <div className="flex justify-center mt-1 ">
        <div className="w-full sm:w-auto flex gap-2 items-center pb-2 mx-2">
          <Tabs
            value={postData.currentTab || "home"}
            onValueChange={(value) => onchangeTab(value as TabType)}
            className="w-full"
          >
            <TabsList
              className="
                w-full sm:w-[300px]
                mx-auto
                bg-zinc-200 dark:bg-zinc-800
                flex justify-between
                rounded-3xl
                h-[45px]
              "
            >
              <TabsTrigger
                value="home"
                className="
                  data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-700
                  h-[38px] data-[state=active]:px-6
                  rounded-3xl
                  text-zinc-800 dark:text-zinc-200
                  w-full flex justify-center
                "
              >
                <Home className="h-5 w-5 mr-1" />
                {postData.currentTab === "home" ? (
                  <span className="flex justify-center text-xs">Home</span>
                ) : (
                  ""
                )}
              </TabsTrigger>

              <TabsTrigger
                value="cmt"
                className="
                  data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-700
                  h-[38px] data-[state=active]:px-6
                  rounded-3xl
                  text-zinc-800 dark:text-zinc-200
                  w-full flex justify-center
                "
              >
                <MessageCircle className="h-5 w-5 mr-1" />
                {postData.currentTab === "cmt" ? (
                  <span className="flex justify-center text-xs">Comment</span>
                ) : (
                  ""
                )}
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default PostCompo;
