import {
  Home,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Header() {
  function getCookie(name: string): string | undefined {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(";").shift();
    return undefined;
  }
  const avatar = getCookie("avatar");
  return (
    <header className="relative z-50">
     <div className="absolute w-full p-2 z-10 flex justify-between">
        <Link to="/" className="text-zinc-700 dark:text-zinc-200">
          <Button variant="outline" size="icon"   className="bg-zinc-100/60 text-zinc-800 hover:bg-zinc-200 border border-zinc-300 dark:bg-white/5 dark:text-white dark:border-white/10 dark:hover:bg-white/10 transition-colors rounded-full">
            <Home className="w-5 h-5" />
          </Button>
        </Link>
        <div className="flex gap-2">
          {/* <DropdownMenu>
            <DropdownMenuTrigger asChild className="outline-none">
              <Button
                variant="outline"
                  className="p-2.5 bg-zinc-100/60 text-zinc-800 hover:bg-zinc-200 border border-zinc-300 dark:bg-white/5 dark:text-white dark:border-white/10 dark:hover:bg-white/10 transition-colors rounded-full"
              >
                <Bell className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-72 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-xl p-2">
              <div className="px-3 py-1.5 text-sm font-semibold text-zinc-700 dark:text-zinc-100">
                Thông báo
              </div>

              <div className="divide-y divide-zinc-200 dark:divide-zinc-700">
             thông báo
              </div>

              <div className="pt-2 border-t border-zinc-200 dark:border-zinc-700">
                <div className="text-center">
                  <button className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline transition-colors">
                    Xem tất cả thông báo
                  </button>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu> */}
           <Link to={"/client/my-profile"}>
            <Avatar className="w-9 h-9">
              <AvatarImage
                src={`https://res.cloudinary.com/dwv76nhoy/image/upload/w_80,h_80/${avatar}`}
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </Link>
        </div>
      </div>
    </header>
  );
}
//  <div className="flex flex-col items-end space-y-2 bg-muted/60 p-2 rounded-xl">
//         {/* Dark Mode Toggle */}
//         <div className="inline-flex items-center justify-center outline-none h-9 w-9 p-2 rounded-xl transition-colors hover:bg-muted">
//           <ModeToggle />
//         </div>

//         {/* Fullscreen Toggle */}
//         <Button
//           variant="ghost"
//           size="icon"
//           onClick={toggleFullscreen}
//           className="rounded-xl p-2 transition-colors hover:bg-muted"
//         >
//           {isFullscreen ? (
//             <Minimize className="w-5 h-5" />
//           ) : (
//             <Maximize className="w-5 h-5" />
//           )}
//         </Button>

//         {/* Notification */}
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <Button
//               variant="ghost"
//               size="icon"
//               className="relative rounded-xl p-2 transition-colors hover:bg-muted"
//             >
//               <Bell className="h-5 w-5" />
//               <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
//               <span className="sr-only">Notifications</span>
//             </Button>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent align="end">
//             <DropdownMenuLabel>Notifications</DropdownMenuLabel>
//             <DropdownMenuSeparator />
//             <DropdownMenuItem>New message from Alice</DropdownMenuItem>
//             <DropdownMenuItem>John liked your post</DropdownMenuItem>
//             <DropdownMenuItem>New follower: Emma</DropdownMenuItem>
//           </DropdownMenuContent>
//         </DropdownMenu>
//         {/* Upload */}
//         <Link to="/client/about">
//           <Button
//             variant="ghost"
//             size="icon"
//             className="rounded-xl p-2 transition-colors hover:bg-muted"
//           >
//             <CircleAlert className="w-5 h-5" />
//           </Button>
//         </Link>
//       </div>