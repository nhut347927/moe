"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { useToast } from "@/common/hooks/use-toast";

interface SingleVideoSlideProps {
  video: string; // Single video path (e.g., Cloudinary public ID)
  showSlider: boolean;
  setShowSlider: (value: boolean) => void;
  autoPlay?: boolean; // Optional prop to control autoplay
}

export default function SlideVideo({
  video,
  showSlider,
  setShowSlider,
  autoPlay = true,
}: SingleVideoSlideProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  // Handle video playback when slider is shown
  useEffect(() => {
    if (showSlider && videoRef.current) {
      if (autoPlay) {
        videoRef.current.play().catch(() => {
          toast({
            variant: "destructive",
            description: "Failed to autoplay video",
          });
        });
      } else {
        videoRef.current.pause();
      }
    }
  }, [showSlider, autoPlay, toast]);

  if (!showSlider || !video) return null;

  return (
    <div
      className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
      role="dialog"
      aria-label="Video player"
    >
      {/* Close Button */}
      <button
        type="button"
        className="absolute top-4 right-4 text-white p-2 rounded-full hover:bg-zinc-700 transition-colors"
        onClick={() => setShowSlider(false)}
        aria-label="Close video player"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Video Player */}
      <div className="relative w-full max-w-5xl">
        <video
          ref={videoRef}
          src={`https://res.cloudinary.com/dazttnakn/video/upload/${video}`}
          className="max-h-[90vh] w-full object-contain mx-auto rounded-lg"
          controls
          autoPlay={autoPlay}
          onError={() => {
            toast({
              variant: "destructive",
              description: "Failed to load video",
            });
          }}
        />
      </div>
    </div>
  );
}