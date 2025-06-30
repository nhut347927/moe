import { useState, useRef, useEffect } from "react";
import { useToast } from "@/common/hooks/use-toast";
import { Post, Comment } from "../home/types";
import PostContent from "../home/item/post-content";
import PostHeader from "../home/item/post-header";
import PostComments from "../home/item/post-comments";
import PostActions from "../home/item/post-actions";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/common/utils/utils";

// Dữ liệu mẫu (chỉ 1 bài đăng)
const samplePostData: Post = {
  userId: "user1",
  postId: "post1",
  createdAt: "2025-04-01T10:00:00Z",
  userAvatar:
    "https://res.cloudinary.com/dwv76nhoy/image/upload/v1739337151/rrspasosi59xmsriilae.png",
  userDisplayName: "John Doe",
  userName: "johndoe",
  postType: "VIDEO",
  videoUrl:
    "https://res.cloudinary.com/dwv76nhoy/video/upload/v1740748142/videos/ku2ammahemr2k4iiezza.mp4",
  imageUrls: [],
  title: "Đây là một tiêu đề hơi dài dòng và dài hơn một chút nữa",
  description: "Như cơn mưa anh tưới mát trái tim khô cằn...",
  tags: ["w/n", "3107", "idt042019"],
  likeCount: "120",
  commentCount: "15",
  playlistCount: "5",
  audioUrl: "",
  audioOwnerAvatar:
    "https://res.cloudinary.com/dwv76nhoy/image/upload/v1739337151/rrspasosi59xmsriilae.png",
  audioOwnerName: "Audio Creator",
  audioId: "audio1",
  comments: [
    {
      commentId: "cmt1",
      userAvatar:
        "https://res.cloudinary.com/dwv76nhoy/image/upload/v1739337151/rrspasosi59xmsriilae.png",
      content: "Great video!",
      displayName: "Jane Smith",
      createdAt: "2025-04-01T10:05:00Z",
      replies: [
        {
          commentId: "reply1",
          userAvatar:
            "https://res.cloudinary.com/dwv76nhoy/image/upload/v1739337151/rrspasosi59xmsriilae.png",
          content: "Thanks!",
          displayName: "John Doe",
          createdAt: "2025-04-01T10:06:00Z",
        },
      ],
    },
  ],
};

const PostPage = () => {
  const videoRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const commentsRef = useRef<HTMLDivElement | null>(null);
  const { toast } = useToast();

  const [post, setPost] = useState<Post | null>(null);
  const [audioState] = useState({
    isPlaying: true,
    isMuted: false,
  });
  const [comments, setComments] = useState<Comment[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [showCommentsHint, setShowCommentsHint] = useState(true);
  const [activePostId, setActivePostId] = useState<string | null>(null);

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => setShowDetails(true), 600);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    try {
      setPost(samplePostData);
      setComments(samplePostData.comments);
    } catch (error: any) {
      toast({
        variant: "destructive",
        description: error.response?.data?.message || "Có lỗi xảy ra!",
      });
    }
  }, [toast]);

  useEffect(() => {
    if (!contentRef.current || !commentsRef.current) return;

    const handleScroll = () => {
      const scrollTop = contentRef.current!.scrollTop;
      const commentsPosition = commentsRef.current!.offsetTop;
      setShowCommentsHint(scrollTop <= commentsPosition - 300);
    };

    const contentEl = contentRef.current;
    contentEl?.addEventListener("scroll", handleScroll);
    return () => contentEl?.removeEventListener("scroll", handleScroll);
  }, [post]);

  const scrollToComments = () => {
    if (contentRef.current && commentsRef.current) {
      contentRef.current.scrollTo({
        top: commentsRef.current.offsetTop - 100,
        behavior: "smooth",
      });
    }
  };

  const handleAddComment = () => {
    if (!newComment.trim() || !post) return;

    const newCommentObj: Comment = {
      commentId: `cmt-${Date.now()}`,
      userAvatar: samplePostData.userAvatar,
      content: newComment,
      displayName: "Current User",
      createdAt: new Date().toISOString(),
      replies: [],
    };

    setComments((prev) => [...prev, newCommentObj]);
    setNewComment("");
    toast({ description: "Đã thêm bình luận!" });
  };

  const addEmoji = (emoji: string) => setNewComment((prev) => prev + emoji);

  if (!post) {
    return <div className="text-center py-10">Đang tải bài viết...</div>;
  }

  return (
    <div className="max-h-screen h-screen p-2 relative">
      <div className="h-full bg-white dark:bg-zinc-900 rounded-3xl p-2 pb-0">
        <div className="h-full w-full overflow-hidden relative flex items-center justify-center">
          <div className="flex flex-col">
            <div className="ms-9">
            <span className="text-sm text-zinc-600 bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded-md">
              <strong>POST/ID:</strong> 550e8400-e29b-41d4-a716-446655440000
            </span>
            </div>
            <div className="relative z-10 w-full h-full flex flex-col md:flex-row items-center justify-center p-4 md:p-8 gap-6 md:gap-12">
              <PostContent
                post={post}
                index={0}
                videoRefs={{ current: [videoRef.current] }}
                audioStates={{ 0: audioState }}
                isVisible={isVisible}
              />
              <div
                className={cn(
                  "w-full md:w-2/5 h-[50vh] md:h-[78vh] flex flex-col transition-all duration-1000 delay-300 transform",
                  showDetails
                    ? "translate-x-0 opacity-100"
                    : "translate-x-20 opacity-0"
                )}
                data-scroll-ignore
              >
                <ScrollArea className="flex-1 pr-4" ref={contentRef}>
                  <PostHeader post={post} />
                  <PostComments
                    post={{ ...post, comments }}
                    commentsByPost={{ [post.postId]: comments }}
                    contentRefs={{
                      current: { [post.postId]: contentRef.current },
                    }}
                    commentsRefs={{
                      current: { [post.postId]: commentsRef.current },
                    }}
                    showCommentsHint={showCommentsHint}
                    scrollToComments={scrollToComments}
                    newComment={newComment}
                    activePostId={activePostId}
                    setActivePostId={setActivePostId}
                    setNewComment={setNewComment}
                    handleAddComment={() => handleAddComment()}
                    addEmoji={addEmoji}
                  />
                </ScrollArea>
                <PostActions
                  post={post}
                  commentsByPost={{ [post.postId]: comments }}
                  scrollToComments={scrollToComments}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostPage;
