import { useState, useRef, useEffect } from "react";
import { useToast } from "@/common/hooks/use-toast";
import { Post, Comment, TabType } from "./types";
import PostHeader from "./item/post-header";
import PostContent from "./item/post-content";
import PostComments from "./item/post-comments";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Blend,
  Heart,
  MessageCircle,
  Proportions,
  User,
  Bell,
  Search,
  Home,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AccountProfile } from "./item/AccountProfile";
import { Link } from "react-router-dom";
import axiosInstance from "@/services/axios/axios-instance";
import { cn } from "@/common/utils/utils";

// Define the Home component
const HomePage = () => {
  // ------------------- State Management -------------------
  // State để lưu danh sách bài post
  const [postData, setPostData] = useState<Post[]>([]);
  // State để kiểm soát chế độ toàn màn hình
  const [isFullscreen, setIsFullscreen] = useState(false);
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

  // ------------------- Fullscreen Handling -------------------
  useEffect(() => {
    const handleChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleChange);
    return () => document.removeEventListener("fullscreenchange", handleChange);
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
                      const existingIds = new Set(prev.map((p) => p.postId));
                      const filteredPosts = newPosts.filter(
                        (post: Post) => !existingIds.has(post.postId)
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

  const handleFollowOrUnfollow = async (userCode: string) => {
    try {
      await followOrUnfollow(userCode);

      setPostData((prev) =>
        prev.map((post) => {
          if (post.userCode !== userCode) return post;

          if (!post.accountDetail) return post;

          return {
            ...post,
            accountDetail: {
              ...post.accountDetail,
              isFollowing: !post.accountDetail.isFollowing,
              followed: post.accountDetail.isFollowing
                ? (Number(post.accountDetail.followed) - 1).toString()
                : (Number(post.accountDetail.followed) + 1).toString(),
            },
          };
        })
      );
    } catch (error: any) {
      toast({
        variant: "destructive",
        description:
          error.response?.data?.message || "Failed to follow/unfollow!",
      });
    }
  };

  const loadMorePost = (userCode: string, page: string) => {
    fetchAccountPost(userCode, page)
      .then((newPosts) => {
        setPostData((prev) => {
          const newPostData = [...prev];
          const current = newPostData[currentPostIndex];

          if (!current.accountDetail) return prev; // Phòng hờ nhưng chắc chắn đã có

          newPostData[currentPostIndex] = {
            ...current,
            accountDetail: {
              ...current.accountDetail,
              posts: [...current.accountDetail.posts, ...newPosts.contents], // nối post cũ + mới
              page: Number(page) + 1, // cập nhật page
              hasNext: newPosts.hasNext,
            },
          };

          return newPostData;
        });
      })
      .catch((error) => {
        toast({
          variant: "destructive",
          description:
            error.response?.data?.message || "Failed to fetch more posts!",
        });
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
    const response = await axiosInstance.get("post/get-post");
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
    const response = await axiosInstance.post("post/view", {
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

  const followOrUnfollow = async (userCode: string) => {
    const response = await axiosInstance.post("account/follow", {
      code: userCode,
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
      <div className="absolute top-11 left-0 p-2 z-10 flex justify-start">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="p-2.5 bg-zinc-100/60 text-zinc-800 hover:bg-zinc-200 border border-zinc-300 dark:bg-white/5 dark:text-white dark:border-white/10 dark:hover:bg-white/10 transition-colors rounded-full"
            >
              <Blend className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="overflow-hidden bg-muted rounded-3xl mt-2"
            align="start"
          >
            <ScrollArea
              className="w-[300px] h-[300px] p-6 pt-0 space-y-3"
              data-scroll-ignore
            >
              <div className="space-y-1">
                <h4 className="text-sm font-medium text-zinc-800 dark:text-zinc-100">
                  Filter by Tags
                </h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Select one or more tags to personalize the feed.
                </p>
              </div>

              <div className="relative p-1">
                <input
                  type="text"
                  placeholder="Search tags..."
                  className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:bg-zinc-800 dark:text-zinc-200"
                />
              </div>

              <div className="flex items-center mb-2">
                <span className="text-sm text-zinc-600 dark:text-zinc-300 mr-2">
                  Sort Tags
                </span>
                <button className="flex items-center gap-2 px-3 py-1 text-sm font-medium text-zinc-700 dark:text-zinc-200 rounded-full border border-zinc-300 dark:border-zinc-600 transition-all duration-200 hover:bg-zinc-200 dark:hover:bg-zinc-700">
                  <span className="text-base">↕</span>
                  {true ? "Unsort" : "Sort"}
                </button>
              </div>

              <div className="flex flex-wrap gap-2 mb-9">#fdfdfdfdf</div>
            </ScrollArea>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="absolute top-0 left-11 p-2 z-50 flex justify-start">
        <Link to={"/client/search"}>
          <Button
            variant="outline"
            className=" p-2.5 bg-zinc-100/60 text-zinc-800 hover:bg-zinc-200 border border-zinc-300 dark:bg-white/5 dark:text-white dark:border-white/10 dark:hover:bg-white/10 transition-colors rounded-full"
          >
            <Search className="h-4 w-4" />
          </Button>
        </Link>
      </div>
      <div
        id="video-container"
        className="overflow-y-auto scroll-but-hidden snap-y snap-mandatory h-full w-full"
      >
        {postData.map((post, index) => (
          <div
            key={index}
            ref={(el) => (mediaRefs.current[index] = el)}
            className="h-screen snap-center flex flex-col"
          >
            <div className=" flex-1 flex justify-center items-center overflow-hidden">
              {(() => {
                switch (post.currentTab || "home") {
                  case "home":
                    return (
                      <PostContent
                        post={post}
                        index={index}
                        mediaRefs={mediaRefs}
                        isPlaying={post.isPlaying}
                        handleLikePost={handleLikePost}
                      />
                    );
                  case "cmt":
                    return (
                      <ScrollArea
                        className="flex-1 max-h-full h-full overflow-y-auto w-full sm:max-w-lg mt-20 overflow-x-hidden"
                        data-scroll-ignore
                      >
                        <PostHeader
                          post={post}
                          onchangeTab={onchangeTab}
                          handleDeletePost={handleDeletePost}
                        />
                        <PostComments
                          post={post}
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
                            hasMoreComments[post.postCode] || false
                          }
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
                  case "acc":
                    return (
                      <AccountProfile
                        accountDetail={post.accountDetail}
                        handleFollowOrUnfollow={handleFollowOrUnfollow}
                        handleDeletePost={handleDeletePost}
                        loadMorePost={loadMorePost}
                      />
                    );
                  default:
                    return <div>Không có tab phù hợp</div>;
                }
              })()}
            </div>

            <div
              className={`flex justify-center mt-1 
                          ${
                            isFullscreen
                              ? "pb-4"
                              : "pb-[50px] sm:pb-[env(safe-area-inset-bottom)]"
                          }`}
            >
              <div className="w-full sm:w-auto flex gap-2 items-center pb-2 mx-2">
                <Tabs
                  value={post.currentTab || "home"}
                  onValueChange={(value) => {
                    onchangeTab(value as TabType);
                  }}
                  className="w-full"
                >
                  <TabsList
                    className="
        w-full sm:w-[400px]
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
                      {post.currentTab === "home" ? (
                        <span className="w-f flex justify-center text-xs">
                          Home
                        </span>
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
         
        "
                    >
                      <MessageCircle className="h-5 w-5 mr-1" />
                      {post.currentTab === "cmt" ? (
                        <span className="w-full flex justify-center text-xs">
                          Comment
                        </span>
                      ) : (
                        ""
                      )}
                    </TabsTrigger>

                    <TabsTrigger
                      value="acc"
                      className="
          data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-700
          h-[38px] data-[state=active]:px-6
          rounded-3xl
          text-zinc-800 dark:text-zinc-200
          w-full flex justify-center
          
        "
                    >
                      <User className="h-5 w-5 mr-1" />
                      {post.currentTab === "acc" ? (
                        <span className=" text-xs">Account</span>
                      ) : (
                        ""
                      )}
                    </TabsTrigger>
                  </TabsList>
                </Tabs>

                <div className="px-4 h-[45px] bg-zinc-200 dark:bg-zinc-800 flex items-center rounded-3xl">
                  <Proportions className="h-4 w-4 mr-1 text-zinc-500 dark:text-zinc-400" />
                  <span className="inline-block text-zinc-600 dark:text-zinc-300 text-sm">
                    {index + 1}/{postData.length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
