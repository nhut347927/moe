"use client";

import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { MoreHorizontal } from "lucide-react";
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

interface ActionMenuDialogProps {
  /**
   * Nút trigger để mở dialog, mặc định là icon ellipsis
   */
  trigger?: ReactNode;
  /**
   * Tiêu đề của dialog
   */
  title?: string;
  /**
   * Các nút hành động hoặc nội dung HTML bên trong dialog
   */
  children: ReactNode;
  /**
   * Kích thước của dialog
   */
  size?: "sm" | "md" | "lg";
  /**
   * Vị trí của dialog
   */
  position?: "center" | "top" | "bottom" | "left" | "right";
  /**
   * Lớp CSS tùy chỉnh cho dialog
   */
  className?: string;
}

export default function ActionMenuDialog({
  trigger,
  title,
  children,
  size = "sm",
  position = "center",
  className = "",
}: ActionMenuDialogProps) {
  const [open, setOpen] = useState(false);

  // Xác định kích thước của dialog
  const sizeClasses = {
    sm: "sm:max-w-[320px]",
    md: "sm:max-w-[425px]",
    lg: "sm:max-w-[640px]",
  };

  // Xác định vị trí của dialog
  const positionClasses = {
    center: "",
    top: "align-start",
    bottom: "align-end",
    left: "side-left",
    right: "side-right",
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="icon" className="rounded-xl h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent
        className={`rounded-3xl max-w-[90%] ${sizeClasses[size]} ${positionClasses[position]} ${className}`}
      >
        {title ? (
          <>
            <DialogTitle className="mt-3 text-lg font-medium ">
              {title}
            </DialogTitle>
            <DialogDescription className="sr-only">
              Action dialog with relevant control buttons
            </DialogDescription>
          </>
        ) : (
          // Nếu không muốn hiển thị title nhưng vẫn đảm bảo accessibility:
          <VisuallyHidden>
            <>
              <DialogTitle className="ms-7 mt-3 text-lg font-medium ">
                {title}
              </DialogTitle>
              <DialogDescription className="sr-only">
                Action dialog with relevant control buttons
              </DialogDescription>
            </>
          </VisuallyHidden>
        )}
        <div className="py-2">{children}</div>
      </DialogContent>
    </Dialog>
  );
}
