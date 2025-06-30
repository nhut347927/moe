"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { PostCreateForm } from "../type";
import { ChangeEvent } from "react";

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
    <div className="space-y-6 h-96">
      {/* Title */}
      <div>
        <Label htmlFor="title" className="block mb-1">
          Title
        </Label>
        <Input
          id="title"
          name="title"
          value={postCreateForm.title}
          onChange={handleChange}
          placeholder="Enter your title"
          maxLength={150}
        />
        {errorMessages?.title && (
          <p className="text-sm text-red-500 mt-1">{errorMessages.title}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <Label htmlFor="description" className="block mb-1">
          Description
        </Label>
        <Textarea
          id="description"
          name="description"
          value={postCreateForm.description || ""}
          onChange={handleChange}
          placeholder="Enter description..."
          className="resize-none h-52 rounded-xl border-gray-300 dark:border-zinc-600"
        />
        {errorMessages?.description && (
          <p className="text-sm text-red-500 mt-1">
            {errorMessages.description}
          </p>
        )}
      </div>

      {/* Visibility */}
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="visibility">Visibility</Label>
          <div className="text-sm text-muted-foreground">
            {isPrivate
              ? "Private - Only you can view"
              : "Public - Everyone can view"}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Label htmlFor="visibility" className="text-sm font-normal">
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
