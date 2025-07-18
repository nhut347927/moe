import {
  useState,
  useRef,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from "react";
import { Play } from "lucide-react";

export interface PostVideoProps {
  videoSrc: string;
  initialMuted?: boolean;
  initialPlaying?: boolean;
  thumbnail: string;
}

const PostVideo = forwardRef<HTMLDivElement, PostVideoProps>(
  ({ videoSrc, initialPlaying = false }, ref) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const progressBarRef = useRef<HTMLDivElement>(null);
    const [isPlaying, setIsPlaying] = useState(initialPlaying);
    const [progress, setProgress] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [showDetailedProgress, setShowDetailedProgress] = useState(false);
    const lastClickTime = useRef<number>(0);

    useImperativeHandle(ref, () => containerRef.current as HTMLDivElement);

    useEffect(() => {
      const video = videoRef.current;
      if (!video) return;

      if (initialPlaying) {
        video.play().catch((error) => console.error("Play error:", error));
      } else {
        video.pause();
      }
    }, [initialPlaying]);

    useEffect(() => {
      const video = videoRef.current;
      if (!video) return;

      const handlePlay = () => setIsPlaying(true);
      const handlePause = () => setIsPlaying(false);

      const updateProgress = () => {
        if (video.duration && !isNaN(video.duration)) {
          setProgress((video.currentTime / video.duration) * 100);
        }
      };

      video.addEventListener("play", handlePlay);
      video.addEventListener("pause", handlePause);
      video.addEventListener("timeupdate", updateProgress);

      return () => {
        video.removeEventListener("play", handlePlay);
        video.removeEventListener("pause", handlePause);
        video.removeEventListener("timeupdate", updateProgress);
      };
    }, []);

    const formatTime = (seconds: number): string => {
      if (!seconds || isNaN(seconds)) return "0:00";
      const minutes = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
    };

    const togglePlay = (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      const currentTime = Date.now();
      if (currentTime - lastClickTime.current < 300) return;
      lastClickTime.current = currentTime;

      const video = videoRef.current;
      if (!video) return;

      if (isPlaying) {
        video.pause();
      } else {
        video.play().catch((err) => console.error("Play error:", err));
      }
      setIsPlaying(!isPlaying);
    };

    const handleDoubleClick = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      // Removed toggle of showDetailedProgress on double-click
    };

    const handleProgressChange = (clientX: number) => {
      const progressBar = progressBarRef.current;
      const video = videoRef.current;
      if (!progressBar || !video || !video.duration) {
        //  console.error("Missing progressBar, video, or duration");
        return;
      }

      const rect = progressBar.getBoundingClientRect();
      const position = Math.min(
        Math.max((clientX - rect.left) / rect.width, 0),
        1
      );
      const newTime = position * video.duration;
      video.currentTime = newTime;
      setProgress(position * 100);
    };

    const handleMouseDown = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setShowDetailedProgress(true);
      setIsDragging(true);
      handleProgressChange(e.clientX);
    };

    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        handleProgressChange(e.clientX);
      }
    };

    useEffect(() => {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }, [isDragging]);
    useEffect(() => {
      let timeout: NodeJS.Timeout;

      if (!isDragging) {
        timeout = setTimeout(() => {
          setShowDetailedProgress(false);
        }, 2000);
      }

      return () => {
        clearTimeout(timeout);
      };
    }, [isDragging]);

    return (
      <div ref={containerRef} className="h-full flex items-center py-2 sm:p-2">
        <div
          className="h-full w-full relative flex justify-center items-center"
          onClick={togglePlay}
          onDoubleClick={handleDoubleClick}
        >
          <div className="z-20 max-h-full h-full flex items-center relative">
            <video
              ref={videoRef}
              src={`https://res.cloudinary.com/dwv76nhoy/video/upload/${videoSrc}`}
              className="z-10 max-h-full object-contain cursor-pointer moe-style rounded-3xl"
              autoPlay={isPlaying}
              loop
              playsInline
            />
            <div
              ref={progressBarRef}
              className={`absolute bottom-16 sm:bottom-0 w-full px-6 pt-6 z-30 transition-transform ${
                showDetailedProgress ? "translate-y-0" : ""
              }`}
              onMouseDown={handleMouseDown}
            >
              {showDetailedProgress && (
                <div className="w-full flex items-center justify-center gap-2 mb-2">
                  <strong className="text-sm text-white">
                    {formatTime(videoRef.current?.currentTime || 0)}
                  </strong>
                  /
                  <strong className="text-sm text-white">
                    {formatTime(videoRef.current?.duration || 0)}
                  </strong>
                </div>
              )}

              <div
                className={`w-full ${
                  showDetailedProgress ? "h-3" : "h-0.5"
                } rounded-full cursor-pointer transition-all duration-100
  bg-zinc-300 dark:bg-white/10 hover:bg-zinc-400 dark:hover:bg-white/30`}
                style={{ pointerEvents: "auto" }}
              >
                <div
                  className={`h-full rounded-full transition-all duration-75 
    ${
      showDetailedProgress
        ? "bg-zinc-50 dark:bg-white"
        : "bg-zinc-950/30 dark:bg-white/10"
    }`}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
          <div className="absolute z-20 inset-0 flex flex-col justify-between pointer-events-none">
            <div className="flex-1 flex items-center justify-center">
              {isPlaying ? null : (
                <Play size={48} className="text-white pointer-events-auto" />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
);

export default PostVideo;
