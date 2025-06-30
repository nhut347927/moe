import {
  Heart,
  MessageCircle,
  Ellipsis,
  Check,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import img4 from "../../../assets/images/girl.png";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { cn } from "@/common/utils/utils";

// interface LinkItem {
//   to: string;
//   icon: React.ElementType;
//   label: string;
// }

// interface PlaylistItem {
//   title: string;
//   owner: string;
//   imgSrc: string;
// }
interface ActionBarProps {
  toggleUserInfo: () => void; // 🔹 Nhận hàm toggle từ Home.tsx
}

const ActionBar: React.FC<ActionBarProps> = ({ toggleUserInfo }) => {
  // const items: PlaylistItem[] = [
  //   {
  //     title: "Relax and let your worries drift away",
  //     owner: "Nhựt Nguyễn",
  //     imgSrc:
  //       "https://res.cloudinary.com/dwv76nhoy/image/upload/v1739337151/rrspasosi59xmsriilae.png",
  //   },
  //   {
  //     title: "Enjoy the rhythm of the clouds",
  //     owner: "Nhựt Nguyễn",
  //     imgSrc: img4,
  //   },
  //   {
  //     title: "Feel the breeze carrying your troubles away",
  //     owner: "Nhựt Nguyễn",
  //     imgSrc: img4,
  //   },
  // ];
  const playlists = [
    {
      id: 1,
      name: "Hãy thả hồn theo mây",
      image: img4,
    },
    {
      id: 2,
      name: "Chill Vibes",
      image: img4,
    },
    {
      id: 3,
      name: "Workout Mix",
      image: img4,
    },
    {
      id: 4,
      name: "Study Session",
      image: img4,
    },
    {
      id: 5,
      name: "Road Trip Tunes",
      image: img4,
    },
  ];

  const [selectedPlaylists, setSelectedPlaylists] = useState<number[]>([1]);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPlaylists = playlists.filter((playlist) =>
    playlist.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const togglePlaylist = (id: number) => {
    setSelectedPlaylists((prev) =>
      prev.includes(id) ? prev.filter((pId) => pId !== id) : [...prev, id]
    );
  };
  return (
    <div className="flex flex-col items-center space-y-5 p-4">
      {/* Avatar đầu */}
      <Avatar className="h-10 w-10 mb-3">
        <AvatarImage
          src={img4 || "default_song_image_url"}
          className="object-cover"
        />
        <AvatarFallback>U</AvatarFallback>
      </Avatar>

      {/* Icon Like */}
      <div className="flex flex-col items-center gap-1">
        <Heart
          className="h-7 w-7 cursor-pointer text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 hover:dark:text-zinc-100 transition"
          aria-label="Like"
        />
        <span className="text-sm text-zinc-600 dark:text-zinc-300 ">10k</span>
      </div>

      {/* Icon Comment (Gọi toggleUserInfo khi nhấn) */}
      <div className="flex flex-col items-center gap-1">
        <MessageCircle
          className="h-7 w-7 cursor-pointer text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 hover:dark:text-zinc-100 transition"
          aria-label="Comment"
          onClick={toggleUserInfo} // 🔹 Thêm sự kiện click
        />
        <span className="text-sm text-zinc-600 dark:text-zinc-300">1000</span>
      </div>

      {/* Icon Add */}
      <div className="flex flex-col items-center gap-1">
        {/* <CirclePlus
          className="h-7 w-7 cursor-pointer text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 hover:dark:text-zinc-100 transition"
          aria-label="Add"
        /> */}
        <Popover>
          <PopoverTrigger asChild>
            <div className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-green-600">
              <Check className="w-3 h-3 text-zinc-100" strokeWidth={3} />
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-[300px] p-2 rounded-xl">
            <h2 className="text-lg font-semibold p-3 pb-0 text-zinc-600 dark:text-zinc-300">
              Add Playlist
            </h2>
            <div className="p-2">
              <Input
                type="search"
                placeholder="Search playlists..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <ScrollArea className="h-[200px] p-2">
              {filteredPlaylists.map((playlist, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex items-center space-x-3 rounded-xl p-2 mb-2 transition-colors hover:bg-muted",
                    selectedPlaylists.includes(playlist.id) && "bg-muted"
                  )}
                  onClick={() => togglePlaylist(playlist.id)}
                >
                  <img
                    src={playlist.image}
                    alt={playlist.name}
                    className="h-10 w-10 rounded-xl object-cover"
                  />
                  <div className="flex-1 truncate">{playlist.name}</div>
                  {selectedPlaylists.includes(playlist.id) && (
                    <div className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-green-600">
                      <Check
                        className="w-3 h-3 text-zinc-100"
                        strokeWidth={3}
                      />
                    </div>
                  )}
                </div>
              ))}
            </ScrollArea>
            <div className="flex justify-end space-x-2 p-4 pb-2 border-t border-zinc-200 dark:border-zinc-800">
              <Button className="rounded-full" variant="outline">
                Cancel
              </Button>
              <Button className="rounded-full">Done</Button>
            </div>
          </PopoverContent>
        </Popover>
        <span className="text-sm text-zinc-600 dark:text-zinc-300">300</span>
      </div>

      {/* Icon More Options */}
      <Ellipsis
        className="h-7 w-7 cursor-pointer text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 hover:dark:text-zinc-100 transition"
        aria-label="More options"
      />

      {/* Avatar cuối */}
      <Avatar className="h-10 w-10">
        <AvatarImage
          src={img4 || "default_song_image_url"}
          className="object-cover"
        />
        <AvatarFallback>U</AvatarFallback>
      </Avatar>
    </div>
  );
};

export default ActionBar;
