"use client";

import type React from "react";
import { useState, useRef } from "react";
import { Video, ImageIcon, X, Upload, Play, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PostCreateForm } from "../type";
import axiosInstance from "@/services/axios/axios-instance";
import { useToast } from "@/common/hooks/use-toast";

interface MediaUploadProp {
  postCreateForm: PostCreateForm | null;
  setPostCreateForm: (form: PostCreateForm) => void;
  setShowSlider: (value: boolean) => void;
}

export default function MediaUpload({ postCreateForm, setPostCreateForm, setShowSlider }: MediaUploadProp) {
  const [selectedType, setSelectedType] = useState<"video" | "images" | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [dragOver, setDragOver] = useState<"video" | "images" | null>(null);
  const [isUploading, setIsUploading] = useState<"video" | "images" | null>(null);

  const videoInputRef = useRef<HTMLInputElement>(null);
  const imagesInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const uploadMedia = async (file: File, mediaType: "image" | "video") => {
    if (!file) {
      throw new Error("No file provided for upload");
    }
    const formData = new FormData();
    formData.append("file", file);
    // Debug FormData content
    for (const [key, value] of formData.entries()) {
      console.log(`${key}: ${value instanceof File ? value.name : value}`);
    }
    try {
      const endpoint = mediaType === "image" ? "file/upload/image" : "file/upload/video";
      const response = await axiosInstance.post(endpoint, formData);
      return response.data.data; // publicId
    } catch (error: any) {
      console.error("Upload error:", error);
      throw new Error(error.response?.data?.message || `Failed to upload ${mediaType}`);
    }
  };

  const deleteMedia = (publicId: string) => {
    axiosInstance
      .post("file/delete", { code: publicId })
      .catch((error) => {
        console.error("Delete error for publicId:", publicId, error);
      });
  };

  const handleVideoSelect = async (files: FileList | null) => {
    if (files && files[0] && files[0].type.startsWith("video/")) {
      const file = files[0];
      try {
        setIsUploading("video");
        const publicId = await uploadMedia(file, "video");
        setPostCreateForm({
          ...postCreateForm!,
          videoPublicId: publicId,
          imgPublicIdList: undefined,
          postType: "VID",
        });
        setSelectedVideo(file);
        setSelectedType("video");
      } catch (err: any) {
        toast({ variant: "destructive", description: err.message });
      } finally {
        setIsUploading(null);
      }
    } else {
      toast({ variant: "destructive", description: "Please select a valid video file" });
    }
  };

  const handleImagesSelect = async (files: FileList | null) => {
    if (files) {
      const images = Array.from(files).filter(f => f.type.startsWith("image/")).slice(0, 20);
      if (images.length === 0) {
        toast({ variant: "destructive", description: "No valid images found" });
        return;
      }
      try {
        setIsUploading("images");
        const publicIds = await Promise.all(images.map(file => uploadMedia(file, "image")));
        setPostCreateForm({
          ...postCreateForm!,
          imgPublicIdList: publicIds,
          videoPublicId: undefined,
          postType: "IMG",
        });
        setSelectedImages(images);
        setSelectedType("images");
      } catch (err: any) {
        toast({ variant: "destructive", description: err.message });
      } finally {
        setIsUploading(null);
      }
    }
  };

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
      type === "video" ? handleVideoSelect(e.dataTransfer.files) : handleImagesSelect(e.dataTransfer.files);
    }
  };

  const reset = () => {
    // Trigger deletion without awaiting
    if (postCreateForm?.videoPublicId) {
      deleteMedia(postCreateForm.videoPublicId);
    }
    if (postCreateForm?.imgPublicIdList?.length) {
      postCreateForm.imgPublicIdList.forEach(publicId => deleteMedia(publicId));
    }

    // Reset state immediately
    setSelectedType(null);
    setSelectedVideo(null);
    setSelectedImages([]);
    if (videoInputRef.current) videoInputRef.current.value = "";
    if (imagesInputRef.current) imagesInputRef.current.value = "";
    setPostCreateForm({
      ...postCreateForm!,
      videoPublicId: undefined,
      imgPublicIdList: undefined,
      postType: "IMG",
    });
  };

  // === Display Video ===
  if (selectedType === "video" && postCreateForm?.videoPublicId) {
    return (
      <div className="mx-auto mb-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
              <Play className="w-4 h-4 text-white" />
            </div>
            <h2 className="font-semibold text-base">Video</h2>
          </div>
          <Button onClick={reset} variant="ghost" size="sm">
            <X className="w-4 h-4" />
          </Button>
        </div>
        <video
          controls
          className="w-full aspect-video bg-black rounded-xl border"
          src={`https://res.cloudinary.com/dwv76nhoy/video/upload/${postCreateForm.videoPublicId}`}
        />
      </div>
    );
  }

  // === Display Images ===
  if (selectedType === "images" && postCreateForm?.imgPublicIdList?.length) {
    return (
      <div className="max-w-4xl mx-auto mb-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
              <ImageIcon className="w-4 h-4 text-white" />
            </div>
            <h2 className="font-semibold text-base">Images ({postCreateForm.imgPublicIdList.length})</h2>
          </div>
          <Button onClick={reset} variant="ghost" size="sm">
            <X className="w-4 h-4" />
          </Button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {postCreateForm.imgPublicIdList.map((id, index) => (
            <div key={index} className="relative group border rounded-xl overflow-hidden">
              <img
                src={`https://res.cloudinary.com/dwv76nhoy/image/upload/${id}`}
                alt={`Image ${index + 1}`}
                className="w-full aspect-square object-cover"
                onClick={()=>setShowSlider(true)}
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
          <h2 className="text-sm font-bold text-black mb-1">Upload Media</h2>
          <p className="text-sm text-gray-500">Select video or images</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {/* Upload Video */}
          {isUploading !== "images" && (
            <div
              className={`relative p-4 rounded-3xl border-2 border-dashed cursor-pointer bg-white transition-all ${
                dragOver === "video" ? "border-black bg-gray-50" : "border-gray-300 hover:border-gray-400"
              } ${isUploading === "video" ? "opacity-50 pointer-events-none" : ""}`}
              onDragOver={(e) => handleDragOver(e, "video")}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, "video")}
              onClick={() => videoInputRef.current?.click()}
            >
              <div className="text-center">
                {isUploading === "video" ? (
                  <div className="flex flex-col items-center">
                    <Loader2 className="w-6 h-6 text-black animate-spin" />
                    <p className="text-xs text-gray-500 mt-2">Uploading video...</p>
                  </div>
                ) : (
                  <>
                    <div className="w-12 h-12 bg-gray-100 rounded-full mx-auto mb-3 flex justify-center items-center">
                      <Video className="w-6 h-6 text-black" />
                    </div>
                    <h3 className="font-semibold text-sm mb-1">Video</h3>
                    <p className="text-xs text-gray-500">1 video</p>
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
              className={`relative p-4 rounded-3xl border-2 border-dashed cursor-pointer bg-white transition-all ${
                dragOver === "images" ? "border-black bg-gray-50" : "border-gray-300 hover:border-gray-400"
              } ${isUploading === "images" ? "opacity-50 pointer-events-none" : ""}`}
              onDragOver={(e) => handleDragOver(e, "images")}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, "images")}
              onClick={() => imagesInputRef.current?.click()}
            >
              <div className="text-center">
                {isUploading === "images" ? (
                  <div className="flex flex-col items-center">
                    <Loader2 className="w-6 h-6 text-black animate-spin" />
                    <p className="text-xs text-gray-500 mt-2">Uploading images...</p>
                  </div>
                ) : (
                  <>
                    <div className="w-12 h-12 bg-gray-100 rounded-full mx-auto mb-3 flex justify-center items-center">
                      <ImageIcon className="w-6 h-6 text-black" />
                    </div>
                    <h3 className="font-semibold text-sm mb-1">Images</h3>
                    <p className="text-xs text-gray-500">Up to 20 images</p>
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
        <div className="flex items-center justify-center gap-2 text-xs text-gray-400 mt-4">
          <Upload className="w-3 h-3" />
          <span>Drag & drop or click</span>
        </div>
      </div>
    </div>
  );
}
