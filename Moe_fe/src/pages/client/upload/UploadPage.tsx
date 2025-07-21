"use client";

import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/common/hooks/use-toast";
import HashtagSearch from "@/pages/client/upload/item/HashtagSearch";
import MediaUpload from "./item/MediaUpload";
import FormCreatePost from "./item/FormCreatePost";
import { useState } from "react";
import Slide from "@/components/slide/slide-image";
import { SoundSelector } from "./item/SoundSelector";
import axiosInstance from "@/services/axios/axios-instance";
import { PostCreateForm } from "../types";

export default function UploadPage() {
  const { toast } = useToast();
  const navigate = useNavigate();

  const [postCreateForm, setPostCreateForm] = useState<PostCreateForm>({
    title: "",
    description: "",
    postType: "VID",
    isUseOtherAudio: false,
    visibility: "PUBLIC",
  });

  const [errorMessages] = useState<any>({});
  const [showSlider, setShowSlider] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreatePost = async () => {
    if (!postCreateForm.title.trim()) {
      errorMessages.tagCodeList = "";
      errorMessages.title = "Title is required.";
      return;
    }

    if (postCreateForm.title.trim().length > 70) {
      errorMessages.tagCodeList = "";
      errorMessages.title = "Title must be less than 70 characters.";
      return;
    }

    if ((postCreateForm.tagCodeList?.length ?? 0) <= 0) {
      errorMessages.title = "";
      errorMessages.tagCodeList = "Tag is required.";
      return;
    }

    if (postCreateForm.postType === "VID") {
      if (!postCreateForm.videoPublicId) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "You have not uploaded a video.",
        });
        return;
      }

      if (postCreateForm.isUseOtherAudio) {
        if (!postCreateForm.audioCode || !postCreateForm.ffmpegMergeParams) {
          toast({
            variant: "destructive",
            title: "Error",
            description:
              "You need to select audio and set up merging parameters when using music from another post.",
          });
          return;
        }
      }
    }

    if (postCreateForm.postType === "IMG") {
      if (!postCreateForm.audioCode) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Images must have accompanying music.",
        });
        return;
      }

      if (
        !postCreateForm.imgPublicIdList ||
        postCreateForm.imgPublicIdList.length === 0
      ) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "You need to upload at least one image.",
        });
        return;
      }
    }

    if ((postCreateForm.tagCodeList?.length ?? 0) <= 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "You need to add at least one tag.",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      // Không cần await, cứ gửi request rồi chuyển luôn
      axiosInstance.post("/posts", postCreateForm);

      toast({
        title: "Success",
        description: "Your post is being processed.",
      });

      navigate("/client/home");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Failed to create post",
        description:
          error?.response?.data?.message || "An unknown error occurred.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-screen max-h-screen  bg-gray-100 dark:bg-black mb-96">
      <div className="h-full rounded-3xl overflow-y-auto overflow-x-hidden scroll-but-hidden ">
        <div className=" p-6 max-w-3xl mx-auto">
          <h3 className="text-2xl sm:text-3xl font-semibold mb-6 mt-5 text-gray-900 dark:text-gray-100">
            Create Post
          </h3>

          <div className="mb-6">
            <MediaUpload
              postCreateForm={postCreateForm}
              setPostCreateForm={setPostCreateForm}
              setShowSlider={setShowSlider}
            />
          </div>

          {/* {postCreateForm.videoPublicId && (
            <div className="mb-6">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                Thumbnail
              </label>
              <VideoThumbnailSelector
                postCreateForm={postCreateForm}
                setPostCreateForm={setPostCreateForm}
              />
            </div>
          )} */}

          {postCreateForm.imgPublicIdList && (
            <div className="mb-6">
              <SoundSelector
                postCreateForm={postCreateForm}
                setPostCreateForm={setPostCreateForm}
              />
            </div>
          )}

          <div className="mb-12">
            <FormCreatePost
              postCreateForm={postCreateForm}
              setPostCreateForm={setPostCreateForm}
              errorMessages={errorMessages}
            />
          </div>

          <div className="mb-6">
            <HashtagSearch
              postCreateForm={postCreateForm}
              setPostCreateForm={setPostCreateForm}
              errorMessages={errorMessages}
            />
          </div>

          <div className="mt-12 mb-96 w-full flex justify-end">
            <div className="flex flex-wrap items-center gap-3 max-w-full justify-end">
              <div className="text-xs text-end text-gray-500 dark:text-zinc-400 my-4 w-full">
                <span>
                  Click 'Create Post' when you're sure everything is set up
                </span>
              </div>
              <div className="flex flex-wrap gap-3 justify-end w-full sm:w-auto">
                <Button
                  type="button"
                  size="lg"
                  className="rounded-full px-5 h-10 min-w-[100px]
                   bg-white dark:bg-zinc-800 
                   border-2 border-gray-300 dark:border-zinc-600 
                   text-gray-900 dark:text-gray-100 
                   hover:bg-gray-100 dark:hover:bg-zinc-700 
                   whitespace-nowrap"
                  onClick={() => navigate("/client/home")}
                  aria-label="Cancel post creation"
                >
                  Cancel
                </Button>
                <Button
                  size="lg"
                  className="rounded-full px-5 h-10 min-w-[120px] 
                   font-semibold 
                   bg-zinc-100 text-zinc-900 hover:bg-zinc-200 
                   dark:bg-zinc-200 dark:text-zinc-900 dark:hover:bg-zinc-300 
                   border border-zinc-300 dark:border-zinc-400 
                   shadow-sm hover:shadow-md transition-all 
                   whitespace-nowrap"
                  onClick={handleCreatePost}
                  disabled={isSubmitting}
                  aria-label="Create post"
                >
                  {isSubmitting ? "Creating..." : "Create Post"}
                </Button>
              </div>
            </div>
          </div>

          {postCreateForm.imgPublicIdList && (
            <Slide
              images={postCreateForm.imgPublicIdList}
              showSlider={showSlider}
              setShowSlider={setShowSlider}
            />
          )}
        </div>
      </div>
    </div>
  );
}
