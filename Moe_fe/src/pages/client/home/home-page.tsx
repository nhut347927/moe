import { useState, useRef, useEffect } from "react";
import { useToast } from "@/common/hooks/use-toast";
import { Post, Comment, TabType } from "./types";
import PostHeader from "./item/post-header";
import PostContent from "./item/post-content";
import PostComments from "./item/post-comments";
import { Heart, MessageSquareHeart, Proportions } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import axiosInstance from "@/services/axios/axios-instance";
import { cn, getTimeAgo } from "@/common/utils/utils";

// Define the Home component
const HomePage = () => {
  // ------------------- State Management -------------------
  // State để lưu danh sách bài post
  const [postData, setPostData] = useState<Post[]>([]);

  // State and Refs
  const mediaRefs = useRef<(HTMLDivElement | null)[]>([]);
  const currentIndex = useRef<number>(0);
  const [currentPostIndex, setCurrentPostIndex] = useState<number>(0);
  // Hook để hiển thị thông báo
  const { toast } = useToast();

  // States moved from PostComments
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
  const [commentPage, setCommentPage] = useState<{ [key: string]: number }>({});
  const [hasMoreComments, setHasMoreComments] = useState<{
    [key: string]: boolean;
  }>({});
  const [openComment, setOpenComment] = useState(false);
  // ------------------- Data Fetching Logic -------------------
  // Effect để lấy dữ liệu ban đầu và khởi tạo states
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (postData.length === 0) {
          const response = await fetchPost();
          const enrichedPosts = response.map((post: Post, index: number) => ({
            ...post,
            comments: post.comments || [],
            currentTab: "home",
            isPlaying: index === 0,
          }));
          setPostData(enrichedPosts);
          // Initialize commentPage and hasMoreComments for each post
          setCommentPage(
            enrichedPosts.reduce(
              (acc: { [key: string]: number }, post: Post) => ({
                ...acc,
                [post.postCode]: 1,
              }),
              {}
            )
          );
          setHasMoreComments(
            enrichedPosts.reduce(
              (acc: { [key: string]: boolean }, post: Post) => ({
                ...acc,
                [post.postCode]: true,
              }),
              {}
            )
          );
        }
      } catch (error: any) {
        toast({
          variant: "destructive",
          description: error.response?.data?.message || "An error occurred!",
        });
      }
    };

    fetchData();
  }, []);

  // ------------------- Scroll Navigation Logic -------------------
  const isFetching = useRef(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = mediaRefs.current.findIndex(
              (ref) => ref === entry.target
            );

            if (index !== -1 && index !== currentIndex.current) {
              currentIndex.current = index;
              setCurrentPostIndex(index);

              setPostData((prev) =>
                prev.map((post, idx) => ({
                  ...post,
                  isPlaying: idx === index,
                }))
              );

              viewPost(postData[index].postCode);

              if (Number(index - 1) === 0) {
                viewPost(postData[0].postCode);
              }

              if (!isFetching.current && index >= postData.length - 3) {
                isFetching.current = true;

                fetchPost()
                  .then((newPosts) => {
                    setPostData((prev) => {
                      const existingCodes = new Set(
                        prev.map((p) => p.postCode)
                      );
                      const filteredPosts = newPosts.filter(
                        (post: Post) => !existingCodes.has(post.postCode)
                      );
                      const enrichedPosts = filteredPosts.map((post: Post) => ({
                        ...post,
                        comments: post.comments || [],
                        currentTab: "home",
                        isPlaying: false,
                      }));
                      return [...prev, ...enrichedPosts];
                    });
                  })
                  .catch(console.error)
                  .finally(() => {
                    isFetching.current = false;
                  });
              }
            }
          }
        });
      },
      { root: null, threshold: 0.6 }
    );

    // 👉 Gắn observer cho tất cả phần tử có ref
    mediaRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    // 🧹 Cleanup
    return () => {
      mediaRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, [postData]);

  // ------------------- Comment Handling Logic -------------------
  const toggleReplies = async (commentCode: string) => {
    const isVisible = visibleReplies[commentCode];
    setVisibleReplies((prev) => ({ ...prev, [commentCode]: !isVisible }));

    if (!isVisible) {
      const post = postData[currentPostIndex];
      const targetIndex = post.comments?.findIndex(
        (c) => c.commentCode === commentCode
      );
      if (
        targetIndex === undefined ||
        targetIndex === -1 ||
        post.comments[targetIndex].replies?.length > 0
      )
        return;

      setLoadingReplies((prev) => ({ ...prev, [commentCode]: true }));
      try {
        const replies = await fetchReplies(commentCode, "0");
        setPostData((prev) => {
          const updated = [...prev];
          updated[currentPostIndex] = {
            ...updated[currentPostIndex],
            comments: updated[currentPostIndex].comments.map((c, idx) =>
              idx === targetIndex ? { ...c, replies: replies || [] } : c
            ),
          };
          return updated;
        });
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
    const post = postData[currentPostIndex];
    const postCode = post.postCode;
    try {
      const newComments = await fetchComments(
        postCode,
        String(commentPage[postCode] || 1)
      );
      setPostData((prev) => {
        const updated = [...prev];
        updated[currentPostIndex] = {
          ...updated[currentPostIndex],
          comments: [
            ...(updated[currentPostIndex].comments || []),
            ...newComments,
          ],
        };
        return updated;
      });
      setCommentPage((prev) => ({
        ...prev,
        [postCode]: (prev[postCode] || 1) + 1,
      }));
      if (!newComments || newComments.length === 0) {
        setHasMoreComments((prev) => ({ ...prev, [postCode]: false }));
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
    if (loadingReplies[commentCode]) return;

    // const post = postData[currentPostIndex];
    const page = replyPage[commentCode] || 1;
    setLoadingReplies((prev) => ({ ...prev, [commentCode]: true }));

    try {
      const newReplies = await fetchReplies(commentCode, String(page));
      if (newReplies && newReplies.length > 0) {
        setPostData((prev) => {
          const updated = [...prev];
          updated[currentPostIndex] = {
            ...updated[currentPostIndex],
            comments: updated[currentPostIndex].comments.map((comment) =>
              comment.commentCode === commentCode
                ? {
                    ...comment,
                    replies: [...(comment.replies || []), ...newReplies],
                  }
                : comment
            ),
          };
          return updated;
        });
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
    if (!newComment.trim()) return;

    const post = postData[currentPostIndex];
    try {
      if (replyTarget) {
        const res = await reply?.(replyTarget.commentCode, newComment);
        if (res) {
          setPostData((prev) => {
            const updated = [...prev];
            updated[currentPostIndex] = {
              ...updated[currentPostIndex],
              comments: updated[currentPostIndex].comments.map((comment) =>
                comment.commentCode === replyTarget.commentCode
                  ? {
                      ...comment,
                      replies: [res, ...(comment.replies || [])],
                    }
                  : comment
              ),
            };
            return updated;
          });
          setVisibleReplies((prev) => ({
            ...prev,
            [replyTarget.commentCode]: true,
          }));
        }
      } else {
        const res = await comment?.(post.postCode, newComment);
        if (res) {
          setPostData((prev) => {
            const updated = [...prev];
            updated[currentPostIndex] = {
              ...updated[currentPostIndex],
              comments: [
                { ...res, replies: [] },
                ...(updated[currentPostIndex].comments || []),
              ],
            };
            return updated;
          });
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
      await likeOrUnlike?.(code);

      setPostData((prev) => {
        const updated = [...prev];
        updated[currentPostIndex] = {
          ...updated[currentPostIndex],
          comments: updated[currentPostIndex].comments.map((comment) => {
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
        };
        return updated;
      });
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
      await deleteComment?.(code);
      setPostData((prev) => {
        const updated = [...prev];
        updated[currentPostIndex] = {
          ...updated[currentPostIndex],
          comments: updated[currentPostIndex].comments
            .map((comment) => {
              // Check if the code matches a main comment
              if (comment.commentCode === code) {
                return null; // Mark for removal
              }
              // Check if the code matches a reply
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
            .filter((comment): comment is Comment => comment !== null), // Remove null comments
        };
        return updated;
      });
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
      await likePost(postCode); // Không trả về gì

      // Tự cập nhật UI dựa trên postCode
      setPostData((prev) =>
        prev.map((post) =>
          post.postCode === postCode
            ? {
                ...post,
                isLiked: !post.isLiked,
                likeCount: post.isLiked
                  ? (Number(post.likeCount) - 1).toString()
                  : (Number(post.likeCount) + 1).toString(),
              }
            : post
        )
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
    if (
      !postData.length ||
      currentPostIndex < 0 ||
      currentPostIndex >= postData.length
    ) {
      return;
    }

    setPostData((prevPosts) => {
      const updatedPosts = [...prevPosts];
      const post = { ...updatedPosts[currentPostIndex] };

      if (
        tabType === "cmt" &&
        (post.comments === null || post.comments?.length === 0)
      ) {
        fetchComments(post.postCode, "0")
          .then((comments) => {
            setPostData((prev) => {
              const newPosts = [...prev];
              newPosts[currentPostIndex] = {
                ...newPosts[currentPostIndex],
                comments,
                currentTab: tabType,
              };
              return newPosts;
            });
            setCommentPage((prev) => ({
              ...prev,
              [post.postCode]: 1,
            }));
            setHasMoreComments((prev) => ({
              ...prev,
              [post.postCode]: comments?.length > 0,
            }));
          })
          .catch((error) => {
            toast({
              variant: "destructive",
              description:
                error.response?.data?.message || "Failed to fetch comments!",
            });
          });
      } else if (tabType === "acc") {
        Promise.all([
          fetchAccountProfile(post.userCode),
          fetchAccountPost(post.userCode, "0"),
        ])
          .then(([profile, posts]) => {
            setPostData((prev) => {
              const newPosts = [...prev];
              const current = newPosts[currentPostIndex];

              newPosts[currentPostIndex] = {
                ...current,
                accountDetail: {
                  ...profile,
                  posts: posts.contents,
                  page: 1, // 👈 set thêm page tại đây
                  hasNext: posts.hasNext,
                },
                currentTab: tabType as TabType,
              };

              return newPosts;
            });
          })
          .catch((error) => {
            toast({
              variant: "destructive",
              description:
                error.response?.data?.message ||
                "Failed to fetch profile or posts!",
            });
          });
      } else {
        updatedPosts[currentPostIndex] = {
          ...post,
          currentTab: tabType,
        };
      }

      return updatedPosts;
    });
  };

  const handleDeletePost = async (postCode: string) => {
    try {
      await deletePost(postCode);

      setPostData((prev) => prev.filter((post) => post.postCode !== postCode));
    } catch (error: any) {
      toast({
        variant: "destructive",
        description: error.response?.data?.message || "Failed to delete post!",
      });
    }
  };

  // ------------------- API Functions -------------------
  const fetchPost = async () => {
    const response = await axiosInstance.get("posts");
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

  const viewPost = async (postCode: string) => {
    const response = await axiosInstance.post("posts/view", {
      code: postCode,
    });
    return response.data.data;
  };

  const fetchAccountProfile = async (userCode: string) => {
    const response = await axiosInstance.get(`account/get-account`, {
      params: { code: userCode },
    });
    return response.data.data;
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

  const deletePost = async (postCode: string) => {
    const response = await axiosInstance.post("post/delete", {
      code: postCode,
    });
    return response.data.data;
  };

  // ------------------- Render Logic -------------------
  return (
    <div className="max-h-screen h-screen w-full relative">
      <div className="absolute z-30 right-3 top-3 px-2 h-[30px] bg-zinc-100/70 dark:bg-zinc-800/60 backdrop-blur-sm flex items-center rounded-xl shadow-sm">
        <Proportions className="h-3.5 w-3.5 mr-1 text-zinc-500 dark:text-zinc-500" />
        <span className="text-zinc-500 dark:text-zinc-500">
          {currentIndex.current + 1}/{postData.length}
        </span>
      </div>

      <div className="z-10 absolute inset-0 flex justify-center items-center">
        <img
          src={`abc/video/upload/so_${
            postData[currentIndex.current]?.thumbnail ?? "0"
          }/${postData[currentIndex.current]?.videoUrl}.jpg`}
          className="z-10 max-w-full max-h-full object-contain blur-3xl scale-125 opacity-90 brightness-75 transition-all"
          alt="Blur background"
        />
      </div>

      <div
        id="video-container"
        className="z-10 overflow-y-auto scroll-but-hidden snap-y snap-mandatory h-full w-full"
      >
        {postData.map((post, index) => (
          <div
            key={index}
            ref={(el) => (mediaRefs.current[index] = el)}
            className="h-screen snap-center flex flex-col"
          >
            <PostContent
              post={post}
              index={index}
              mediaRefs={mediaRefs}
              isPlaying={post.isPlaying}
              handleLikePost={handleLikePost}
            />
          </div>
        ))}
      </div>
      <div className="z-30 absolute  bottom-2 left-0 right-0 px-4 flex items-end justify-between">
        {/* Left: User info + caption */}
        <div className="opacity-80 mb-2 max-w-full flex items-center space-x-3">
          <Link
            to={`/client/profile?code=${
              postData[currentIndex.current]?.userCode
            }`}
          >
            <Avatar className="w-10 h-10 transition-all">
              <AvatarImage
                src={`abc/image/upload/w_80,h_80/${
                  postData[currentIndex.current]?.userAvatar
                }`}
              />
              <AvatarFallback className="bg-zinc-400 text-white text-sm">
                CN
              </AvatarFallback>
            </Avatar>
          </Link>
          <span
            onClick={() =>
              handleLikePost?.(postData[currentIndex.current]?.postCode)
            }
            className={cn(
              "w-[42px] h-[42px] p-2 rounded-full flex items-center justify-center transition-all",
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
            className="w-[42px] h-[42px] p-2 rounded-full flex items-center justify-center bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700"
            onClick={() => setOpenComment(true)}
          >
            <MessageSquareHeart className="w-5 h-5 mt-0.5 text-zinc-500 dark:text-zinc-500" />
          </span>

          <div className="leading-tight">
            <p className="text-[12px] text-zinc-400 dark:text-zinc-500 mb-0.5">
              [{getTimeAgo(postData[currentIndex.current]?.createdAt)}]
            </p>
            <p className="text-sm font-medium text-zinc-600 dark:text-zinc-300 truncate">
              {postData[currentIndex.current]?.title}
            </p>
          </div>
        </div>
      </div>
      {openComment && (
        <>
          {/* Overlay nền mờ */}
          <div
            onClick={() => setOpenComment(false)}
            className="fixed inset-0 top-0 right-0 bg-black/40 z-40 transition-opacity"
          />

          {/* Popup bình luận */}
          <div className="fixed inset-0 z-50 flex justify-center items-center pointer-events-none">
            <div
              className={`
          max-w-2xl w-full  mt-auto
          transform transition-all duration-300 ease-in-out
          ${
            openComment
              ? "opacity-100 translate-y-0 scale-100"
              : "opacity-0 translate-y-10 scale-95"
          }
          pointer-events-auto
        `}
            >
              <div className="max-h-[80vh] " data-scroll-ignore>
                <PostComments
                  post={postData[currentIndex.current]}
                  onchangeTab={onchangeTab}
                  handleDeletePost={handleDeletePost}
                  newComment={newComment}
                  setNewComment={setNewComment}
                  replyTarget={replyTarget}
                  setReplyTarget={setReplyTarget}
                  activePostId={activePostId}
                  setActivePostId={setActivePostId}
                  visibleReplies={visibleReplies}
                  loadingReplies={loadingReplies}
                  hasMoreReplies={hasMoreReplies}
                  hasMoreComments={
                    hasMoreComments[postData[currentIndex.current]?.postCode] ||
                    false
                  }
                  toggleReplies={toggleReplies}
                  handleLoadMoreComments={handleLoadMoreComments}
                  handleLoadMoreReplies={handleLoadMoreReplies}
                  handleSendComment={handleSendComment}
                  handleLikeOrUnlike={handleLikeOrUnlike}
                  handleDeleteComment={handleDeleteComment}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default HomePage;
