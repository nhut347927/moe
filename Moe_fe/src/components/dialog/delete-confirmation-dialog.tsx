"use client"

import { useState, type ReactNode } from "react"
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
import { Trash2 } from "lucide-react"

interface DeleteConfirmationDialogProps {
  title?: string
  description?: string
  itemName?: string
  onConfirm: () => Promise<void> | void

  
  trigger?: ReactNode
}

export default function DeleteConfirmationDialog({
  title = "Confirm Deletion",
  description = "Are you sure you want to delete this item? This action cannot be undone.",
  itemName,
  onConfirm,
  trigger,
}: DeleteConfirmationDialogProps) {
  const [open, setOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleConfirm = async () => {
    setIsDeleting(true)
    try {
      await onConfirm()
      setOpen(false)
    } catch (error) {
      console.error("Error while deleting:", error)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button
            variant="destructive"
            size="sm"
            className="flex items-center gap-2 rounded-lg px-3 py-1.5"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md rounded-3xl max-w-[90%] bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 shadow-xl border border-zinc-200 dark:border-zinc-700">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold tracking-tight">
            {title}
          </DialogTitle>
          <DialogDescription className="text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
            {itemName
              ? `Are you sure you want to delete “${itemName}”? This action cannot be undone.`
              : description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-4 flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isDeleting}
            className="rounded-lg px-4 py-2"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isDeleting}
            className="rounded-lg px-4 py-2"
          >
            {isDeleting ? "Deleting..." : "Confirm"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
