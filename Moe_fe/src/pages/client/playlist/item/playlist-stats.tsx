import React from "react";
import { Music, Clock } from "lucide-react";

const PlaylistStats: React.FC = () => (
  <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm text-zinc-300">
    <div className="flex items-center gap-2">
      <Music className="h-4 w-4" />
      <span>24 songs</span>
    </div>
    <div className="flex items-center gap-2">
      <Clock className="h-4 w-4" />
      <span>1 hr 36 min</span>
    </div>
    <div>128.5K plays</div>
    <div>4.2K saves</div>
  </div>
);

export default PlaylistStats;
