import {
  useState,
  useRef,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from "react";
import { Play} from "lucide-react";

export interface PostVideoProps {
  videoSrc: string;
  initialMuted?: boolean;
  initialPlaying?: boolean;
}

const PostVideo = forwardRef<HTMLDivElement, PostVideoProps>(
  ({ videoSrc, initialPlaying = false }, ref) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const progressBarRef = useRef<HTMLDivElement>(null);
    const [isPlaying, setIsPlaying] = useState(initialPlaying);
    //const [progress, setProgress] = useState(0);
 //   const [isMuted, setIsMuted] = useState(initialMuted);
    const [isDragging, setIsDragging] = useState(false);
//    const [currentTime, setCurrentTime] = useState(0);
 //   const [duration, setDuration] = useState(0);

    const containerRef = useRef<HTMLDivElement>(null);
    useImperativeHandle(ref, () => containerRef.current as HTMLDivElement);

    useEffect(() => {
      const video = videoRef.current;
      if (!video) return;

    //  video.muted = initialMuted;
    //  setIsMuted(initialMuted);

      if (initialPlaying) {
        video
          .play()
          .catch((error) => console.error("Error attempting to play:", error));
      } else {
        video.pause();
      }
    }, [initialPlaying]);

    useEffect(() => {
      const video = videoRef.current;
      if (!video) return;

      // const updateProgress = () => {
      //   if (video.duration && !isNaN(video.duration)) {
      //     setProgress((video.currentTime / video.duration) * 100);
      //     setCurrentTime(video.currentTime);
      //     setDuration(video.duration);
      //   }
      // };

      const handlePlay = () => setIsPlaying(true);
      const handlePause = () => setIsPlaying(false);

    //  video.addEventListener("timeupdate", updateProgress);
      video.addEventListener("play", handlePlay);
      video.addEventListener("pause", handlePause);

      return () => {
      //  video.removeEventListener("timeupdate", updateProgress);
        video.removeEventListener("play", handlePlay);
        video.removeEventListener("pause", handlePause);
      };
    }, []);

    const togglePlay = () => {
      const video = videoRef.current;
      if (!video) return;

      if (isPlaying) {
        video.pause();
      } else {
        video
          .play()
          .catch((error) => console.error("Error attempting to play:", error));
      }
      setIsPlaying(!isPlaying);
    };

    const handleProgressChange = (clientX: number) => {
      const progressBar = progressBarRef.current;
      const video = videoRef.current;
      if (!progressBar || !video || !video.duration) return;

      const rect = progressBar.getBoundingClientRect();
      const position = Math.min(
        Math.max((clientX - rect.left) / rect.width, 0),
        1
      );
      const newTime = position * video.duration;
      video.currentTime = newTime;
      //setProgress(position * 100);
    };
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        handleProgressChange(e.clientX);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    useEffect(() => {
      document.addEventListener("mouseup", handleMouseUp);
      document.addEventListener("mousemove", handleMouseMove as any);
      return () => {
        document.removeEventListener("mouseup", handleMouseUp);
        document.removeEventListener("mousemove", handleMouseMove as any);
      };
    }, [isDragging]);

    return (
      <div ref={containerRef} className="h-full flex items-center">
        <div
          className="w-full relative flex justify-center items-center"
          onClick={togglePlay}
        >
          <video
            ref={videoRef}
            src={`https://res.cloudinary.com/dwv76nhoy/video/upload/${videoSrc}`}
            className="h-full object-contain cursor-pointer moe-style rounded-[50px]"
            autoPlay={isPlaying}
           // muted={isMuted}
            loop
            playsInline
          />
          <div className="absolute inset-0 flex flex-col justify-between">
            <div className="flex-1 flex items-center justify-center">
              <button
                onClick={togglePlay}
                aria-label={isPlaying ? "Pause video" : "Play video"}
              >
                {isPlaying ? "" : <Play size={48} className="text-white" />}
              </button>
            </div>

            {/* <div className="px-8">
                <div className="flex items-center gap-2 px-3 rounded-lg">
                  <button onClick={toggleMute} className="text-white hover:text-gray-300">
                    {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                  </button>
                  <div
                    ref={progressBarRef}
                    className="flex-1 h-0.5 bg-gray-600 rounded-full cursor-pointer overflow-hidden"
                    onMouseDown={handleMouseDown}
                  >
                    <div className="h-full bg-zinc-400" style={{ width: `${progress}%` }} />
                  </div>
                  <span className="text-white text-xs w-24 text-right">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                </div>
              </div> */}
          </div>
        </div>
      </div>
    );
  }
);

PostVideo.displayName = "PostVideo";

export default PostVideo;
