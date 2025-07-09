import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Home,
  Search,
  List,
  Play,
  Library,
  Check,
  MessageCircle,
  Compass,
  Settings,
  SquarePlus,
} from "lucide-react";
import img from "../../assets/images/logo.png";
import girl from "../../assets/images/girl.png";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { cn } from "@/common/utils/utils";
import AddPlaylistModal from "@/components/dialog/add-playlist-dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface LinkItem {
  to: string;
  icon: React.ElementType;
  label: string;
}

interface PlaylistItem {
  title: string;
  owner: string;
  imgSrc: string;
}

const SliderBar: React.FC = () => {
  const [uri, setUri] = useState<string>(window.location.pathname);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      setIsCollapsed(window.innerWidth <= 1000);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const links: LinkItem[] = [
    { to: "/client/home", icon: Home, label: "Home" },
    { to: "/client/search", icon: Search, label: "Search" },
    { to: "/client/upload", icon: SquarePlus, label: "Upload" },
    { to: "/client/chat", icon: MessageCircle, label: "Message" },
    { to: "/client/explore", icon: Compass, label: " Explore" },
  ];

  const items: PlaylistItem[] = [
    {
      title: "Relax and let your worries drift away",
      owner: "Nhựt Nguyễn",
      imgSrc:
        "https://res.cloudinary.com/dwv76nhoy/image/upload/v1739337151/rrspasosi59xmsriilae.png",
    },
    {
      title: "Enjoy the rhythm of the clouds",
      owner: "Nhựt Nguyễn",
      imgSrc: girl,
    },
    {
      title: "Feel the breeze carrying your troubles away",
      owner: "Nhựt Nguyễn",
      imgSrc: girl,
    },
  ];
  const sortOptions = [
    { label: "Default", value: "default", id: "sort-default" },
    { label: "Name A-Z", value: "name-asc", id: "sort-name-asc" },
    { label: "Name Z-A", value: "name-desc", id: "sort-name-desc" },
    { label: "Newest", value: "recent", id: "sort-recent" },
    { label: "Oldest", value: "oldest", id: "sort-oldest" },
  ];

  const [selectedSort, setSelectedSort] = useState<string>("default");

  const handleSortChange = (sortOption: string) => {
    setSelectedSort(sortOption);
    console.log(`Selected Sort Option: ${sortOption}`);
    // Gọi API hoặc cập nhật UI tại đây
  };

  // const playlists = [
  //   {
  //     id: 1,
  //     name: "Hãy thả hồn theo mây",
  //     image: girl,
  //   },
  //   {
  //     id: 2,
  //     name: "Chill Vibes",
  //     image: girl,
  //   },
  //   {
  //     id: 3,
  //     name: "Workout Mix",
  //     image: girl,
  //   },
  //   {
  //     id: 4,
  //     name: "Study Session",
  //     image: girl,
  //   },
  //   {
  //     id: 5,
  //     name: "Road Trip Tunes",
  //     image: girl,
  //   },
  // ];

  // const [selectedPlaylists, setSelectedPlaylists] = useState<number[]>([1]);
  // const [searchTerm, setSearchTerm] = useState("");

  // const filteredPlaylists = playlists.filter((playlist) =>
  //   playlist.name.toLowerCase().includes(searchTerm.toLowerCase())
  // );

  // const togglePlaylist = (id: number) => {
  //   setSelectedPlaylists((prev) =>
  //     prev.includes(id) ? prev.filter((pId) => pId !== id) : [...prev, id]
  //   );
  // };

  useEffect(() => {
    if (uri === "/client/home") {
      setIsCollapsed(true);
    }
  }, [uri]);
  return (
    <nav className="max-h-screen p-2 pe-0" data-scroll-ignore>
      <div
        className={`h-full flex flex-col bg-white dark:bg-zinc-900
        text-white dark:text-white transition-all  rounded-3xl duration-300 ease-in-out ${
          isCollapsed ? "w-20" : "w-80"
        }`}
      >
        {/* Header */}
        <div className="flex items-center mt-3">
          {!isCollapsed && (
            <div className="flex items-center ms-4">
              <Link to="/client/home" onClick={() => setUri("/client/home")}>
                <img src={img} alt="Logo" className="w-12 rounded-full" />
              </Link>
              <span className="ms-4 text-2xl moe-font-jua text-zinc-600 dark:text-zinc-100">
                MOE
              </span>
            </div>
          )}
          {/* Nút Library để đóng/mở slider */}
          <div className="ms-auto me-6">
            <Library
              className="w-7 h-7 text-zinc-600 hover:text-zinc-800 dark:text-zinc-300 dark:hover:text-zinc-100 cursor-pointer"
              onClick={() => setIsCollapsed(!isCollapsed)}
            />
          </div>
        </div>
        {/* Navigation Links */}
        <div className="flex flex-col space-y-2 px-2 mt-5">
          {links.map((link, index) => (
            <Link
              key={index}
              to={link.to}
              onClick={() => setUri(link.to)}
              className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                uri === link.to
                  ? "bg-primary/10 text-primary font-medium"
                  : "hover:bg-zinc-100 dark:hover:bg-zinc-800/50 text-zinc-600 dark:text-zinc-400"
              }`}
            >
              <link.icon
                className={`${isCollapsed ? "mx-auto" : "ms-1"} w-5 h-5`}
              />
              {!isCollapsed && <span className="truncate">{link.label}</span>}
            </Link>
          ))}
        </div>

        {/* Playlist Section */}

        <div className="flex flex-col space-y-2 overflow-y-auto mt-2">
          {!isCollapsed ? (
            <div className="flex justify-between items-center px-4">
              <span className="font-bold text-zinc-600 dark:text-zinc-300">
                Playlist
              </span>
              <div className="flex space-x-4">
                <AddPlaylistModal size="4" />

                <Popover>
                  <PopoverTrigger>
                    <List className="w-4 h-4 text-zinc-600 hover:text-zinc-800 dark:text-zinc-300 dark:hover:text-zinc-100 cursor-pointer" />
                  </PopoverTrigger>
                  <PopoverContent className="p-2 w-36">
                    <ul className="flex flex-col space-y-1">
                      {sortOptions.map((option, index) => (
                        <li key={index}>
                          <button
                            id={option.id}
                            className={cn(
                              "w-full text-left px-2 py-1 flex items-center justify-between rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800",
                              selectedSort === option.value
                                ? "text-green-600 font-semibold"
                                : "text-zinc-800 dark:text-zinc-300"
                            )}
                            onClick={() => handleSortChange(option.value)}
                          >
                            <span>{option.label}</span>
                            {selectedSort === option.value && (
                              <Check className="w-4 h-4" />
                            )}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          ) : (
            <span className="block h-[3px] w-[48px] ms-4 rounded-full bg-zinc-600 dark:bg-zinc-300"></span>
          )}

          <ScrollArea className="overflow-y-auto overflow-x-hidden scroll-but-hidden px-2">
            {items.map((item, index) => (
              <div
                key={index}
                className="group relative rounded-xl overflow-hidden cursor-pointer"
              >
                <div className="flex items-center p-2 relative">
                  <div className="h-12 w-12 min-w-[48px] min-h-[48px] rounded-xl overflow-hidden relative flex-shrink-0">
                    <img
                      src={item.imgSrc}
                      alt="Playlist"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {!isCollapsed && (
                    <div className="ms-4 z-20">
                      <Link to={"/client/playlist"}>
                        <span className="block font-medium text-zinc-800 dark:text-zinc-100 truncate text-ellipsis max-w-[220px]">
                          {item.title}
                        </span>
                      </Link>
                      <span className="block text-sm text-zinc-600 dark:text-zinc-300 truncate text-ellipsis max-w-[220px]">
                        {item.owner}
                      </span>
                    </div>
                  )}
                </div>
                <Link to={"/client/playlist"}>
                  <div className="absolute inset-0 flex items-center justify-start bg-zinc-600 bg-opacity-30 opacity-0 group-hover:opacity-100 z-10">
                    <Play className="ms-5 z-20" />
                  </div>
                </Link>
              </div>
            ))}
          </ScrollArea>
        </div>

        {/* Now Playing Section
        {!isCollapsed ? (
          <div className="mt-auto w-full">
            <div className="p-2">
              <div className="flex items-center space-x-3">
                <img
                  src={girl}
                  alt="Playlist"
                  className="h-32 w-32 rounded-md"
                />
                <div className="w-full">
                  <div className="flex items-center justify-between">
                    <Shuffle className="w-4 h-4 text-zinc-600 hover:text-zinc-800 dark:text-zinc-300 dark:hover:text-zinc-100 cursor-pointer" />

                    <Popover>
                      <PopoverTrigger asChild>
                        <div className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-green-600">
                          <Check
                            className="w-3 h-3 text-zinc-100"
                            strokeWidth={3}
                          />
                        </div>
                      </PopoverTrigger>
                      <PopoverContent className="w-[300px] p-0">
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
                                "flex items-center space-x-2 rounded-md p-2 transition-colors hover:bg-muted",
                                selectedPlaylists.includes(playlist.id) &&
                                  "bg-muted"
                              )}
                              onClick={() => togglePlaylist(playlist.id)}
                            >
                              <img
                                src={playlist.image}
                                alt={playlist.name}
                                className="h-10 w-10 rounded-md object-cover"
                              />
                              <div className="flex-1 truncate">
                                {playlist.name}
                              </div>
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
                        <div className="flex justify-end space-x-2 p-4 border-t border-zinc-200 dark:border-zinc-800">
                          <Button className="rounded-full" variant="outline">
                            Cancel
                          </Button>
                          <Button className="rounded-full">Done</Button>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="flex items-center justify-between">
                    <Repeat className="w-4 h-4 mt-3 text-zinc-600 hover:text-zinc-800 dark:text-zinc-300 dark:hover:text-zinc-100 cursor-pointer" />
                    <Popover>
                      <PopoverTrigger>
                        <Volume2 className="w-4 h-4 mt-3 text-zinc-600 hover:text-zinc-800 dark:text-zinc-300 dark:hover:text-zinc-100 cursor-pointer" />
                      </PopoverTrigger>
                      <PopoverContent className="h-[200px] flex items-center justify-center w-10">
                        <Slider
                          defaultValue={[50]}
                          max={100}
                          step={1}
                          orientation="vertical"
                          className={`
                                    h-full w-2
                                    data-[orientation=vertical]:flex-col
                                    data-[orientation=vertical]:items-center
                                    data-[orientation=vertical]:justify-center
                                  `}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="flex">
                    <div className="flex items-center mt-7 ">
                      <div className="h-12 w-12 flex items-center justify-center rounded-full bg-slate-800 dark:bg-slate-100">
                        <Play className="h-6 w-6 ms-1 text-zinc-300 dark:text-zinc-600" />
                      </div>
                      <SkipForward className="h-6 w-6 ms-4 text-zinc-600 hover:text-zinc-800 dark:text-zinc-300 dark:hover:text-zinc-100 cursor-pointer" />
                    </div>
                    <span className="truncate text-xs mt-auto ms-auto text-zinc-600 dark:text-slate-300">
                      3:00 / 5:00
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-2">
                <h4 className="block font-bold text-zinc-800 dark:text-zinc-100 truncate text-ellipsis max-w-[220px]">
                  id T41104 (feat. 267) - W/n
                </h4>
                <p className="block text-sm text-zinc-600 dark:text-zinc-300 truncate text-ellipsis max-w-[220px]">
                  W/n
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-auto mb-2 w-full">
            <div className="p-3">
              <div className="border-2 p-2 rounded-full border-zinc-900 dark:border-zinc-300">
                <div className="h-9 w-9 mb-12 flex items-center justify-center rounded-full bg-slate-800 dark:bg-slate-100">
                  <Play className="h-5 w-5 text-zinc-300 dark:text-zinc-600" />
                </div>
                <img
                  src={girl}
                  alt="Playlist"
                  className="h-9 w-9 rounded-full"
                />
              </div>
            </div>
          </div>
        )} */}
        {/* User Profile Section */}
        <div className="mt-auto dark:border-zinc-800 p-3">
          {!isCollapsed ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {/* User Avatar */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={girl} className="object-cover z-10" />

                      <div className="flex items-center">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
                          <Settings className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
                        </div>
                        <div className="ml-3">
                          <span className="font-medium text-sm text-zinc-800 dark:text-zinc-200">
                            Settings
                          </span>
                        </div>
                      </div>
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <Link to="/client/profile">
                      <DropdownMenuItem>Profile</DropdownMenuItem>
                    </Link>
                    <Link to="/auth/login">
                      <DropdownMenuItem>Login</DropdownMenuItem>
                    </Link>
                    <Link to="/auth/register">
                      <DropdownMenuItem>Register</DropdownMenuItem>
                    </Link>
                    <Link to="/auth/change-password">
                      <DropdownMenuItem>Change Password</DropdownMenuItem>
                    </Link>
                    <DropdownMenuItem>Log out</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <div className="ml-3">
                  <div className="flex items-center">
                    <span className="font-semibold text-[15px] text-zinc-800 dark:text-zinc-50">
                      Nhựt Nguyễn
                    </span>
                    <Badge className="ml-2 h-5 px-1.5 bg-primary/20 text-primary text-xs">
                      Pro
                    </Badge>
                  </div>
                  <Link
                    to={"/client/profile"}
                    className="text-zinc-500 text-sm hover:underline hover:text-zinc-800 dark:text-zinc-300 dark:hover:text-zinc-50"
                  >
                    @nhutnguyen
                  </Link>
                </div>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    >
                      <Settings className="h-4 w-4 text-zinc-600 dark:text-zinc-400" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p>Settings</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          ) : (
            <div className="flex justify-center">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    {/* User Avatar */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={girl}
                            className="object-cover z-10"
                          />

                          <div className="flex items-center">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
                              <Settings className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
                            </div>
                            <div className="ml-3">
                              <span className="font-medium text-sm text-zinc-800 dark:text-zinc-200">
                                Settings
                              </span>
                            </div>
                          </div>
                          <AvatarFallback>U</AvatarFallback>
                        </Avatar>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <Link to="/client/profile">
                          <DropdownMenuItem>Profile</DropdownMenuItem>
                        </Link>
                        <Link to="/auth/login">
                          <DropdownMenuItem>Login</DropdownMenuItem>
                        </Link>
                        <Link to="/auth/register">
                          <DropdownMenuItem>Register</DropdownMenuItem>
                        </Link>
                        <Link to="/auth/change-password">
                          <DropdownMenuItem>Change Password</DropdownMenuItem>
                        </Link>
                        <DropdownMenuItem>Log out</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>Settings</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default SliderBar;
