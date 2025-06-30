"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Music, Search, Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axiosInstance from "@/services/axios/axios-instance";
import { PostCreateForm, PostSearch } from "../type";

interface PostSearchSelectorProps {
  postCreateForm: PostCreateForm | null;
  setPostCreateForm: (form: PostCreateForm) => void;
}

export function SoundSelector({
  postCreateForm,
  setPostCreateForm,
}: PostSearchSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sounds, setPostSearchs] = useState<PostSearch[]>([]);
  const [selectedPostSearch, setSelectedPostSearch] =
    useState<PostSearch | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (!searchQuery.trim()) {
        setPostSearchs([]);
        setHasMore(true);
        setPage(0);
        return;
      }

      setIsLoading(true);
      try {
        const response = await axiosInstance.post("/post/search", {
          keyWord: searchQuery,
          page,
          size: 10,
        });

        const newPostSearchs: PostSearch[] = (response.data.data || []).map(
          (item: PostSearch) => ({
            ...item,
          })
        );

        setPostSearchs((prev) =>
          page === 1 ? newPostSearchs : [...prev, ...newPostSearchs]
        );
        setHasMore(newPostSearchs.length === 10);
      } catch (error) {
        console.error("Error fetching sounds:", error);
      } finally {
        setIsLoading(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery, page]);

  useEffect(() => {
    if (selectedPostSearch && audioRef.current) {
      setIsPlaying(false);
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [selectedPostSearch]);

  const togglePlay = useCallback(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch((error) => {
          console.error("Audio play error:", error);
        });
      }
      setIsPlaying(!isPlaying);
    }
  }, [isPlaying]);

  const handleSelectPostSearch = useCallback(
    (sound: PostSearch) => {
      setSelectedPostSearch(sound);
      if (postCreateForm) {
        setPostCreateForm({
          ...postCreateForm,
          audioCode: sound.audioCode || sound.postCode,
        });
      }
    },
    [postCreateForm, setPostCreateForm]
  );

  const loadMore = useCallback(() => {
    if (hasMore && !isLoading) {
      setPage((prev) => prev + 1);
    }
  }, [hasMore, isLoading]);

  return (
    <div className="bg-white dark:bg-zinc-800 rounded-3xl">
      <h3 className="font-semibold mb-4 flex items-center gap-2">
        <Music className="w-5 h-5" /> Chọn nhạc nền
      </h3>

      {/* Preview */}
      {selectedPostSearch ? (
        <div className="space-y-4 pb-8">
          <div className="aspect-video bg-black rounded-xl overflow-hidden">
            <img
              src={
                selectedPostSearch.postType === "VID"
                  ? `https://res.cloudinary.com/dwv76nhoy/video/upload/w_300,so_${
                      selectedPostSearch.videoThumbnail ?? "0"
                    }/${selectedPostSearch.mediaUrl}.jpg`
                  : `https://res.cloudinary.com/dwv76nhoy/image/upload/w_300/${selectedPostSearch.mediaUrl}`
              }
              className="w-full h-full object-cover"
              alt={`Thumbnail for ${selectedPostSearch.title}`}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">{selectedPostSearch.title}</h4>
              <p className="text-sm text-gray-500">
                {selectedPostSearch.displayName}
              </p>
            </div>
            <Button
              onClick={togglePlay}
              size="icon"
              variant="outline"
              aria-label={isPlaying ? "Pause sound" : "Play sound"}
            >
              {isPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </Button>
          </div>

          <audio
            ref={audioRef}
            src={`https://res.cloudinary.com/dwv76nhoy/video/upload/${selectedPostSearch.audioPublicId}.mp3`}
            preload="none"
          />
        </div>
      ) : (
        <div className="text-center text-gray-500 py-8">
          No music selected. Please search and select a track.
        </div>
      )}

      {/* Search */}
      <div className="relative mb-4 rounded-xl">
        <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Tìm kiếm nhạc..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setPage(0);
            setPostSearchs([]);
          }}
          className="pl-10"
        />
      </div>

      {/* Sound list */}
      <div className="grid gap-3 max-h-64 overflow-y-auto">
        {sounds.map((sound) => (
          <div
            key={sound.postCode}
            className="flex items-center p-3 border rounded-xl hover:bg-gray-100 dark:hover:bg-zinc-700"
          >
            {sound.postType === "VID" ? (
              <img
                src={`https://res.cloudinary.com/dwv76nhoy/video/upload/w_300,so_${
                  sound.videoThumbnail ?? "0"
                }/${sound.mediaUrl}.jpg`}
                className="w-16 h-16  object-cover cursor-pointer"
                alt="post"
              />
            ) : (
              <img
                src={`https://res.cloudinary.com/dwv76nhoy/image/upload/${sound.mediaUrl}`}
                className="w-16 h-16  object-cover cursor-pointer"
                alt="post"
              />
            )}

            <div className="ml-4 flex-1">
              <div className="font-medium">{sound.title}</div>
              <div className="text-sm text-gray-500">{sound.displayName}</div>
            </div>
            <Button
              size="sm"
              variant={
                selectedPostSearch?.postCode === sound.postCode
                  ? "default"
                  : "outline"
              }
              onClick={() => handleSelectPostSearch(sound)}
            >
              {selectedPostSearch?.postCode === sound.postCode
                ? "Đã chọn"
                : "Chọn"}
            </Button>
          </div>
        ))}
      </div>

      {/* Load more */}
      {hasMore && sounds.length > 0 && (
        <div className="mt-4 text-center">
          <Button variant="outline" onClick={loadMore} disabled={isLoading}>
            {isLoading ? "Đang tải..." : "Xem thêm"}
          </Button>
        </div>
      )}
    </div>
  );
}
