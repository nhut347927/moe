
"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { Music, Search, Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axiosInstance from "@/services/axios/axios-instance";
import { PostCreateForm, PostSearch } from "../type";
import { useToast } from "@/common/hooks/use-toast";

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
  const [selectedPostSearch, setSelectedPostSearch] = useState<PostSearch | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { toast } = useToast();

  const fetchSounds = useCallback(async () => {
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

      const newPostSearchs: PostSearch[] = (response.data.data || []).map((item: PostSearch) => ({
        ...item,
      }));

      setPostSearchs((prev) => (page === 0 ? newPostSearchs : [...prev, ...newPostSearchs]));
      setHasMore(newPostSearchs.length === 10);
    } catch (error: any) {
      console.error("Error fetching sounds:", error);
      toast({
        variant: "destructive",
        description: error.response?.data?.message || "Failed to fetch sounds",
      });
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, page]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchSounds();
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [fetchSounds]);

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
          toast({
            variant: "destructive",
            description: "Failed to play audio",
          });
        });
      }
      setIsPlaying(!isPlaying);
    }
  }, [isPlaying, toast]);

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
    <div>
      <h3 className="font-semibold text-base text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
        <Music className="w-5 h-5 text-gray-900 dark:text-gray-100" /> Chọn nhạc nền
      </h3>

      {/* Preview */}
      {selectedPostSearch ? (
        <div className="space-y-4 pb-8">
          <div className="aspect-video bg-black dark:bg-zinc-800 rounded-xl overflow-hidden border border-gray-300 dark:border-zinc-600">
            <img
              src={
                selectedPostSearch.postType === "VID"
                  ? `https://res.cloudinary.com/dwv76nhoy/video/upload/w_300,c_fill,q_auto,so_${
                      selectedPostSearch.videoThumbnail ?? "0"
                    }/${selectedPostSearch.mediaUrl}.jpg`
                  : `https://res.cloudinary.com/dwv76nhoy/image/upload/w_300,c_fill,q_auto/${selectedPostSearch.mediaUrl}`
              }
              className="w-full h-full object-cover"
              alt={`Thumbnail for ${selectedPostSearch.title}`}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-gray-100">{selectedPostSearch.title}</h4>
              <p className="text-sm text-gray-500 dark:text-zinc-400">{selectedPostSearch.displayName}</p>
            </div>
            <Button
              onClick={togglePlay}
              size="icon"
              variant="outline"
              className="bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-600 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-zinc-700"
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
            src={
              selectedPostSearch.audioPublicId
                ? `https://res.cloudinary.com/dwv76nhoy/video/upload/q_auto:low/${selectedPostSearch.audioPublicId}.mp3`
                : undefined
            }
            preload="none"
          />
        </div>
      ) : (
        <div className="text-center text-gray-500 dark:text-zinc-400 py-8">
          No music selected. Please search and select a track.
        </div>
      )}

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-zinc-400" />
        <Input
          placeholder="Tìm kiếm nhạc..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setPage(0);
            setPostSearchs([]);
          }}
          className="pl-10 bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-600 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
          aria-label="Search music"
        />
      </div>

      {/* Sound list */}
      <div className="grid gap-3 max-h-64 overflow-y-auto">
        {sounds.map((sound) => (
          <div
            key={sound.postCode}
            className="flex items-center p-3 border rounded-xl border-gray-200 dark:border-zinc-700 hover:bg-gray-100 dark:hover:bg-zinc-800"
          >
            {sound.postType === "VID" ? (
              <img
                src={`https://res.cloudinary.com/dwv76nhoy/video/upload/w_300,c_fill,q_auto,so_${
                  sound.videoThumbnail ?? "0"
                }/${sound.mediaUrl}.jpg`}
                className="w-16 h-16 object-cover rounded-md"
                alt={`Thumbnail for ${sound.title}`}
              />
            ) : (
              <img
                src={`https://res.cloudinary.com/dwv76nhoy/image/upload/w_300,c_fill,q_auto/${sound.mediaUrl}`}
                className="w-16 h-16 object-cover rounded-md"
                alt={`Thumbnail for ${sound.title}`}
              />
            )}
            <div className="ml-4 flex-1">
              <div className="font-medium text-gray-900 dark:text-gray-100">{sound.title}</div>
              <div className="text-sm text-gray-500 dark:text-zinc-400">{sound.displayName}</div>
            </div>
            <Button
              size="sm"
              variant={selectedPostSearch?.postCode === sound.postCode ? "default" : "outline"}
              onClick={() => handleSelectPostSearch(sound)}
              className={
                selectedPostSearch?.postCode === sound.postCode
                  ? "bg-blue-500 dark:bg-blue-600 text-white hover:bg-blue-600 dark:hover:bg-blue-700"
                  : "bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-600 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-zinc-700"
              }
              aria-label={selectedPostSearch?.postCode === sound.postCode ? "Selected sound" : "Select sound"}
            >
              {selectedPostSearch?.postCode === sound.postCode ? "Đã chọn" : "Chọn"}
            </Button>
          </div>
        ))}
      </div>

      {/* Load more */}
      {hasMore && sounds.length > 0 && (
        <div className="mt-4 text-center">
          <Button
            variant="outline"
            onClick={loadMore}
            disabled={isLoading}
            className="bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-600 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-zinc-700"
          >
            {isLoading ? "Đang tải..." : "Xem thêm"}
          </Button>
        </div>
      )}
    </div>
  );
}