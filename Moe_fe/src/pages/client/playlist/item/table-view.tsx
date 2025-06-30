import React from "react";
import { Clock, Play, Heart, MoreHorizontal } from "lucide-react";
import { getTimeAgo } from "@/common/utils/utils";

interface Song {
  id: number;
  title: string;
  artist: string;
  album: string;
  dateAdded: string;
  duration: string;
  imageUrl: string;
}

interface TableViewProps {
  playlistData: Song[];
}

const TableView: React.FC<TableViewProps> = ({ playlistData }) => (
  <table className="w-full border-collapse text-sm rounded-md overflow-hidden">
    <thead className="sticky top-0 border-b border-zinc-700 bg-zinc-800/60 backdrop-blur-md text-zinc-200">
      <tr>
        <th className="py-3 px-4 w-12 text-center">#</th>
        <th className="py-3 px-4 text-left">Title</th>
        <th className="py-3 px-4 text-left">Album</th>
        <th className="py-3 px-4 text-left">Date added</th>
        <th className="py-3 px-4 w-24 text-center">
          <Clock size={16} />
        </th>
      </tr>
    </thead>
    <tbody>
      {playlistData.map((song, index) => (
        <tr
          key={song.id}
          className="group hover:bg-zinc-800/50 transition"
        >
          <td className="py-3 px-4 text-zinc-400 group-hover:text-white">
            <div className="flex items-center justify-center">
              <span className="group-hover:hidden">{index + 1}</span>
              <Play size={16} className="hidden group-hover:block" />
            </div>
          </td>
          <td className="py-3 px-4">
            <div className="flex items-center">
              <img
                src={song.imageUrl}
                alt={song.title}
                className="h-10 w-10 object-cover rounded-md mr-3"
              />
              <div>
                <div className="font-medium text-white">
                  {song.title}
                </div>
                <div className="text-xs text-zinc-400">
                  {song.artist}
                </div>
              </div>
            </div>
          </td>
          <td className="py-3 px-4 text-zinc-400">
            {song.album}
          </td>
          <td className="py-3 px-4 text-zinc-400">
            {getTimeAgo(song.dateAdded)}
          </td>
          <td className="py-3 px-4 text-zinc-400">
            <div className="flex items-center justify-end gap-3">
              <Heart
                size={16}
                className="opacity-0 group-hover:opacity-100 transition"
              />
              <span>{song.duration}</span>
              <MoreHorizontal
                size={16}
                className="opacity-0 group-hover:opacity-100 transition"
              />
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default TableView;