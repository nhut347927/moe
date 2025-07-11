
"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Check } from "lucide-react";
import axiosInstance from "@/services/axios/AxiosInstance";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ActionMenuDialog from "@/components/dialog/ActionMenuDialog";
import { toast } from "@/common/hooks/use-toast";
import { DialogClose } from "@/components/ui/dialog";
import { PostCreateForm } from "../../types";

interface Tag {
  code: string;
  name: string;
  usageCount: string;
  username: string;
  avatar: string;
}

interface HashtagSearchProp {
  postCreateForm: PostCreateForm | null;
  setPostCreateForm: (form: PostCreateForm) => void;
  errorMessages?: {
    title?: string;
    description?: string;
  };
}

export default function HashtagSearch({
  postCreateForm,
  setPostCreateForm,
  errorMessages,
}: HashtagSearchProp) {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchResults, setSearchResults] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [newTagName, setNewTagName] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const searchTag = useCallback(async () => {
    if (!searchTerm) return [];
    try {
      const response = await axiosInstance.get("tags/search", {
        params: { keyWord: searchTerm },
      });
      return response.data.data ?? [];
    } catch (error: any) {
      toast({
        variant: "destructive",
        description: error.response?.data?.message || "Failed to search tag!",
      });
      return [];
    }
  }, [searchTerm]);

  const createTag = useCallback(async () => {
    if (!newTagName) {
      setErrorMessage("Tag name cannot be blank");
      return null;
    }
    try {
      const response = await axiosInstance.post("tags", {
        tag: newTagName.trim(),
      });
      return response.data.data;
    } catch (error: any) {
      toast({
        variant: "destructive",
        description: error.response?.data?.message || "Failed to create tag!",
      });
      return null;
    }
  }, [newTagName]);

  const searchTagByCode = useCallback(async () => {
    if (!postCreateForm?.tagCodeList?.length) return [];
    try {
      const response = await axiosInstance.get("tags/by-code", {
        params: { code: postCreateForm.tagCodeList.join(",") },
      });
      return response.data.data ?? [];
    } catch (error: any) {
      toast({
        variant: "destructive",
        description: error.response?.data?.message || "Failed to fetch tags!",
      });
      return [];
    }
  }, [postCreateForm?.tagCodeList]);

  useEffect(() => {
    if (!searchTerm) {
      setSearchResults([]);
      return;
    }
    const handler = setTimeout(async () => {
      const results = await searchTag();
      setSearchResults(results);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm, searchTag]);

  useEffect(() => {
    const fetchTags = async () => {
      if (postCreateForm?.tagCodeList?.length && selectedTags.length === 0) {
        const tags = await searchTagByCode();
        setSelectedTags(tags);
      }
    };
    fetchTags();
  }, [postCreateForm?.tagCodeList, searchTagByCode]);

  const selectHashtag = (tag: Tag) => {
    if (!postCreateForm) {
      toast({
        variant: "destructive",
        description: "Form data is not available.",
      });
      return;
    }
    if (postCreateForm.tagCodeList?.includes(tag.code)) return;
    setPostCreateForm({
      ...postCreateForm,
      tagCodeList: [...(postCreateForm.tagCodeList || []), tag.code],
    });
    setSelectedTags((prev) => [...prev, tag]);
  };

  const removeHashtag = (tag: Tag) => {
    if (!postCreateForm) {
      toast({
        variant: "destructive",
        description: "Form data is not available.",
      });
      return;
    }
    setPostCreateForm({
      ...postCreateForm,
      tagCodeList: (postCreateForm.tagCodeList || []).filter(
        (code) => code !== tag.code
      ),
    });
    setSelectedTags((prev) => prev.filter((t) => t.code !== tag.code));
  };

  const handleCreateTag = async () => {
    const newTag = await createTag();
    if (newTag && postCreateForm) {
      setPostCreateForm({
        ...postCreateForm,
        tagCodeList: [...(postCreateForm.tagCodeList || []), newTag.code],
      });
      setSelectedTags((prev) => [...prev, newTag]);
      setNewTagName("");
      setErrorMessage("");
    }
  };

  return (
    <div className="w-full space-y-3">
      <h2 className="text-sm font-medium text-gray-900 dark:text-gray-100">
        Hashtag Search
      </h2>

      <div className="relative">
        <div className="flex gap-2">
          <div className="relative w-full">
            <Input
              type="text"
              placeholder="Search hashtags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-10 bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-zinc-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              aria-label="Search hashtags"
            />
            {searchTerm && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSearchResults([]);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-zinc-400 hover:text-gray-700 dark:hover:text-zinc-200 transition-colors"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <ActionMenuDialog
            title="Create New Tag"
            trigger={
              <Button
                variant="outline"
                className="bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-600 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-zinc-700"
                aria-label="Create new tag"
              >
                <Plus className="w-4 h-4" />
              </Button>
            }
            className="rounded-xl bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-700"
          >
            <p className="text-sm text-gray-500 dark:text-zinc-400 mb-4">
              Enter the name for the new hashtag.
            </p>
            <Input
              type="text"
              placeholder="New tag name"
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              className="mb-4 bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-zinc-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              aria-label="New tag name"
            />
            {errorMessage && (
              <p className="text-red-500 dark:text-red-400 text-xs mb-4">{errorMessage}</p>
            )}
            <div className="flex justify-end gap-2">
              <DialogClose asChild>
                <Button
                  variant="outline"
                  className="bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-600 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-zinc-700"
                >
                  Cancel
                </Button>
              </DialogClose>
              <DialogClose asChild>
                <Button
                  onClick={handleCreateTag}
                  className="bg-blue-500 dark:bg-blue-600 text-white hover:bg-blue-600 dark:hover:bg-blue-700"
                >
                  Create
                </Button>
              </DialogClose>
            </div>
          </ActionMenuDialog>
        </div>

        {searchTerm && searchResults.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white dark:bg-zinc-900 rounded-md shadow-lg border border-gray-200 dark:border-zinc-700 max-h-40 overflow-auto">
            {searchResults.map((hashtag) => {
              const isSelected = postCreateForm?.tagCodeList?.includes(hashtag.code) || false;
              return (
                <div
                  key={hashtag.code}
                  className={`flex items-center justify-between p-3 hover:bg-gray-100 dark:hover:bg-zinc-800 border-b border-gray-200 dark:border-zinc-700 last:border-b-0 ${
                    isSelected ? "bg-gray-50 dark:bg-zinc-800" : ""
                  }`}
                >
                  <div className="flex flex-col text-sm">
                    <span className="text-gray-900 dark:text-gray-100">#{hashtag.name}</span>
                    <span className="text-xs text-gray-500 dark:text-zinc-400">
                      {hashtag.usageCount} uses • @{hashtag.username}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Avatar className="w-5 h-5">
                      <AvatarImage
                        src={
                          hashtag.avatar
                            ? `https://res.cloudinary.com/dwv76nhoy/image/upload/w_80,h_80,c_thumb,f_auto,q_auto/${hashtag.avatar}`
                            : undefined
                        }
                        alt={`${hashtag.username}'s avatar`}
                      />
                      <AvatarFallback className="bg-gray-200 dark:bg-zinc-700 text-gray-900 dark:text-gray-100">
                        NA
                      </AvatarFallback>
                    </Avatar>
                    {isSelected ? (
                      <div className="flex items-center text-green-500 dark:text-green-400">
                        <Check className="h-4 w-4" />
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => selectHashtag(hashtag)}
                        disabled={isSelected}
                        className="bg-blue-500 dark:bg-blue-600 text-white hover:bg-blue-600 dark:hover:bg-blue-700"
                      >
                        Add
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {searchTerm && searchResults.length === 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white dark:bg-zinc-900 rounded-md shadow-lg border border-gray-200 dark:border-zinc-700 max-h-40 overflow-auto">
            <div className="p-4 text-sm text-gray-500 dark:text-zinc-400 text-center">
              No hashtags found.
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {selectedTags.map((hashtag) => (
          <Badge
            key={hashtag.code}
            variant="secondary"
            className="px-3 py-1 text-sm rounded-xl bg-gray-200 dark:bg-zinc-700 text-gray-900 dark:text-gray-100"
          >
            #{hashtag.name}
            <button
              onClick={() => removeHashtag(hashtag)}
              className="ml-2 hover:text-gray-700 dark:hover:text-zinc-200 transition-colors"
              aria-label={`Remove ${hashtag.name} hashtag`}
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
      {errorMessages?.title && (
        <p className="text-red-500 dark:text-red-400 text-xs mt-2">{errorMessages.title}</p>
      )}
      {errorMessages?.description && (
        <p className="text-red-500 dark:text-red-400 text-xs mt-1">{errorMessages.description}</p>
      )}
    </div>
  );
}