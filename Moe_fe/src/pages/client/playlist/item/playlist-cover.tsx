import React from "react";
import img1 from "../../../../assets/images/snapedit_1701159146527.png";
import { Crown } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const PlaylistCover: React.FC = () => (
  <div className="relative w-56 h-56">
    <img
      className="w-full h-full object-cover rounded-2xl shadow-lg"
      src={img1}
      alt="Playlist Cover"
    />
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="absolute bottom-3 right-3 h-10 w-10 flex items-center justify-center rounded-full bg-white/90 shadow-md">
            <Crown className="h-5 w-5 text-yellow-500" />
          </div>
        </TooltipTrigger>
        <TooltipContent className="bg-zinc-800 text-white">
          <p>You are the owner of this playlist</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  </div>
);

export default PlaylistCover;