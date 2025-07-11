"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { Video, ImageIcon, X, Upload, Play, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/services/axios/AxiosInstance";
import { useToast } from "@/common/hooks/use-toast";
import { PostCreateForm } from "../../types";
import Spinner from "@/components/common/Spiner";

interface MediaUploadProp {
  postCreateForm: PostCreateForm | null;
  setPostCreateForm: React.Dispatch<React.SetStateAction<PostCreateForm>>;
  setShowSlider: (value: boolean) => void;
}

export default function MediaUpload({
  postCreateForm,
  setPostCreateForm,
  setShowSlider,
}: MediaUploadProp) {
  const [selectedType, setSelectedType] = useState<"video" | "images" | null>(
    null
  );
  const [dragOver, setDragOver] = useState<"video" | "images" | null>(null);
  const [isUploading, setIsUploading] = useState<"video" | "images" | null>(
    null
  );
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [duration, setDuration] = useState(0);
  const [selectedTime, setSelectedTime] = useState(0);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);

  const videoInputRef = useRef<HTMLInputElement>(null);
  const imagesInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hiddenVideoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  // Upload media to the server
  const uploadMedia = async (file: File, mediaType: "image" | "video") => {
    if (!file) {
      throw new Error("No file provided for upload");
    }
    if (file.size > 100 * 1024 * 1024) {
      throw new Error("File is too large. Maximum size allowed is 100MB.");
    }
    if (mediaType === "video" && !file.type.startsWith("video/")) {
      throw new Error("File must be a video (e.g., MP4, AVI).");
    }
    if (mediaType === "image" && !file.type.startsWith("image/")) {
      throw new Error("File must be an image (e.g., PNG, JPEG).");
    }

    const formData = new FormData();
    formData.append("file", file);
    try {
      const endpoint = mediaType === "image" ? "files/images" : "files/videos";
      const response = await axiosInstance.post(endpoint, formData);
      return response.data.publicId || response.data.data;
    } catch (error: any) {
      console.error("Upload error:", error);
      throw new Error(
        error.response?.data?.message || `Failed to upload ${mediaType}`
      );
    }
  };

  // Delete media from the server
  const deleteMedia = (publicId: string) => {
    axiosInstance.post("files/delete", { code: publicId }).catch((error) => {
      console.error("Delete error for publicId:", publicId, error);
    });
  };

  // Handle video file selection and upload
  const handleVideoSelect = async (files: FileList | null) => {
    if (!files || !files[0]) {
      toast({
        variant: "destructive",
        description: "Please select a valid video file",
      });
      return;
    }

    const file = files[0];
    if (!file.type.startsWith("video/")) {
      toast({
        variant: "destructive",
        description: "File must be a video (e.g., MP4, AVI).",
      });
      return;
    }

    try {
      setIsUploading("video");
      setVideoFile(file); // Set videoFile immediately to trigger UI rendering
      setSelectedType("video"); // Set selectedType to ensure video UI renders
      const publicId = await uploadMedia(file, "video");
      setPostCreateForm((prev: PostCreateForm) => ({
        ...prev,
        videoPublicId: publicId,
        imgPublicIdList: undefined,
        postType: "VID",
      }));
      toast({ description: "Video uploaded successfully!" });
    } catch (err: any) {
      toast({ variant: "destructive", description: err.message });
      setVideoFile(null);
      setSelectedType(null);
    } finally {
      setIsUploading(null);
    }
  };

  // Handle image file selection and upload
  const handleImagesSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) {
      toast({ variant: "destructive", description: "No valid images found" });
      return;
    }

    const images = Array.from(files)
      .filter((f) => f.type.startsWith("image/"))
      .slice(0, 20);
    if (images.length === 0) {
      toast({ variant: "destructive", description: "No valid images found" });
      return;
    }

    try {
      setIsUploading("images");
      const publicIds = await Promise.all(
        images.map((file) => uploadMedia(file, "image"))
      );
      setPostCreateForm((prev) => ({
        ...prev,
        imgPublicIdList: publicIds,
        videoPublicId: undefined,
        postType: "IMG",
      }));
      setSelectedType("images");
      toast({ description: "Images uploaded successfully!" });
    } catch (err: any) {
      toast({ variant: "destructive", description: err.message });
    } finally {
      setIsUploading(null);
    }
  };

  // Drag-and-drop handlers
  const handleDragOver = (e: React.DragEvent, type: "video" | "images") => {
    e.preventDefault();
    if (!isUploading) {
      setDragOver(type);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(null);
  };

  const handleDrop = (e: React.DragEvent, type: "video" | "images") => {
    e.preventDefault();
    if (!isUploading) {
      setDragOver(null);
      type === "video"
        ? handleVideoSelect(e.dataTransfer.files)
        : handleImagesSelect(e.dataTransfer.files);
    }
  };

  // Reset all media and states
  const reset = () => {
    if (postCreateForm?.videoPublicId) {
      deleteMedia(postCreateForm.videoPublicId);
    }
    if (postCreateForm?.imgPublicIdList?.length) {
      postCreateForm.imgPublicIdList.forEach((publicId) =>
        deleteMedia(publicId)
      );
    }
    setSelectedType(null);
    setVideoFile(null);
    setThumbnailUrl(null);
    setSelectedTime(0);
    setDuration(0);
    if (videoInputRef.current) videoInputRef.current.value = "";
    if (imagesInputRef.current) imagesInputRef.current.value = "";
    setPostCreateForm({
      ...postCreateForm!,
      videoPublicId: undefined,
      imgPublicIdList: undefined,
      postType: "IMG",
    });
  };

  // Handle video metadata loading
  useEffect(() => {
    if (!videoFile || !hiddenVideoRef.current || !videoRef.current) return;

    const hiddenVideo = hiddenVideoRef.current;
    const visibleVideo = videoRef.current;

    const hiddenSrc = URL.createObjectURL(videoFile);
    const visibleSrc = URL.createObjectURL(videoFile);

    hiddenVideo.src = hiddenSrc;
    visibleVideo.src = visibleSrc;

    const onMetadata = () => {
      if (hiddenVideo.duration && isFinite(hiddenVideo.duration)) {
        setDuration(hiddenVideo.duration);
        const middle = Math.floor(hiddenVideo.duration / 2);
        setSelectedTime(middle);
      } else {
        toast({
          variant: "destructive",
          description: "Unable to load video metadata",
        });
        setVideoFile(null);
        setSelectedType(null);
      }
    };

    hiddenVideo.addEventListener("loadedmetadata", onMetadata);

    return () => {
      hiddenVideo.removeEventListener("loadedmetadata", onMetadata);
      URL.revokeObjectURL(hiddenSrc);
      URL.revokeObjectURL(visibleSrc);
    };
  }, [videoFile, toast]);

  // Generate thumbnail when selectedTime changes
  useEffect(() => {
    const video = hiddenVideoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || !videoFile || duration === 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      console.error("Canvas context not available");
      return;
    }

    const generate = async () => {
      await new Promise<void>((resolve, reject) => {
        const onSeeked = () => {
          try {
            canvas.width = video.videoWidth || 640;
            canvas.height = video.videoHeight || 360;
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            setThumbnailUrl(canvas.toDataURL("image/jpeg"));
            cleanup();
            resolve();
          } catch (err) {
            console.error("Thumbnail error:", err);
            toast({
              variant: "destructive",
              description: "Failed to generate thumbnail",
            });
            cleanup();
            reject();
          }
        };

        const onError = () => {
          console.error("Seek error");
          toast({
            variant: "destructive",
            description: "Error seeking video for thumbnail",
          });
          cleanup();
          reject();
        };

        const cleanup = () => {
          video.removeEventListener("seeked", onSeeked);
          video.removeEventListener("error", onError);
        };

        video.addEventListener("seeked", onSeeked);
        video.addEventListener("error", onError);
        video.currentTime = selectedTime;
      });
    };

    generate();
  }, [selectedTime, videoFile, duration, toast]);

  // Update postCreateForm with selected thumbnail time
  useEffect(() => {
    if (postCreateForm && selectedTime) {
      setPostCreateForm((prev: PostCreateForm) => ({
        ...prev,
        videoThumbnail: selectedTime,
      }));
    }
  }, [selectedTime, setPostCreateForm, postCreateForm]);

  // === Display Video ===
  if (videoFile && selectedType === "video") {
    return (
      <div className="mx-auto mb-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gray-900 dark:bg-zinc-800 rounded-full flex items-center justify-center">
              <Play className="w-4 h-4 text-white dark:text-gray-100" />
            </div>
            <h2 className="font-semibold text-base text-gray-900 dark:text-gray-100">
              Video
            </h2>
          </div>
          {postCreateForm?.videoPublicId ? (
            <Button
              onClick={reset}
              variant="ghost"
              size="sm"
              className="text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-gray-100"
              aria-label="Remove video"
            >
              <X className="w-4 h-4" />
            </Button>
          ) : (
            <Spinner className="h-8 w-8" />
          )}
        </div>
        <div className="max-w-2xl mx-auto  space-y-6">
          <div className="space-y-4">
            {/* Visible video for user preview */}
            <video ref={videoRef} controls className="w-full rounded border" />

            {/* Hidden video for thumbnail generation */}
            <video
              ref={hiddenVideoRef}
              className="hidden"
              preload="metadata"
              muted
            />

            <canvas ref={canvasRef} className="hidden" />

            {duration > 0 && (
              <>
                <label className="block text-sm text-zinc-600 dark:text-zinc-300">
                  Drag to select thumbnail time:
                </label>
                <input
                  type="range"
                  min={0}
                  max={duration}
                  step={0.1}
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(Number(e.target.value))}
                  className="w-full"
                />
                <div className="text-sm text-zinc-600 dark:text-zinc-300">
                  At second: {selectedTime.toFixed(1)} / {duration.toFixed(1)}{" "}
                  seconds
                </div>
              </>
            )}

            {thumbnailUrl && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
                  Selected thumbnail:
                </p>
                <img
                  src={thumbnailUrl}
                  alt="Thumbnail"
                  className="w-full border rounded shadow"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // === Display Images ===
  if (selectedType === "images" && postCreateForm?.imgPublicIdList?.length) {
    return (
      <div className="max-w-4xl mx-auto mb-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gray-900 dark:bg-zinc-800 rounded-full flex items-center justify-center">
              <ImageIcon className="w-4 h-4 text-white dark:text-gray-100" />
            </div>
            <h2 className="font-semibold text-base text-gray-900 dark:text-gray-100">
              Images ({postCreateForm.imgPublicIdList.length})
            </h2>
          </div>
          <Button
            onClick={reset}
            variant="ghost"
            size="sm"
            className="text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-gray-100"
            aria-label="Remove images"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {postCreateForm.imgPublicIdList.map((id, index) => (
            <div
              key={index}
              className="relative group border rounded-xl overflow-hidden border-gray-300 dark:border-zinc-600"
            >
              <img
                src={`https://res.cloudinary.com/dwv76nhoy/image/upload/w_300,c_fill,q_auto/${id}`}
                alt={`Image ${index + 1}`}
                className="w-full aspect-square object-cover"
                onClick={() => setShowSlider(true)}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // === File Selection UI ===
  return (
    <div className="flex items-center justify-center">
      <div className="w-full mx-auto">
        <div className="mb-6">
          <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-1">
            Upload Media
          </h2>
          <p className="text-sm text-gray-500 dark:text-zinc-400">
            Select video or images
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {/* Upload Video */}
          {isUploading !== "images" && (
            <div
              className={`relative p-4 rounded-3xl border-2 border-dashed cursor-pointer transition-all ${
                dragOver === "video"
                  ? "border-gray-900 dark:border-gray-100 bg-gray-100 dark:bg-zinc-700"
                  : "border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 hover:border-gray-400 dark:hover:border-zinc-500"
              } ${
                isUploading === "video" ? "opacity-50 pointer-events-none" : ""
              }`}
              onDragOver={(e) => handleDragOver(e, "video")}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, "video")}
              onClick={() => videoInputRef.current?.click()}
              aria-label="Upload video"
            >
              <div className="text-center">
                {isUploading === "video" ? (
                  <div className="flex flex-col items-center">
                    <Loader2 className="w-6 h-6 text-gray-900 dark:text-gray-100 animate-spin" />
                    <p className="text-xs text-gray-500 dark:text-zinc-400 mt-2">
                      Uploading video...
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="w-12 h-12 bg-gray-100 dark:bg-zinc-700 rounded-full mx-auto mb-3 flex justify-center items-center">
                      <Video className="w-6 h-6 text-gray-900 dark:text-gray-100" />
                    </div>
                    <h3 className="font-semibold text-sm text-gray-900 dark:text-gray-100 mb-1">
                      Video
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-zinc-400">
                      1 video
                    </p>
                  </>
                )}
              </div>
              <input
                ref={videoInputRef}
                type="file"
                accept="video/*"
                className="hidden"
                onChange={(e) => handleVideoSelect(e.target.files)}
                disabled={isUploading === "video"}
              />
            </div>
          )}

          {/* Upload Images */}
          {isUploading !== "video" && (
            <div
              className={`relative p-4 rounded-3xl border-2 border-dashed cursor-pointer transition-all ${
                dragOver === "images"
                  ? "border-gray-900 dark:border-gray-100 bg-gray-100 dark:bg-zinc-700"
                  : "border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 hover:border-gray-400 dark:hover:border-zinc-500"
              } ${
                isUploading === "images" ? "opacity-50 pointer-events-none" : ""
              }`}
              onDragOver={(e) => handleDragOver(e, "images")}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, "images")}
              onClick={() => imagesInputRef.current?.click()}
              aria-label="Upload images"
            >
              <div className="text-center">
                {isUploading === "images" ? (
                  <div className="flex flex-col items-center">
                    <Loader2 className="w-6 h-6 text-gray-900 dark:text-gray-100 animate-spin" />
                    <p className="text-xs text-gray-500 dark:text-zinc-400 mt-2">
                      Uploading images...
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="w-12 h-12 bg-gray-100 dark:bg-zinc-700 rounded-full mx-auto mb-3 flex justify-center items-center">
                      <ImageIcon className="w-6 h-6 text-gray-900 dark:text-gray-100" />
                    </div>
                    <h3 className="font-semibold text-sm text-gray-900 dark:text-gray-100 mb-1">
                      Images
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-zinc-400">
                      Up to 20 images
                    </p>
                  </>
                )}
              </div>
              <input
                ref={imagesInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => handleImagesSelect(e.target.files)}
                disabled={isUploading === "images"}
              />
            </div>
          )}
        </div>
        <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-zinc-400 mt-4">
          <Upload className="w-3 h-3" />
          <span>Drag & drop or click</span>
        </div>
      </div>
    </div>
  );
}
