import { RefObject } from "react";
import { Post } from "../../types";
import PostVideo from "./Video";
import PostMultiImg from "./Image";

interface PostContentProps {
  post: Post;
  updateImageSelect: (imageSelect: number) => void;
  isPlaying: boolean;
  index: number;
  mediaRefs: RefObject<(HTMLDivElement | null)[]>;
}

const PostContent = ({
  post,
  updateImageSelect,
  isPlaying,
  index,
  mediaRefs,
}: PostContentProps) => {
  return (
    // rounded-[50px]
    <div className="max-h-full h-full overflow-hidden relative">
      <div
        ref={(el) => mediaRefs.current && (mediaRefs.current[index] = el)}
        className="h-full"
      >
        {post.postType === "VID" ? (
          <PostVideo
            videoSrc={post.videoUrl}
            initialPlaying={isPlaying}
            thumbnail={post.thumbnail}
          />
        ) : (
          <PostMultiImg
          updateImageSelect={updateImageSelect}
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
