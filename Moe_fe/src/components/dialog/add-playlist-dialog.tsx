'use client'

import { useState, ChangeEvent } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { ImagePlus, X , PlusCircle} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function AddPlaylistModal({ size }: { size: string }): JSX.Element {
  const [open, setOpen] = useState(false)
  const [playlistName, setPlaylistName] = useState('')
  const [playlistDescription, setPlaylistDescription] = useState('')
  const [isPublic, setIsPublic] = useState(false)
  const [playlistImage, setPlaylistImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('New Playlist:', { 
      name: playlistName, 
      description: playlistDescription,
      isPublic,
      image: playlistImage
    })
    setOpen(false)
    setPlaylistName('')
    setPlaylistDescription('')
    setIsPublic(false)
    setPlaylistImage(null)
    setImagePreview(null)
  }

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        alert('File is too large. Please choose a file smaller than 5MB.');
        return;
      }
      setPlaylistImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  const removeImage = () => {
    setPlaylistImage(null);
    setImagePreview(null);
  }
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
      <PlusCircle className={`w-${size} h-${size} text-zinc-600 hover:text-zinc-800 dark:text-zinc-300 dark:hover:text-zinc-100 cursor-pointer`} />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Playlist</DialogTitle>
          <DialogDescription>
            Enter your playlist details below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={playlistName}
              onChange={(e) => setPlaylistName(e.target.value)}
              placeholder="Enter playlist name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={playlistDescription}
              onChange={(e) => setPlaylistDescription(e.target.value)}
              placeholder="Describe your playlist"
              className="h-20"
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="public" className="flex items-center gap-2">
              Public
              <span className="text-sm text-muted-foreground">
                {isPublic ? 'Everyone can see this playlist' : 'Only you can see this playlist'}
              </span>
            </Label>
            <Switch
              id="public"
              checked={isPublic}
              onCheckedChange={setIsPublic}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="image">Cover Image</Label>
            <div className="flex items-center justify-center w-full">
              {imagePreview ? (
                <div className="relative w-full h-40">
                  <img
                    src={imagePreview}
                    alt="Playlist cover"
                    className="mx-auto h-full object-cover rounded-lg"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-0 right-0"
                    onClick={removeImage}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <Label
                  htmlFor="image"
                  className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <ImagePlus className="w-8 h-8 mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Upload image (max 5MB)
                    </p>
                  </div>
                </Label>
              )}
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save Playlist</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}