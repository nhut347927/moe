import { RefObject } from "react";
import PostMultiImg from "./image";
import PostVideo from "./video";
import { Post } from "../../types";

interface PostContentProps {
  post: Post;
  isPlaying: boolean;
  index: number;
  mediaRefs: RefObject<(HTMLDivElement | null)[]>;
}

const PostContent = ({
  post,
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
