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

interface ListViewProps {
  playlistData: Song[];
}

const ListView: React.FC<ListViewProps> = ({ playlistData }) => (
  <div className="space-y-2">
    {playlistData.map((song, index) => (
      <div
        key={song.id}
        className="group flex items-center bg-zinc-900/50 backdrop-blur-md p-2 rounded-lg hover:bg-zinc-800/50 transition"
      >
        <span className="w-10 text-center text-zinc-400">
          {index + 1}
        </span>
        <img
          src={song.imageUrl}
          alt={song.title}
          className="w-10 h-10 object-cover rounded-md mx-2"
        />
        <div className="flex-1">
          <div className="font-medium text-white truncate">
            {song.title}
          </div>
          <div className="text-xs text-zinc-400 truncate">
            {song.artist} • {song.album}
          </div>
        </div>
        <div className="flex items-center gap-3 text-zinc-400 mr-4 text-xs">
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

export default ListView;