import { Heart, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PlaylistCardProps {
  title: string;
  description: string;
  imageUrl: string;
  totalSongs: number;
  isPodcast?: boolean;
}

export function PlaylistCard({
  title,
  description,
  imageUrl,
  totalSongs,
  isPodcast = false,
}: PlaylistCardProps) {
  return (
    <div className="group relative rounded-3xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 bg-white dark:bg-neutral-900">
      {/* Image section */}

      <div className="relative aspect-square max-h-[320px] overflow-hidden rounded-t-3xl">
        <img
          src={imageUrl || "/placeholder.svg"}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Play button overlay */}
        <Button
          size="icon"
          className="absolute bottom-3 right-3 h-10 w-10 rounded-full bg-black text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-md hover:scale-105"
        >
          <Play className="h-4 w-4 fill-current" />
        </Button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-2">
        <h3 className="text-base font-semibold line-clamp-1 text-gray-900 dark:text-white">
          {title}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
          {description}
        </p>

        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {isPodcast ? `${totalSongs} tập` : `${totalSongs} bài hát`}
          </span>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-gray-500 hover:text-red-500 transition-colors"
          >
            <Heart className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
