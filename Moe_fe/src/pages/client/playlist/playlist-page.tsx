"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  LayoutGrid,
  ArrowUpAZ,
  ArrowDownZA,
  X,
  BetweenHorizontalEnd,
  BetweenHorizontalStart,
  List,
  LayoutDashboard,
  Square,
  ArrowDownUp,
  ClockArrowUp,
  ClockArrowDown,
  TableProperties,
} from "lucide-react";
import vid69 from "../../../assets/video/vid69.mp4";
import img1 from "../../../assets/images/snapedit_1701159146527.png";
import { ScrollArea } from "@/components/ui/scroll-area";
import PlaylistCover from "./item/playlist-cover";
import PlaylistInfo from "./item/playlist-info";
import CreatorInfo from "./item/creator-info";
import PlaylistStats from "./item/playlist-stats";
import PlaybackControls from "./item/playbackC-controls";
import ViewModeSelector from "./item/view-mode-selector";
import TableView from "./item/table-view";
import GridView from "./item/grid-view";
import ListView from "./item/list-view";
import MasonryView from "./item/masonry-view";

interface Song {
  id: number;
  title: string;
  artist: string;
  album: string;
  dateAdded: string; // ISO date string
  duration: string;
  imageUrl: string;
}

const sortOptions = [
  { id: "sort-default", label: "Default", icon: ArrowDownUp },
  { id: "sort-name-asc", label: "Name A-Z", icon: ArrowUpAZ },
  { id: "sort-name-desc", label: "Name Z-A", icon: ArrowDownZA },
  { id: "sort-recent", label: "Newest", icon: ClockArrowUp },
  { id: "sort-oldest", label: "Oldest", icon: ClockArrowDown },
];

const gridListOptions = [
  { id: "table", label: "Table", icon: TableProperties },
  { id: "grid", label: "Grid", icon: LayoutGrid },
  { id: "list", label: "List", icon: List },
  { id: "masonry", label: "Masonry", icon: LayoutDashboard },
];

const layoutOptions = [
  { id: "both-visible", label: "Show both sides", icon: Square },
  { id: "left-only", label: "Left side only", icon: BetweenHorizontalEnd },
  { id: "right-only", label: "Right side only", icon: BetweenHorizontalStart },
  { id: "both-hidden", label: "Hide both sides", icon: X },
];

