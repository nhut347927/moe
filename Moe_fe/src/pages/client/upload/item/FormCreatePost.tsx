"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { ChangeEvent } from "react";
import { PostCreateForm } from "../../types";

interface FormCreatePostProp {
  postCreateForm: PostCreateForm | null;
  setPostCreateForm: (form: PostCreateForm) => void;
  errorMessages?: {
    title?: string;
    description?: string;
  };
}

export default function FormCreatePost({
  postCreateForm,
  setPostCreateForm,
  errorMessages,
}: FormCreatePostProp) {
  if (!postCreateForm) return null;

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setPostCreateForm({
      ...postCreateForm,
      [name]: value,
    });
  };

  const handleToggleVisibility = (checked: boolean) => {
    setPostCreateForm({
      ...postCreateForm,
      visibility: checked ? "PRIVATE" : "PUBLIC",
    });
  };

  const isPrivate = postCreateForm.visibility === "PRIVATE";

  return (
    <div className="space-y-6 h-96 text-gray-900 dark:text-gray-100">
      {/* Title */}
      <div>
        <Label
          htmlFor="title"
          className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Title
        </Label>
        <Input
          id="title"
          name="title"
          value={postCreateForm.title}
          onChange={handleChange}
          placeholder="Enter your title"
          maxLength={150}
          className="bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
        />
        {errorMessages?.title && (
          <p className="text-sm text-red-500 mt-1">{errorMessages.title}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <Label
          htmlFor="description"
          className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Description
        </Label>
        <Textarea
          id="description"
          name="description"
          value={postCreateForm.description || ""}
          onChange={handleChange}
          placeholder="Enter description..."
          className="resize-none h-52 rounded-xl bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
        />
        {errorMessages?.description && (
          <p className="text-sm text-red-500 mt-1">{errorMessages.description}</p>
        )}
      </div>

      {/* Visibility */}
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label
            htmlFor="visibility"
            className="text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Visibility
          </Label>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {isPrivate
              ? "Private - Only you can view"
              : "Public - Everyone can view"}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Label
            htmlFor="visibility"
            className="text-sm font-normal text-gray-700 dark:text-gray-300"
          >
            {isPrivate ? "Private" : "Public"}
          </Label>
          <Switch
            id="visibility"
            checked={isPrivate}
            onCheckedChange={handleToggleVisibility}
          />
        </div>
      </div>
    </div>
  );
}
