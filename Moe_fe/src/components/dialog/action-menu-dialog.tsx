"use client"

import { useState, type ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { MoreHorizontal } from "lucide-react"

interface ActionMenuDialogProps {
  /**
   * Nút trigger để mở dialog, mặc định là icon ellipsis
   */
  trigger?: ReactNode
  /**
   * Tiêu đề của dialog
   */
  title?: string
  /**
   * Các nút hành động hoặc nội dung HTML bên trong dialog
   */
  children: ReactNode
  /**
   * Kích thước của dialog
   */
  size?: "sm" | "md" | "lg"
  /**
   * Vị trí của dialog
   */
  position?: "center" | "top" | "bottom" | "left" | "right"
  /**
   * Lớp CSS tùy chỉnh cho dialog
   */
  className?: string
}

export default function ActionMenuDialog({
  trigger,
  title,
  children,
  size = "sm",
  position = "center",
  className = "",
}: ActionMenuDialogProps) {
  const [open, setOpen] = useState(false)

  // Xác định kích thước của dialog
  const sizeClasses = {
    sm: "sm:max-w-[320px]",
    md: "sm:max-w-[425px]",
    lg: "sm:max-w-[640px]",
  }

  // Xác định vị trí của dialog
  const positionClasses = {
    center: "",
    top: "align-start",
    bottom: "align-end",
    left: "side-left",
    right: "side-right",
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="icon" className="rounded-xl h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className={`rounded-3xl max-w-[90%] ${sizeClasses[size]} ${positionClasses[position]} ${className}`}>
        {title && (
          <div className="border-b pb-2 mb-2">
            <h3 className="text-lg font-medium">{title}</h3>
          </div>
        )}
        <div className="py-2">{children}</div>
      </DialogContent>
    </Dialog>
  )
}