const PlaylistPage: React.FC = () => {
  const [selectedGridList, setSelectedGridList] = useState<string>("table");
  const [selectedSort, setSelectedSort] = useState<string>("sort-default");
  const [selectedLayout, setSelectedLayout] = useState<string>("both-visible");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isPlaying, setIsPlaying] = useState(true); // Video autoplay by default
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(100);
  const [isRepeat, setIsRepeat] = useState(false); // Trạng thái lặp lại
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    const handleLoadedMetadata = () => setDuration(video.duration);

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("loadedmetadata", handleLoadedMetadata);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, []);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (value: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = value;
      setCurrentTime(value);
    }
  };

  const handleVolumeChange = (value: number) => {
    if (videoRef.current) {
      videoRef.current.volume = value / 100;
      setVolume(value);
    }
  };

  const handleSkip = () => {
    console.log("Skip to next track");
    // Implement skip logic here (e.g., load next video or track)
  };

  const handleShuffle = () => {
    console.log("Shuffle playlist");
    // Implement shuffle logic here
  };
  const handleRepeat = () => {
    setIsRepeat(!isRepeat);
  };
  const playlistData: Song[] = [
    {
      id: 1,
      title: "Bohemian Rhapsody",
      artist: "Queen",
      album: "A Night at the Opera",
      dateAdded: "2025-04-01T10:05:00Z",
      duration: "5:55",
      imageUrl: img1,
    },
    {
      id: 2,
      title: "Shape of You",
      artist: "Ed Sheeran",
      album: "÷ (Divide)",
      dateAdded: "2025-03-15T14:30:00Z",
      duration: "3:53",
      imageUrl: img1,
    },
    {
      id: 3,
      title: "Blinding Lights",
      artist: "The Weeknd",
      album: "After Hours",
      dateAdded: "2025-04-05T09:15:00Z",
      duration: "3:20",
      imageUrl: img1,
    },
    {
      id: 4,
      title: "Sweet Child O' Mine",
      artist: "Guns N' Roses",
      album: "Appetite for Destruction",
      dateAdded: "2025-02-20T18:45:00Z",
      duration: "5:56",
      imageUrl: img1,
    },
    {
      id: 5,
      title: "Rolling in the Deep",
      artist: "Adele",
      album: "21",
      dateAdded: "2025-03-25T12:00:00Z",
      duration: "3:48",
      imageUrl: img1,
    },
  ];

  const handleSortChange = (id: string) => {
    setSelectedSort(id);
    console.log(`Selected Sort Option: ${id}`);
  };

  const handleLayoutChange = (id: string) => {
    setSelectedLayout(id);
    console.log(`Selected Layout Option: ${id}`);
  };

  const handleGridListChange = (id: string) => {
    setSelectedGridList(id);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Filter songs based on search query
  const filteredSongs = playlistData.filter(
    (song) =>
      song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort songs based on selectedSort
  const sortedSongs = [...filteredSongs].sort((a, b) => {
    switch (selectedSort) {
      case "sort-name-asc":
        return a.title.localeCompare(b.title);
      case "sort-name-desc":
        return b.title.localeCompare(a.title);
      case "sort-recent":
        return (
          new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
        );
      case "sort-oldest":
        return (
          new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime()
        );
      case "sort-default":
      default:
        return a.id - b.id; // Default sorting by ID
    }
  });

  const showLeft =
    selectedLayout === "both-visible" || selectedLayout === "left-only";
  const showRight =
    selectedLayout === "both-visible" || selectedLayout === "right-only";

  const getSelectedIcon = (
    id: string,
    options: { id: string; icon: React.ComponentType<{ className?: string }> }[]
  ) => {
    const found = options.find((o) => o.id === id);
    return found ? (
      <found.icon className="h-5 w-5 text-zinc-300 hover:text-white cursor-pointer transition" />
    ) : (
      <Square className="h-5 w-5 text-zinc-300" />
    );
  };

  return (
    <div className="h-screen max-h-screen p-2">
      <div className="h-full rounded-3xl overflow-hidden">
        <div className="relative w-full h-full flex flex-col lg:flex-row">
          {/* Layout Options */}
          {!showRight && (
            <div className="absolute top-11 right-8 z-20">
              <Square
                className="h-5 w-5 text-zinc-300 hover:text-white cursor-pointer transition"
                onClick={() => setSelectedLayout("both-visible")}
              />
            </div>
          )}

          <video
            ref={videoRef}
            loop={isRepeat} // Lặp lại nếu isRepeat = true
            autoPlay
            className="absolute inset-0 w-full h-full object-cover wrapper"
          >
            <source src={vid69} type="video/mp4" />
          </video>

          <div
            className={`relative z-10 w-full lg:w-1/3 p-6 text-white ${
              showLeft ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="h-full flex flex-col">
              <div className="space-y-7">
                <PlaylistCover />
                <PlaylistInfo />
                <CreatorInfo />
                <PlaylistStats />
              </div>
              <div className="mt-auto flex items-center gap-2">
                <div className="flex -space-x-2">
                  <img
                    className="inline-block h-7 w-7 rounded-full ring-2 ring-white dark:ring-zinc-800"
                    src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                    alt="An"
                    title="An"
                  />
                  <img
                    className="inline-block h-7 w-7 rounded-full ring-2 ring-white dark:ring-zinc-800"
                    src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                    alt="Bình"
                    title="Bình"
                  />
                  <img
                    className="inline-block h-7 w-7 rounded-full ring-2 ring-white dark:ring-zinc-800"
                    src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                    alt="Chi"
                    title="Chi"
                  />
                  <img
                    className="inline-block h-7 w-7 rounded-full ring-2 ring-white dark:ring-zinc-800"
                    src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                    alt="Dung"
                    title="Dung"
                  />
                </div>
                <span className="text-xs text-zinc-400">+ 12 more</span>
              </div>
            </div>
          </div>

          <div
            className={`relative z-10 w-full lg:w-2/3 p-2 ${
              showRight ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="h-full p-6 bg-zinc-900/40 backdrop-blur-3xl rounded-3xl shadow-xl">
              <div className="flex items-center mb-6">
                <ViewModeSelector
                  searchQuery={searchQuery}
                  handleSearchChange={handleSearchChange}
                  selectedGridList={selectedGridList}
                  handleGridListChange={handleGridListChange}
                  gridListOptions={gridListOptions}
                  selectedSort={selectedSort}
                  handleSortChange={handleSortChange}
                  sortOptions={sortOptions}
                  layoutOptions={layoutOptions}
                  handleLayoutChange={handleLayoutChange}
                  selectedLayout={selectedLayout}
                  getSelectedIcon={getSelectedIcon}
                />
              </div>
              <ScrollArea className="h-[calc(100vh-190px)]">
                {selectedGridList === "table" && (
                  <TableView playlistData={sortedSongs} />
                )}
                {selectedGridList === "grid" && (
                  <GridView playlistData={sortedSongs} />
                )}
                {selectedGridList === "list" && (
                  <ListView playlistData={sortedSongs} />
                )}
                {selectedGridList === "masonry" && (
                  <MasonryView playlistData={sortedSongs} />
                )}
              </ScrollArea>
              <PlaybackControls
                isPlaying={isPlaying}
                handlePlayPause={handlePlayPause}
                handleSkip={handleSkip}
                handleShuffle={handleShuffle}
                currentTime={currentTime}
                duration={duration}
                onSeek={handleSeek}
                volume={volume}
                onVolumeChange={handleVolumeChange}
                isRepeat={isRepeat}
                handleRepeat={handleRepeat}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaylistPage;
