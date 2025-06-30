import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/common/hooks/use-toast";
import HashtagSearch from "@/pages/client/upload/item/hashtag-search";
import MediaUpload from "./item/media-upload";
import FormCreatePost from "./item/form-create-post";
import { useState } from "react";
import { PostCreateForm } from "./type";
import Slide from "@/components/slide/slide";
import VideoThumbnailSelector from "./item/video-thumbnail-selector-dialog";
import { SoundSelector } from "./item/sound-selector";
import axiosInstance from "@/services/axios/axios-instance";

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

  const [errorMessages, setErrorMessages] = useState<any>({});
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

    try {
      setIsSubmitting(true);
      const res = await axiosInstance.post("/post/create-new-post", postCreateForm);
      const { message } = res.data;

      toast({
        title: "Thành công",
        description: message || "Bài viết đang được xử lý.",
      });

      navigate("/client/home");
    } catch (error: any) {
      console.error("Tạo bài viết thất bại:", error);
      toast({
        variant: "destructive",
        title: "Tạo bài viết thất bại",
        description: error?.response?.data?.message || "Đã xảy ra lỗi không xác định.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-screen max-h-screen p-2">
      <div className="h-full rounded-3xl overflow-y-auto overflow-x-hidden scroll-but-hidden bg-white/50 dark:bg-zinc-800/70">
        <div className="bg-white dark:bg-zinc-800 rounded-3xl p-6 shadow-lg max-w-lg mx-auto">
          <h3 className="text-2xl sm:text-3xl font-semibold mb-6 mt-3 text-gray-900 dark:text-white">
            Create Post
          </h3>

          <MediaUpload
            postCreateForm={postCreateForm}
            setPostCreateForm={setPostCreateForm}
            setShowSlider={setShowSlider}
          />

          {postCreateForm.videoPublicId && (
            <div className="mb-6">
              <VideoThumbnailSelector
                postCreateForm={postCreateForm}
                setPostCreateForm={setPostCreateForm}
              />
            </div>
          )}

          {postCreateForm.imgPublicIdList &&
            postCreateForm.imgPublicIdList.length > 0 && (
              <div className="mb-6">
                <SoundSelector
                  postCreateForm={postCreateForm}
                  setPostCreateForm={setPostCreateForm}
                />
              </div>
            )}

          <FormCreatePost
            postCreateForm={postCreateForm}
            setPostCreateForm={setPostCreateForm}
            errorMessages={errorMessages}
          />

          <HashtagSearch
            postCreateForm={postCreateForm}
            setPostCreateForm={setPostCreateForm}
            errorMessages={errorMessages}
          />

          <div className="my-12 w-full flex justify-start">
            <div>
              <div className="text-xs text-gray-400 my-4">
                <span>Click 'Create Post' when you're sure everything is set up</span>
              </div>
              <div className="space-x-3">
                <Button
                  size="lg"
                  className="rounded-full bg-zinc-950 hover:bg-zinc-800"
                  onClick={handleCreatePost}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Đang tạo..." : "Create Post"}
                </Button>
                <Button
                  type="button"
                  size="lg"
                  className="rounded-full border-2 bg-zinc-50 text-black hover:bg-zinc-100"
                  onClick={() => navigate("/client/home")}
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
