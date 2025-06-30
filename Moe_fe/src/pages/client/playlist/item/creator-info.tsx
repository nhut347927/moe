import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";

const CreatorInfo: React.FC = () => (
  <div className="flex items-center gap-3">
    <Avatar className="h-10 w-10">
      <AvatarImage src="/placeholder.svg?height=40&width=40" alt="User" />
      <AvatarFallback>UN</AvatarFallback>
    </Avatar>
    <div>
      <p className="font-medium">Nguyễn Văn A</p>
      <Link
        to={"/client/profile"}
        className="text-zinc-500 text-sm hover:underline hover:text-zinc-400"
      >
        @nhutnguyen
      </Link>
    </div>
     <div className="hidden md:flex items-center gap-2">
              <Link to="/client/profile">
                <span  className="text-xs px-3 bg-black text-zinc-100 p-1.5 rounded-md hover:bg-zinc-800/50 transition-all duration-200 ease-in-out">
                  Theo dõi
                </span>
              </Link>
              <Link to="/client/profile">
                <span className="text-xs px-3 bg-white text-zinc-900 p-1.5 rounded-md hover:bg-zinc-50/90 transition-all duration-200 ease-in-out">
                  Nhắn tin
                </span>
              </Link>
            </div>
  </div>
);

export default CreatorInfo;