import { cn } from "@/common/utils/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Clock,
  Headphones,
  MoreHorizontal,
  Music,
  Play,
  Shuffle,
  Star,
  User,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface PlaylistCardProps {
  playlist: {
    cover: string;
    title: string;
    featured: boolean;
    tracks: number;
    author: string;
    authorAvatar: string;
    lastUpdated: string;
    color: string;
    plays: number;
    description: string;
    tags: string[];
    duration: string;
    followers: number;
  };
}

export function PlaylistCardFeatured({ playlist }: PlaylistCardProps) {
  return (
    <Card className="overflow-hidden rounded-3xl transition-shadow duration-300 hover:shadow-lg">
      <div className="flex flex-col md:flex-row group">
        {/* Ảnh đại diện playlist */}
        <div className="md:w-1/3 relative">
          <div className="aspect-square overflow-hidden rounded-t-3xl md:rounded-l-3xl md:rounded-tr-none">
            <img
              src={playlist.cover || "/placeholder.svg"}
              alt={playlist.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>

          {/* Nút play */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/60 to-transparent flex items-center justify-center">
            <Button
              size="icon"
              className="rounded-full h-16 w-16 bg-white/20 backdrop-blur-sm hover:bg-white/30"
            >
              <Play className="h-8 w-8 fill-white text-white ml-1" />
            </Button>
          </div>

          {/* Tag nổi bật */}
          {playlist.featured && (
            <div className="absolute top-4 left-4">
              <Badge className="bg-amber-500 text-white">
                <Star className="h-3 w-3 mr-1" />
                Nổi bật
              </Badge>
            </div>
          )}

          {/* Số bài */}
          <div className="absolute bottom-4 left-4">
            <Badge className="bg-black/60 text-white">
              <Music className="h-3 w-3 mr-1" />
              {playlist.tracks} bài
            </Badge>
          </div>
        </div>

        {/* Nội dung */}
        <CardContent className="p-6 md:w-2/3 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            {/* Tác giả */}
            <div className="flex items-center gap-3">
              <Avatar className="h-9 w-9">
                <AvatarImage src={playlist.authorAvatar} alt={playlist.author} />
                <AvatarFallback>{playlist.author.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{playlist.author}</div>
                <div className="text-xs text-muted-foreground">
                  Cập nhật {playlist.lastUpdated}
                </div>
              </div>
            </div>

            {/* Tổng lượt nghe */}
            <Badge className={cn("rounded-md", playlist.color)}>
              <Headphones className="h-3 w-3 mr-1" />
              {playlist.plays.toLocaleString()} lượt nghe
            </Badge>
          </div>

          <div className="flex-1">
            <h2 className="text-3xl font-bold tracking-tight mb-2">
              {playlist.title}
            </h2>
            <p className="text-muted-foreground mb-4">{playlist.description}</p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {playlist.tags.map((tag, index) => (
                <Badge key={index} className="rounded-md">
                  #{tag}
                </Badge>
              ))}
            </div>

            {/* Metadata */}
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6 flex-wrap">
              <div className="flex items-center gap-1">
                <Music className="h-4 w-4" />
                <span>{playlist.tracks} bài hát</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{playlist.duration}</span>
              </div>
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>{playlist.followers.toLocaleString()} người theo dõi</span>
              </div>
            </div>
          </div>

          {/* Nút hành động */}
          <div className="flex flex-wrap gap-2 mt-auto">
            <Button className="rounded-xl gap-2">
              <Play className="h-4 w-4 fill-current" />
              Phát
            </Button>
            <Button variant="outline" className="rounded-xl gap-2">
              <Shuffle className="h-4 w-4" />
              Trộn bài
            </Button>
            <Button variant="ghost" size="icon" className="rounded-xl">
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
