"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { AlertCircle, CheckCircle, HelpCircle, Info } from "lucide-react"

type ActionType = "primary" | "destructive" | "success" | "warning" | "info"

interface ConfirmationDialogProps {
  title: string
  description: string
  actionType?: ActionType
  confirmText?: string
  cancelText?: string
  onConfirm: () => Promise<void> | void
  trigger: React.ReactNode
  showIcon?: boolean
}

export default function ConfirmationDialog({
  title,
  description,
  actionType = "primary",
  confirmText = "Xác nhận",
  cancelText = "Hủy",
  onConfirm,
  trigger,
  showIcon = true,
}: ConfirmationDialogProps) {
  const [open, setOpen] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleConfirm = async () => {
    setIsProcessing(true)
    try {
      await onConfirm()
      setOpen(false)
    } catch (error) {
      console.error("Lỗi khi xử lý:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  const getIcon = () => {
    switch (actionType) {
      case "destructive":
      case "warning":
        return <AlertCircle className="h-5 w-5 text-amber-500" />
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "info":
        return <Info className="h-5 w-5 text-blue-500" />
      default:
        return <HelpCircle className="h-5 w-5 text-gray-500" />
    }
  }

  const getButtonVariant = () => {
    switch (actionType) {
      case "destructive":
        return "destructive"
      case "success":
        return "default"
      case "warning":
        return "outline"
      case "info":
        return "secondary"
      default:
        return "default"
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="flex flex-row items-start gap-4">
          {showIcon && <div className="mt-1">{getIcon()}</div>}
          <div>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription className="mt-1">{description}</DialogDescription>
          </div>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0 mt-4">
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isProcessing}>
            {cancelText}
          </Button>
          <Button variant={getButtonVariant()} onClick={handleConfirm} disabled={isProcessing}>
            {isProcessing ? "Đang xử lý..." : confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

