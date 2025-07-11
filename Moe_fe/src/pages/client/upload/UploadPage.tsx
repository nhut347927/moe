"use client";

import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/common/hooks/use-toast";
import HashtagSearch from "@/pages/client/upload/item/HashtagSearch";
import MediaUpload from "./item/MediaUpload";
import FormCreatePost from "./item/FormCreatePost";
import { useState } from "react";
import Slide from "@/components/slide/Slide";
import { SoundSelector } from "./item/SoundSelector";
import axiosInstance from "@/services/axios/AxiosInstance";
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
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Tiêu đề không được để trống.",
      });
      return;
    }

    if (postCreateForm.postType === "VID") {
      if (!postCreateForm.videoPublicId) {
        toast({
          variant: "destructive",
          title: "Lỗi",
          description: "Bạn chưa tải lên video.",
        });
        return;
      }

      if (postCreateForm.isUseOtherAudio) {
        if (!postCreateForm.audioCode || !postCreateForm.ffmpegMergeParams) {
          toast({
            variant: "destructive",
            title: "Lỗi",
            description:
              "Bạn cần chọn âm thanh và thiết lập cắt ghép khi sử dụng nhạc từ bài khác.",
          });
          return;
        }
      }
    }

    if (postCreateForm.postType === "IMG") {
      if (!postCreateForm.audioCode) {
        toast({
          variant: "destructive",
          title: "Lỗi",
          description: "Ảnh cần có nhạc kèm theo.",
        });
        return;
      }

      if (
        !postCreateForm.imgPublicIdList ||
        postCreateForm.imgPublicIdList.length === 0
      ) {
        toast({
          variant: "destructive",
          title: "Lỗi",
          description: "Bạn cần tải lên ít nhất một ảnh.",
        });
        return;
      }
    }

    if ((postCreateForm.tagCodeList?.length ?? 0) <= 0) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Bạn cần thêm ít nhất một tag.",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      // Không cần await, cứ gửi request rồi chuyển luôn
      axiosInstance.post("/posts", postCreateForm);

      toast({
        title: "Thành công",
        description: "Bài viết đang được xử lý.",
      });

      navigate("/client/home");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Tạo bài viết thất bại",
        description:
          error?.response?.data?.message || "Đã xảy ra lỗi không xác định.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-screen max-h-screen p-2 bg-gray-100 dark:bg-black">
      <div className="h-full rounded-3xl overflow-y-auto overflow-x-hidden scroll-but-hidden ">
        <div className=" p-6 max-w-lg mx-auto">
          <h3 className="text-2xl sm:text-3xl font-semibold mb-6 mt-3 text-gray-900 dark:text-gray-100">
            Create Post
          </h3>

          <div className="mb-6">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
              Media
            </label>
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
              <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                Sound
              </label>
              <SoundSelector
                postCreateForm={postCreateForm}
                setPostCreateForm={setPostCreateForm}
              />
            </div>
          )}

          <div className="mb-6">
            <FormCreatePost
              postCreateForm={postCreateForm}
              setPostCreateForm={setPostCreateForm}
              errorMessages={errorMessages}
            />
          </div>

          <div className="mb-6">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
              Hashtags
            </label>
            <HashtagSearch
              postCreateForm={postCreateForm}
              setPostCreateForm={setPostCreateForm}
              errorMessages={errorMessages}
            />
          </div>

          <div className="my-12 w-full flex justify-start">
            <div>
              <div className="text-xs text-gray-500 dark:text-zinc-400 my-4">
                <span>
                  Click 'Create Post' when you're sure everything is set up
                </span>
              </div>
              <div className="space-x-3">
                <Button
                  size="lg"
                  className="rounded-full bg-gray-800 dark:bg-gray-700 text-white dark:text-gray-100 hover:bg-gray-900 dark:hover:bg-gray-600 disabled:bg-gray-300 dark:disabled:bg-zinc-600 disabled:text-gray-500 dark:disabled:text-zinc-400"
                  onClick={handleCreatePost}
                  disabled={isSubmitting}
                  aria-label="Create post"
                >
                  {isSubmitting ? "Đang tạo..." : "Create Post"}
                </Button>
                <Button
                  type="button"
                  size="lg"
                  className="rounded-full bg-white dark:bg-zinc-800 border-2 border-gray-300 dark:border-zinc-600 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-zinc-700"
                  onClick={() => navigate("/client/home")}
                  aria-label="Cancel post creation"
                >
                  Cancel
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
