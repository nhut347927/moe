import { RefObject } from "react";
import PostMultiImg from "./image";
import PostVideo from "./video";
import { Post } from "../types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn, getTimeAgo } from "@/common/utils/utils";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";

interface PostContentProps {
  post: Post;
  index: number;
  mediaRefs: RefObject<(HTMLDivElement | null)[]>;
  isPlaying: boolean;
  handleLikePost?: (postCode: string) => void;
}

const PostContent = ({
  post,
  index,
  mediaRefs,
  isPlaying,
  handleLikePost,
}: PostContentProps) => {
  return (
    <div className="max-h-full h-full rounded-[50px] overflow-hidden relative">
      <div className="absolute bottom-2 left-0 right-0 z-20 px-4 flex items-end justify-between pointer-events-none">
        {/* Left: User info + caption */}
        <div className="pointer-events-auto mb-2 max-w-[70%]">
          <div className="flex items-center gap-2 mb-1">
            <Avatar className="w-9 h-9">
              <AvatarImage
                src={`https://res.cloudinary.com/dwv76nhoy/image/upload/w_80,h_80/${post.userAvatar}`}
              />
              <AvatarFallback className="bg-zinc-400 text-white text-sm">
                CN
              </AvatarFallback>
            </Avatar>
            <Link to={`/client/profile?code=${post.userCode}`}>
              <span className="text-sm font-medium text-zinc-800 dark:text-zinc-100">
                {post.userDisplayName}
              </span>
            </Link>

            <p className="text-sm text-muted-foreground">
              • {getTimeAgo(post.createdAt)}
            </p>
          </div>
          <p className="text-sm text-zinc-700 dark:text-zinc-200 line-clamp-2">
            {post.title}
          </p>
        </div>

        {/* Right: Like button */}
        <div className="flex flex-col items-center gap-1 pointer-events-auto">
          <button
            onClick={() => handleLikePost?.(post.postCode)}
            className={cn(
              "p-3 rounded-full transition-all",
              post?.isLiked
                ? "bg-red-100 hover:bg-red-200"
                : "bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700"
            )}
          >
            <Heart
              className={cn(
                "w-6 h-6 transition-colors",
                post?.isLiked
                  ? "text-red-500 fill-red-500"
                  : "text-zinc-500 dark:text-zinc-300"
              )}
            />
          </button>
          <span className="text-sm text-zinc-700 dark:text-zinc-200 drop-shadow">
            {post.likeCount}
          </span>
        </div>
      </div>

      <div
        ref={(el) => mediaRefs.current && (mediaRefs.current[index] = el)}
        className="h-full"
      >
        {post.postType === "VID" ? (
          <PostVideo videoSrc={post.videoUrl} initialPlaying={isPlaying} />
        ) : (
          <PostMultiImg
            images={post.imageUrls}
            audioSrc={post.audioUrl}
            initialPlaying={isPlaying}
          />
        )}
      </div>
    </div>
  );
};

export default PostContent;
