import React from "react";
import { Heart, Play } from "lucide-react";

interface Song {
  id: number;
  title: string;
  artist: string;
  album: string;
  dateAdded: string;
  duration: string;
  imageUrl: string;
}

interface MasonryViewProps {
  playlistData: Song[];
}

const MasonryView: React.FC<MasonryViewProps> = ({ playlistData }) => (
  <div className="h-full columns-2 md:columns-3 lg:columns-4 gap-4">
    {playlistData.map((song) => (
      <div
        key={song.id}
        className="group bg-zinc-900/50 backdrop-blur-md p-3 rounded-lg mb-4 break-inside-avoid hover:bg-zinc-800/50 transition"
      >
        <img
          src={song.imageUrl}
          alt={song.title}
          className="w-full h-auto object-cover rounded-md mb-2"
        />
        <div className="font-medium text-white truncate">
          {song.title}
        </div>
        <div className="text-xs text-zinc-400 truncate">
          {song.artist}
        </div>
        <div className="flex justify-between items-center mt-2 text-zinc-400 text-xs">
          <span>{song.duration}</span>
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
            <Heart size={14} />
            <Play size={14} />
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default MasonryView;