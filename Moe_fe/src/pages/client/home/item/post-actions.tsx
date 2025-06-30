import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Check } from "lucide-react";
import { Post, Comment } from "../types";
import { AddToPlaylistDialog } from "@/components/dialog/add-to-playlist-dialog";

interface PostActionsProps {
  post: Post;
  commentsByPost: Record<string, Comment[]>;
  scrollToComments: (postId: string) => void;
}

const PostActions = ({
  post,
  commentsByPost,
  scrollToComments,
}: PostActionsProps) => {
  return (
    <div className="border-t pt-4 mt-2 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-2 px-2"
          >
            <Heart className="h-7 w-7" />
            <span>{post.likeCount}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-2 px-2"
            onClick={() => scrollToComments(post.postId)}
          >
            <MessageCircle className="h-5 w-5" />
            <span>{commentsByPost[post.postId]?.length || 0}</span>
          </Button>
        </div>

        <AddToPlaylistDialog
          icon={
            <span className="flex items-center justify-center w-5 h-5 bg-green-400 text-white rounded-full">
              <Check size={12} className="text-black" />
            </span>
          }
          songName="playlist lấy ten chỗ song name này"
        />
      </div>
    </div>
  );
};

export default PostActions;
