"use client"

import type React from "react"

import { useState } from "react"
import { Check, Music, Plus, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

// Sample playlist data
const initialPlaylists = [
  { id: "1", name: "Liked Songs", selected: false },
  { id: "2", name: "Chill Vibes", selected: false },
  { id: "3", name: "Workout Mix", selected: false },
  { id: "4", name: "Party Anthems", selected: false },
  { id: "5", name: "Focus Flow", selected: false },
  { id: "6", name: "Throwbacks", selected: false },
  { id: "7", name: "Discover Weekly", selected: false },
  { id: "8", name: "Release Radar", selected: false },
]

interface AddToPlaylistDialogProps {
  icon?: React.ReactNode
  buttonText?: string
  songName?: string
}

export function AddToPlaylistDialog({
  icon = <Music className="h-4 w-4" />,
  buttonText = "Add to Playlist",
  //songName = "Current Song",
}: AddToPlaylistDialogProps) {
  const [open, setOpen] = useState(false)
  const [playlists, setPlaylists] = useState(initialPlaylists)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredPlaylists = playlists.filter((playlist) =>
    playlist.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleTogglePlaylist = (id: string) => {
    setPlaylists(
      playlists.map((playlist) => (playlist.id === id ? { ...playlist, selected: !playlist.selected } : playlist)),
    )
  }

  const handleDone = () => {
    // Here you would typically save the changes
    console.log(
      "Selected playlists:",
      playlists.filter((p) => p.selected),
    )
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          {icon}
          {buttonText}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[380px] p-0 overflow-hidden"  data-scroll-ignore>
        <DialogHeader className="px-4 pt-4 pb-2">
          <DialogTitle>Add to playlist</DialogTitle>
        <DialogDescription>
            Choise your wanted playlist to add the song to.
          </DialogDescription>
        </DialogHeader>

        <div className="px-4">
          <div className="flex items-center bg-muted/50 rounded-md px-2 py-1.5">
            <Search className="h-3.5 w-3.5 text-muted-foreground mr-2" />
            <Input
              className="border-0 p-0 h-auto text-sm bg-transparent shadow-none focus-visible:ring-0"
              placeholder="Find a playlist"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Button variant="ghost" size="sm" className="w-full justify-start mt-2 gap-2 text-sm font-normal h-8">
            <Plus className="h-3.5 w-3.5" />
            New playlist
          </Button>
        </div>

        <Separator className="my-2" />

        <ScrollArea className="max-h-[240px]">
          <div className="px-2">
            {filteredPlaylists.map((playlist) => (
              <div
                key={playlist.id}
                className="flex items-center justify-between py-1.5 px-2 rounded-md cursor-pointer hover:bg-muted/50"
                onClick={() => handleTogglePlaylist(playlist.id)}
              >
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 bg-muted flex items-center justify-center rounded-md">
                    <Music className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <span className="text-sm font-medium">{playlist.name}</span>
                </div>
                {playlist.selected && (
                  <div className="h-5 w-5 rounded-full bg-green-500 flex items-center justify-center">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>

        <DialogFooter className="flex flex-row justify-between p-3 bg-muted/30 border-t">
          <Button variant="ghost" size="sm" onClick={() => setOpen(false)} className="text-sm h-8 px-3">
            Cancel
          </Button>
          <Button onClick={handleDone} size="sm" className="text-sm h-8 px-3 ">
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
