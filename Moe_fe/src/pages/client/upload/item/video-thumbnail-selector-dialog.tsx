"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/common/hooks/use-toast";
import { PostCreateForm } from "../type";

interface VideoThumbnailSelectorProps {
  postCreateForm: PostCreateForm | null;
  setPostCreateForm: (form: PostCreateForm) => void;
}

export default function VideoThumbnailSelector({
  postCreateForm,
  setPostCreateForm,
}: VideoThumbnailSelectorProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [selectedSeconds, setSelectedSeconds] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const { toast } = useToast();

  const videoPublicId = postCreateForm?.videoPublicId || "";
  const videoUrl = videoPublicId
    ? `abc/video/upload/${videoPublicId}.mp4`
    : "";

  const getThumbnailUrl = useCallback(
    (seconds: number) =>
      videoPublicId
        ? `abc/video/upload/so_${Math.floor(
            seconds
          )}/${videoPublicId}.jpg`
        : "https://via.placeholder.com/640x360?text=No+Video",
    [videoPublicId]
  );

  // Format time for display
  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }, []);

  // Handle slider change
  const handleSliderChange = useCallback(
    (value: number[]) => {
      const newTime = value[0];
      setSelectedSeconds(newTime);
      if (
        videoRef.current &&
        videoRef.current.readyState >= 2 &&
        !isLoading &&
        duration > 0
      ) {
        videoRef.current.currentTime = newTime;
      }
    },
    [isLoading, duration]
  );

  // Initialize video and handle metadata
  useEffect(() => {
    if (!isOpen || !videoUrl || !postCreateForm) {
      setIsLoading(false);
      setDuration(0);
      setCurrentTime(0);
      setIsInitialized(false);
      return;
    }

    let cleanup = () => {};
    let timeoutId: NodeJS.Timeout;

    const initializeVideo = async () => {
      if (!videoRef.current) {
        const timer = setTimeout(initializeVideo, 100);
        cleanup = () => clearTimeout(timer);
        return;
      }

      const video = videoRef.current;
      setIsLoading(true);

      // Timeout for metadata loading
      timeoutId = setTimeout(() => {
        setIsLoading(false);
        toast({
          variant: "destructive",
          description: "Không thể tải thông tin video trong thời gian cho phép.",
        });
      }, 10000); // 10-second timeout

      // Validate video URL
      try {
        const response = await fetch(videoUrl, {
          method: "HEAD",
          signal: AbortSignal.timeout(5000),
        });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
      } catch (error) {
        console.error("Error validating video URL:", error);
        setIsLoading(false);
        clearTimeout(timeoutId);
        toast({
          variant: "destructive",
          description: "Không thể truy cập video. Vui lòng kiểm tra URL.",
        });
        return;
      }

      const handleMetadata = () => {
        const d = video.duration;
        if (d && isFinite(d) && d > 0) {
          setDuration(d);
          if (!isInitialized) {
            const initialTime = postCreateForm?.videoThumbnail ?? Math.min(5, Math.floor(d / 2));
            setSelectedSeconds(initialTime);
            video.currentTime = initialTime;
            setCurrentTime(initialTime);
            setIsInitialized(true);
          }
          setIsLoading(false);
          clearTimeout(timeoutId);
        } else {
          setIsLoading(false);
          clearTimeout(timeoutId);
          toast({
            variant: "destructive",
            description: "Không thể lấy thông tin thời lượng video.",
          });
        }
      };

      const handleError = () => {
        setIsLoading(false);
        clearTimeout(timeoutId);
        toast({
          variant: "destructive",
          description: "Lỗi tải video. Vui lòng thử lại.",
        });
      };

      const handleTimeUpdate = () => {
        setCurrentTime(video.currentTime);
      };

      video.addEventListener("loadedmetadata", handleMetadata);
      video.addEventListener("loadeddata", handleMetadata);
      video.addEventListener("canplay", handleMetadata);
      video.addEventListener("error", handleError);
      video.addEventListener("timeupdate", handleTimeUpdate);

      // Force load metadata
      if (video.readyState >= 2) {
        handleMetadata();
      } else {
        video.load();
      }

      cleanup = () => {
        clearTimeout(timeoutId);
        video.removeEventListener("loadedmetadata", handleMetadata);
        video.removeEventListener("loadeddata", handleMetadata);
        video.removeEventListener("canplay", handleMetadata);
        video.removeEventListener("error", handleError);
        video.removeEventListener("timeupdate", handleTimeUpdate);
      };
    };

    initializeVideo();

    return () => {
      cleanup();
    };
  }, [isOpen, videoUrl, postCreateForm, toast, formatTime, isInitialized]);

  // Handle confirm button
  const handleConfirm = () => {
    if (!postCreateForm) {
      toast({
        variant: "destructive",
        description: "Dữ liệu biểu mẫu không có sẵn.",
      });
      return;
    }
    setPostCreateForm({
      ...postCreateForm,
      videoThumbnail: selectedSeconds,
    });
    setIsOpen(false);
    toast({
      description: `Đã chọn ảnh bìa tại ${formatTime(selectedSeconds)}`,
    });
  };

  return (
  <Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogTrigger asChild>
    <Button
      className="w-full bg-gray-800 dark:bg-gray-700 text-white dark:text-gray-100 hover:bg-gray-900 dark:hover:bg-gray-600 disabled:bg-gray-300 dark:disabled:bg-zinc-600 disabled:text-gray-500 dark:disabled:text-zinc-400"
      disabled={!videoUrl || !postCreateForm}
      aria-label="Chọn ảnh thumbnail cho video"
    >
      Chọn ảnh thumbnail
    </Button>
  </DialogTrigger>

  <DialogContent className="max-w-4xl w-full bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-700">
    <DialogHeader>
      <DialogTitle className="text-gray-900 dark:text-gray-100">Chọn ảnh bìa từ video</DialogTitle>
    </DialogHeader>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Video Preview */}
      <div className="space-y-4">
        <div className="relative bg-black dark:bg-zinc-800 rounded-lg overflow-hidden border border-gray-300 dark:border-zinc-600">
          {isLoading && (
            <div
              className="absolute inset-0 flex items-center justify-center bg-black/50 dark:bg-zinc-900/50 z-10"
              aria-label="Đang tải video"
            >
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white dark:border-gray-100"></div>
            </div>
          )}
          <video
            key={videoUrl}
            ref={videoRef}
            src={videoUrl}
            className="w-full h-64 object-contain"
            preload="metadata"
            controls
            crossOrigin="anonymous"
            aria-label="Video preview for thumbnail selection"
          />
        </div>
        <div className="text-center text-sm text-gray-500 dark:text-zinc-400">
          Video - {formatTime(currentTime)} / {formatTime(duration)}
        </div>
      </div>

      {/* Thumbnail Preview */}
      <div className="space-y-4">
        <div className="relative bg-gray-100 dark:bg-zinc-800 rounded-lg overflow-hidden border border-gray-300 dark:border-zinc-600">
          <img
            src={getThumbnailUrl(selectedSeconds)}
            alt={`Ảnh bìa tại ${formatTime(selectedSeconds)}`}
            className="w-full h-64 object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://via.placeholder.com/640x360?text=Thumbnail+Error";
              toast({
                variant: "destructive",
                description: "Không thể tải ảnh bìa. Vui lòng thử lại.",
              });
            }}
          />
        </div>
        <div className="text-center text-sm text-gray-500 dark:text-zinc-400">
          Tại giây thứ {Math.floor(selectedSeconds)} ({formatTime(selectedSeconds)})
        </div>
      </div>
    </div>

    {/* Slider */}
    <div className="mt-6 space-y-2 px-2">
      <Slider
        value={[selectedSeconds]}
        onValueChange={handleSliderChange}
        max={duration > 0 ? duration : 0}
        min={0}
        step={duration < 1 ? 0.01 : 0.1}
        className="w-full [&>span]:bg-gray-300 dark:[&>span]:bg-zinc-600 [&>span>span]:bg-gray-800 dark:[&>span>span]:bg-gray-600"
        disabled={isLoading || duration <= 0}
        aria-label={`Chọn thời gian cho ảnh bìa, hiện tại: ${formatTime(selectedSeconds)}`}
      />
      <div className="flex justify-between text-sm text-gray-500 dark:text-zinc-400">
        <span>0:00</span>
        <span className="font-medium">
          {isLoading ? "Đang tải..." : `Đã chọn: ${formatTime(selectedSeconds)}`}
        </span>
        <span>{duration > 0 ? formatTime(duration) : "..."}</span>
      </div>
    </div>

    <DialogFooter className="mt-4">
      <DialogClose asChild>
        <Button
          variant="outline"
          className="bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-600 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-zinc-700"
        >
          Hủy
        </Button>
      </DialogClose>
      <Button
        onClick={handleConfirm}
        disabled={isLoading || duration <= 0 || !postCreateForm}
        className="bg-gray-800 dark:bg-gray-700 text-white dark:text-gray-100 hover:bg-gray-900 dark:hover:bg-gray-600 disabled:bg-gray-300 dark:disabled:bg-zinc-600 disabled:text-gray-500 dark:disabled:text-zinc-400"
      >
        Chọn ảnh bìa
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
  );
}