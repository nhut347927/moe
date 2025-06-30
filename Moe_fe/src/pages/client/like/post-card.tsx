// PostCard.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Bookmark, Play, Image } from "lucide-react";
import { cn } from "@/common/utils/utils";
import { Post, LayoutType } from "./types";

interface PostCardProps {
  post: Post;
  layout: LayoutType;
}

export default function PostCard({ post, layout }: PostCardProps) {
  // For list layout
  if (layout === "list") {
    return (
      <Card className="overflow-hidden hover:shadow-md transition-all duration-300 rounded-xl">
        <div className="flex flex-col sm:flex-row">
          <div className="sm:w-1/3 lg:w-1/4">
            <div className="relative aspect-video sm:aspect-square h-full">
              <img
                src={post.image || "/placeholder.svg"}
                alt={post.title}
                className="object-cover w-full h-full"
              />
              <div className="absolute top-2 left-2">
                <Badge className={cn("text-white", post.color)}>
                  {post.category}
                </Badge>
              </div>
              {post.type === "video" && (
                <>
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity">
                    <Play className="h-8 w-8 text-white fill-white" />
                  </div>
                  {post.duration && (
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">
                      {post.duration}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
          <CardContent className="flex-1 p-4">
            <div className="flex items-center gap-2 mb-2">
              <img
                src={post.authorAvatar || "/placeholder.svg"}
                alt={post.author}
                className="w-6 h-6 rounded-full"
              />
              <span className="text-sm text-muted-foreground">{post.author}</span>
              <span className="text-sm text-muted-foreground">•</span>
              <span className="text-sm text-muted-foreground">{post.date}</span>
              <span className="text-sm text-muted-foreground">•</span>
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                {post.type === "video" ? (
                  <Play className="h-3 w-3" />
                ) : (
                  <Image className="h-3 w-3" />
                )}
                {post.type === "video" ? "Video" : "Hình ảnh"}
              </span>
            </div>
            <h3 className="font-semibold text-lg mb-2">{post.title}</h3>
            <p className="text-muted-foreground text-sm mb-4">{post.excerpt}</p>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Heart className="h-4 w-4 fill-primary text-primary" />
                  <span className="text-sm">{post.likes}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{post.comments}</span>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="rounded-xl">
                <Bookmark
                  className={cn(
                    "h-4 w-4",
                    post.saved ? "fill-primary text-primary" : "text-muted-foreground"
                  )}
                />
              </Button>
            </div>
          </CardContent>
        </div>
      </Card>
    );
  }

  // For timeline layout
  if (layout === "timeline") {
    return (
      <Card className="overflow-hidden hover:shadow-md transition-all duration-300 rounded-xl">
        <div className="flex flex-col">
          <div className="relative aspect-video">
            <img
              src={post.image || "/placeholder.svg"}
              alt={post.title}
              className="object-cover w-full h-full"
            />
            <div className="absolute top-2 left-2">
              <Badge className={cn("text-white", post.color)}>
                {post.category}
              </Badge>
            </div>
            {post.type === "video" && (
              <>
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <Play className="h-12 w-12 text-white fill-white opacity-80 hover:opacity-100 transition-opacity" />
                </div>
                {post.duration && (
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">
                    {post.duration}
                  </div>
                )}
              </>
            )}
            {post.featured && (
              <div className="absolute top-2 right-2">
                <Badge variant="outline" className="bg-background/80">
                  Nổi bật
                </Badge>
              </div>
            )}
          </div>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs px-2 py-0.5 rounded bg-muted flex items-center gap-1">
                {post.type === "video" ? (
                  <Play className="h-3 w-3" />
                ) : (
                  <Image className="h-3 w-3" />
                )}
                {post.type === "video" ? "Video" : "Hình ảnh"}
              </span>
            </div>
            <h3 className="font-semibold text-lg mb-2">{post.title}</h3>
            <p className="text-muted-foreground text-sm mb-4">{post.excerpt}</p>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <img
                  src={post.authorAvatar || "/placeholder.svg"}
                  alt={post.author}
                  className="w-6 h-6 rounded-full"
                />
                <span className="text-sm">{post.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4 fill-primary text-primary" />
                <span className="text-sm">{post.likes}</span>
              </div>
            </div>
          </CardContent>
        </div>
      </Card>
    );
  }

  // For masonry and grid layouts
  return (
    <Card
      className={cn(
        "overflow-hidden hover:shadow-md transition-all duration-300 rounded-xl h-full",
        layout === "masonry" && post.size === "large" && "row-span-2"
      )}
    >
      <div className="flex flex-col h-full">
        <div
          className={cn(
            "relative",
            post.size === "small"
              ? "aspect-video"
              : post.size === "medium"
              ? "aspect-[4/3]"
              : "aspect-[3/4]"
          )}
        >
          <img
            src={post.image || "/placeholder.svg"}
            alt={post.title}
            className="object-cover w-full h-full"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

          {post.type === "video" && (
            <>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-16 w-16 rounded-full bg-black/50 flex items-center justify-center">
                  <Play className="h-8 w-8 text-white fill-white ml-1" />
                </div>
              </div>
              {post.duration && (
                <div className="absolute bottom-16 right-4 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">
                  {post.duration}
                </div>
              )}
            </>
          )}

          <div className="absolute top-2 left-2 flex gap-2">
            <Badge className={cn("text-white", post.color)}>
              {post.category}
            </Badge>
            <Badge variant="outline" className="bg-background/80">
              {post.type === "video" ? "Video" : "Hình ảnh"}
            </Badge>
          </div>

          {post.featured && (
            <div className="absolute top-2 right-2">
              <Badge variant="outline" className="bg-background/80">
                Nổi bật
              </Badge>
            </div>
          )}

          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="font-semibold text-lg text-white mb-1">{post.title}</h3>
            {post.size !== "small" && (
              <p className="text-white/80 text-sm line-clamp-2">{post.excerpt}</p>
            )}
          </div>
        </div>
        <CardContent className="p-4 flex-grow">
          <div className="flex items-center gap-2 mb-3">
            <img
              src={post.authorAvatar || "/placeholder.svg"}
              alt={post.author}
              className="w-6 h-6 rounded-full"
            />
            <span className="text-sm text-muted-foreground">{post.author}</span>
            <span className="text-sm text-muted-foreground">•</span>
            <span className="text-sm text-muted-foreground">{post.date}</span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Heart className="h-4 w-4 fill-primary text-primary" />
                <span className="text-sm">{post.likes}</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{post.comments}</span>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="rounded-xl">
              <Bookmark
                className={cn(
                  "h-4 w-4",
                  post.saved ? "fill-primary text-primary" : "text-muted-foreground"
                )}
              />
            </Button>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}