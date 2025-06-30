import {
  useState,
  useRef,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from "react";
import { motion } from "framer-motion";
import { Play } from "lucide-react";

interface PostMultiImgProps {
  images: string[];
  audioSrc?: string;
  //initialMuted?: boolean;
  initialPlaying?: boolean;
}

const PostMultiImg = forwardRef<HTMLDivElement, PostMultiImgProps>(
  (
    { images, audioSrc = "",  initialPlaying = false },
    ref
  ) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(initialPlaying);
   // const [isMuted, setIsMuted] = useState(initialMuted);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useImperativeHandle(ref, () => containerRef.current as HTMLDivElement);

    const nextImage = () => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
      setCurrentImageIndex(
        (prev) => (prev - 1 + images.length) % images.length
      );
    };

    const toggleAudio = () => {
      if (audioRef.current) {
        if (isPlaying) {
          audioRef.current.pause();
        } else {
          audioRef.current.muted = false;
          audioRef.current.play().catch(console.error);
        }
        setIsPlaying((prev) => !prev);
      }
    };

    // useEffect(() => {
    //   if (audioRef.current) {
    //     audioRef.current.muted = isMuted;
    //   }
    // }, [isMuted]);

    useEffect(() => {
      if (audioRef.current) {
        if (initialPlaying) {
          audioRef.current.play().catch(console.error);
        } else {
          audioRef.current.pause();
        }
      }
    }, [initialPlaying]);

    useEffect(() => {
      if (audioRef.current) {
       // audioRef.current.muted = initialMuted;
        //setIsMuted(initialMuted);
        if (initialPlaying) {
          audioRef.current.play().catch(console.error);
          setIsPlaying(true);
        }
      }
    }, [initialPlaying]);

    if (images.length === 0) return <p>No images available</p>;

    return (
      <div ref={containerRef} className="mx-auto h-full flex items-center">
        <div className="w-full relative">
          <motion.div
            // onHoverStart={() => setIsHovered(true)}
            // onHoverEnd={() => setIsHovered(false)}
            className="relative max-h-screen h-full flex justify-center items-center overflow-hidden cursor-pointer"
            onClick={toggleAudio}
          >
            <motion.img
              key={currentImageIndex}
              src={`https://res.cloudinary.com/dwv76nhoy/image/upload/${images[currentImageIndex]}`}
              className="h-full moe-style object-contain rounded-[50px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            />

            {images.length > 1 && (
              <>
                <div
                  className="absolute top-0 left-0 transform w-2/6 h-full flex items-center justify-start"
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage();
                  }}
                >
                  {/* <ChevronLeft className="ms-4 h-4 w-4 font-bold text-zinc-800" /> */}
                </div>
                <div
                  className="absolute top-0 right-0 transform w-2/6  h-full flex items-center justify-end"
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                >
                  {/* <ChevronRight className="me-2 h-4 w-4 font-bold text-zinc-800" /> */}
                </div>
              </>
            )}

            {isPlaying ? (
              ""
            ) : (
              <div className="absolute top-0 left-0 right-0 p-3 text-white space-x-3">
                <button
                  onClick={toggleAudio}
                  className="p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-75"
                >
                  <Play size={20} />
                </button>
              </div>
            )}

            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`h-1.5 w-1.5 rounded-full ${
                      currentImageIndex === index
                        ? "bg-zinc-50 dark:bg-zinc-50"
                        : "bg-zinc-400 dark:bg-zinc-400"
                    }`}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </motion.div>

          <audio
            ref={audioRef}
            src={`https://res.cloudinary.com/dwv76nhoy/video/upload/${audioSrc}`}
            onEnded={() => {
              if (audioRef.current) {
                audioRef.current.currentTime = 0;
                audioRef.current.play().catch(console.error);
              }
            }}
          />
        </div>
      </div>
    );
  }
);

export default PostMultiImg;
