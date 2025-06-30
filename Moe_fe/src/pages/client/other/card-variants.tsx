"use client";

import type React from "react";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Heart,
  MessageCircle,
  Bookmark,
  Play,
  Music,
  Clock,
  User,
  UserPlus,
  MoreHorizontal,
  ImageIcon,
  Share2,
  Headphones,
  Calendar,
  CheckCircle2,
  Star,
  Shuffle,
  Plus,
  Eye,
  Award,
} from "lucide-react";
import { cn } from "@/common/utils/utils";

// Dữ liệu mẫu
const SAMPLE_DATA = {
  playlists: [
    {
      id: 1,
      title: "Acoustic Chill",
      description: "Những bản acoustic nhẹ nhàng, thư giãn cho ngày mới",
      cover: "/placeholder.svg?height=300&width=300",
      tracks: 24,
      duration: "1h 45m",
      author: "Minh Anh",
      authorAvatar: "/placeholder.svg?height=40&width=40",
      followers: 1245,
      color: "bg-amber-500",
      tags: ["acoustic", "chill", "relax"],
      lastUpdated: "2 ngày trước",
      featured: true,
      plays: 12500,
    },
    {
      id: 2,
      title: "Indie Vibes",
      description: "Tuyển tập nhạc indie Việt Nam và quốc tế",
      cover: "/placeholder.svg?height=300&width=300",
      tracks: 18,
      duration: "1h 12m",
      author: "Hải Đăng",
      authorAvatar: "/placeholder.svg?height=40&width=40",
      followers: 876,
      color: "bg-blue-500",
      tags: ["indie", "vietnam", "international"],
      lastUpdated: "1 tuần trước",
      featured: false,
      plays: 8700,
    },
    {
      id: 3,
      title: "Coffee House",
      description: "Nhạc nhẹ nhàng cho quán cà phê",
      cover: "/placeholder.svg?height=300&width=300",
      tracks: 32,
      duration: "2h 10m",
      author: "Thu Hà",
      authorAvatar: "/placeholder.svg?height=40&width=40",
      followers: 2134,
      color: "bg-green-500",
      tags: ["coffee", "chill", "acoustic"],
      lastUpdated: "3 ngày trước",
      featured: true,
      plays: 15600,
    },
  ],
  users: [
    {
      id: 1,
      name: "Nguyễn Minh Anh",
      username: "@minhanh",
      bio: "Nhiếp ảnh gia | Nhà sáng tạo nội dung | Yêu âm nhạc và du lịch ✈️",
      avatar: "/placeholder.svg?height=160&width=160",
      coverImage: "/placeholder.svg?height=400&width=800",
      followers: 2453,
      following: 568,
      verified: true,
      location: "Hà Nội, Việt Nam",
      joinedDate: "Tháng 3, 2020",
      website: "minhanh.com",
      featured: true,
      stats: {
        posts: 127,
        playlists: 15,
        likes: 3240,
      },
    },
    {
      id: 2,
      name: "Trần Hải Đăng",
      username: "@haidang",
      bio: "Music producer | DJ | Coffee lover ☕",
      avatar: "/placeholder.svg?height=160&width=160",
      coverImage: "/placeholder.svg?height=400&width=800",
      followers: 1876,
      following: 432,
      verified: false,
      location: "TP. Hồ Chí Minh",
      joinedDate: "Tháng 5, 2021",
      website: "haidang.vn",
      featured: false,
      stats: {
        posts: 85,
        playlists: 32,
        likes: 1560,
      },
    },
    {
      id: 3,
      name: "Phạm Thu Hà",
      username: "@thuha",
      bio: "Travel blogger | Foodie | Photographer 📸",
      avatar: "/placeholder.svg?height=160&width=160",
      coverImage: "/placeholder.svg?height=400&width=800",
      followers: 5432,
      following: 876,
      verified: true,
      location: "Đà Nẵng, Việt Nam",
      joinedDate: "Tháng 1, 2019",
      website: "thuha.blog",
      featured: true,
      stats: {
        posts: 215,
        playlists: 8,
        likes: 4780,
      },
    },
  ],
  posts: [
    {
      id: 1,
      title: "Hoàng hôn trên bãi biển Đà Nẵng",
      excerpt: "Khoảnh khắc hoàng hôn tuyệt đẹp trên bãi biển Mỹ Khê, Đà Nẵng.",
      content:
        "Đà Nẵng luôn là một trong những điểm đến yêu thích của tôi. Mỗi lần ghé thăm, tôi đều không thể bỏ qua cơ hội ngắm hoàng hôn trên bãi biển Mỹ Khê. Hôm nay, tôi may mắn được chứng kiến một trong những hoàng hôn đẹp nhất mà tôi từng thấy...",
      image: "/placeholder.svg?height=400&width=600",
      type: "image",
      category: "Du lịch",
      author: "Minh Anh",
      authorAvatar: "/placeholder.svg?height=40&width=40",
      date: "3 ngày trước",
      likes: 245,
      comments: 32,
      saved: true,
      featured: true,
      color: "bg-amber-500",
      tags: ["du lịch", "đà nẵng", "biển", "hoàng hôn"],
      views: 1250,
      location: "Bãi biển Mỹ Khê, Đà Nẵng",
    },
    {
      id: 2,
      title: "Cà phê sáng tạo tại Hà Nội",
      excerpt:
        "Khám phá những quán cà phê độc đáo và sáng tạo nhất tại thủ đô.",
      content:
        "Hà Nội không chỉ nổi tiếng với cà phê trứng truyền thống mà còn có rất nhiều quán cà phê sáng tạo, độc đáo. Trong video này, tôi sẽ đưa các bạn đi khám phá 5 quán cà phê có concept ấn tượng nhất tại Hà Nội...",
      image: "/placeholder.svg?height=300&width=400",
      type: "video",
      duration: "2:45",
      category: "Ẩm thực",
      author: "Hải Đăng",
      authorAvatar: "/placeholder.svg?height=40&width=40",
      date: "1 tuần trước",
      likes: 189,
      comments: 24,
      saved: false,
      featured: false,
      color: "bg-orange-500",
      tags: ["cà phê", "hà nội", "ẩm thực", "review"],
      views: 3450,
      location: "Hà Nội",
    },
    {
      id: 3,
      title: "Nghệ thuật đường phố Sài Gòn",
      excerpt: "Những tác phẩm nghệ thuật đường phố ấn tượng nhất tại Sài Gòn.",
      content:
        "Nghệ thuật đường phố đang ngày càng phát triển tại Sài Gòn, mang đến những màu sắc mới mẻ cho thành phố năng động này. Trong bài viết này, tôi sẽ giới thiệu với các bạn những tác phẩm graffiti, tranh tường và các tác phẩm nghệ thuật đường phố ấn tượng nhất mà tôi đã khám phá được...",
      image: "/placeholder.svg?height=350&width=500",
      type: "image",
      category: "Nghệ thuật",
      author: "Thu Hà",
      authorAvatar: "/placeholder.svg?height=40&width=40",
      date: "2 tuần trước",
      likes: 312,
      comments: 45,
      saved: true,
      featured: true,
      color: "bg-blue-500",
      tags: ["nghệ thuật", "đường phố", "sài gòn", "graffiti"],
      views: 2780,
      location: "Quận 1, TP. Hồ Chí Minh",
    },
  ],
};

export default function CardVariants() {
  const [activeTab, setActiveTab] = useState("users");

  return (
    <div className="max-h-screen p-2">
      <div className="h-full rounded-3xl overflow-y-auto overflow-x-hidden scroll-but-hidden">
        <h1 className="text-3xl font-bold mb-6">Các biến thể Card</h1>

        <Tabs
          defaultValue="users"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="w-full justify-start mb-6">
            <TabsTrigger value="users" className="rounded-xl">
              <User className="h-4 w-4 mr-2" />
              Người dùng
            </TabsTrigger>
            <TabsTrigger value="posts" className="rounded-xl">
              <ImageIcon className="h-4 w-4 mr-2" />
              Bài đăng
            </TabsTrigger>
            <TabsTrigger value="playlists" className="rounded-xl">
              <Music className="h-4 w-4 mr-2" />
              Playlist
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-8">
            <div>
              <h2 className="text-2xl font-semibold mb-4">
                Thẻ người dùng cơ bản
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {SAMPLE_DATA.users.map((user) => (
                  <UserCardBasic key={user.id} user={user} />
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">
                Thẻ người dùng nổi bật
              </h2>
              <div className="grid grid-cols-1 gap-6">
                {SAMPLE_DATA.users.slice(0, 1).map((user) => (
                  <UserCardFeatured key={user.id} user={user} />
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">
                Thẻ người dùng nhỏ gọn
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {SAMPLE_DATA.users.map((user) => (
                  <UserCardCompact key={user.id} user={user} />
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">
                Thẻ người dùng ngang
              </h2>
              <div className="space-y-4">
                {SAMPLE_DATA.users.map((user) => (
                  <UserCardHorizontal key={user.id} user={user} />
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="posts" className="space-y-8">
            <div>
              <h2 className="text-2xl font-semibold mb-4">
                Thẻ bài đăng cơ bản
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {SAMPLE_DATA.posts.map((post) => (
                  <PostCardBasic key={post.id} post={post} />
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">
                Thẻ bài đăng nổi bật
              </h2>
              <div className="grid grid-cols-1 gap-6">
                {SAMPLE_DATA.posts.slice(0, 1).map((post) => (
                  <PostCardFeatured key={post.id} post={post} />
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">
                Thẻ bài đăng nhỏ gọn
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {SAMPLE_DATA.posts.map((post) => (
                  <PostCardCompact key={post.id} post={post} />
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">
                Thẻ bài đăng ngang
              </h2>
              <div className="space-y-4">
                {SAMPLE_DATA.posts.map((post) => (
                  <PostCardHorizontal key={post.id} post={post} />
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="playlists" className="space-y-8">
            <div>
              <h2 className="text-2xl font-semibold mb-4">
                Thẻ playlist cơ bản
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {SAMPLE_DATA.playlists.map((playlist) => (
                  <PlaylistCardBasic key={playlist.id} playlist={playlist} />
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">
                Thẻ playlist nổi bật
              </h2>
              <div className="grid grid-cols-1 gap-6">
                {SAMPLE_DATA.playlists.slice(0, 1).map((playlist) => (
                  <PlaylistCardFeatured key={playlist.id} playlist={playlist} />
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">
                Thẻ playlist nhỏ gọn
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {SAMPLE_DATA.playlists.map((playlist) => (
                  <PlaylistCardCompact key={playlist.id} playlist={playlist} />
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">
                Thẻ playlist ngang
              </h2>
              <div className="space-y-4">
                {SAMPLE_DATA.playlists.map((playlist) => (
                  <PlaylistCardHorizontal
                    key={playlist.id}
                    playlist={playlist}
                  />
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// USER CARDS

interface UserCardProps {
  user: (typeof SAMPLE_DATA.users)[0];
}

// Thẻ người dùng cơ bản
function UserCardBasic({ user }: UserCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-all duration-300 rounded-xl">
      <div className="relative h-24 bg-gradient-to-r from-primary/30 to-primary/10">
        {user.featured && (
          <div className="absolute top-2 right-2">
            <Badge className="bg-primary text-primary-foreground">
              <Star className="h-3 w-3 mr-1" />
              Nổi bật
            </Badge>
          </div>
        )}
      </div>

      <div className="px-4 pb-4">
        <div className="flex justify-center -mt-12">
          <Avatar className="h-24 w-24 border-4 border-background rounded-xl shadow-md">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
        </div>

        <div className="text-center mt-3">
          <div className="flex items-center justify-center gap-1">
            <h3 className="font-semibold text-lg">{user.name}</h3>
            {user.verified && (
              <CheckCircle2 className="h-4 w-4 text-blue-500 fill-blue-500" />
            )}
          </div>
          <p className="text-sm text-muted-foreground">{user.username}</p>
          <p className="text-sm mt-2 line-clamp-2">{user.bio}</p>
        </div>

        <div className="flex justify-between items-center mt-4 text-sm">
          <div className="text-center">
            <p className="font-semibold">{user.followers.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Người theo dõi</p>
          </div>
          <div className="text-center">
            <p className="font-semibold">{user.stats.posts}</p>
            <p className="text-xs text-muted-foreground">Bài đăng</p>
          </div>
          <div className="text-center">
            <p className="font-semibold">{user.stats.playlists}</p>
            <p className="text-xs text-muted-foreground">Playlist</p>
          </div>
        </div>

        <div className="mt-4">
          <Button className="w-full rounded-xl">
            <UserPlus className="h-4 w-4 mr-2" />
            Theo dõi
          </Button>
        </div>
      </div>
    </Card>
  );
}

// Thẻ người dùng nổi bật
function UserCardFeatured({ user }: UserCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-all duration-300 rounded-xl">
      <div className="relative h-48 md:h-64">
        <img
          src={user.coverImage || "/placeholder.svg"}
          alt={`${user.name} cover`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="flex items-end gap-4">
            <Avatar className="h-24 w-24 border-4 border-white/20 rounded-xl shadow-lg">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="text-2xl">
                {user.name.charAt(0)}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold">{user.name}</h2>
                {user.verified && (
                  <Badge className="bg-blue-500 text-white">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Đã xác thực
                  </Badge>
                )}
              </div>
              <p className="text-white/80">{user.username}</p>
              <p className="text-white/60 text-sm mt-1">{user.location}</p>
            </div>

            <div className="flex gap-2">
              <Button className="rounded-xl bg-white text-black hover:bg-white/90">
                <UserPlus className="h-4 w-4 mr-2" />
                Theo dõi
              </Button>
              <Button
                variant="outline"
                className="rounded-xl border-white/20 bg-black/30 hover:bg-black/40"
              >
                <MessageCircle className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className="flex-1">
            <p className="text-lg">{user.bio}</p>

            <div className="flex flex-wrap gap-4 mt-4">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Tham gia {user.joinedDate}</span>
              </div>
              {user.website && (
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Globe className="h-4 w-4" />
                  <a
                    href={`https://${user.website}`}
                    className="text-primary hover:underline"
                  >
                    {user.website}
                  </a>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-6 md:gap-8">
            <div className="text-center">
              <p className="text-2xl font-bold">
                {user.followers.toLocaleString()}
              </p>
              <p className="text-muted-foreground">Người theo dõi</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">
                {user.following.toLocaleString()}
              </p>
              <p className="text-muted-foreground">Đang theo dõi</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{user.stats.posts}</p>
              <p className="text-muted-foreground">Bài đăng</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Thẻ người dùng nhỏ gọn
function UserCardCompact({ user }: UserCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-all duration-300 rounded-xl">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 rounded-xl">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <h3 className="font-medium text-sm truncate">{user.name}</h3>
              {user.verified && (
                <CheckCircle2 className="h-3 w-3 text-blue-500 flex-shrink-0" />
              )}
            </div>
            <p className="text-xs text-muted-foreground truncate">
              {user.username}
            </p>
          </div>

          <Button size="sm" variant="outline" className="rounded-xl h-8">
            <Plus className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Thẻ người dùng ngang
function UserCardHorizontal({ user }: UserCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-all duration-300 rounded-xl">
      <div className="flex">
        <div className="w-1/4 md:w-1/5 relative">
          <div className="absolute inset-0">
            <img
              src={user.avatar || "/placeholder.svg"}
              alt={user.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/20"></div>
          </div>
        </div>

        <CardContent className="flex-1 p-4 md:p-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-lg">{user.name}</h3>
                {user.verified && (
                  <Badge
                    variant="outline"
                    className="h-5 bg-blue-500/10 text-blue-500 border-blue-500/20"
                  >
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                )}
                {user.featured && (
                  <Badge
                    variant="outline"
                    className="h-5 bg-amber-500/10 text-amber-500 border-amber-500/20"
                  >
                    <Star className="h-3 w-3 mr-1" />
                    Featured
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{user.username}</p>
              <p className="text-sm mt-2 line-clamp-1 md:line-clamp-2">
                {user.bio}
              </p>
            </div>

            <div className="flex items-center gap-4 md:gap-6">
              <div className="text-center">
                <p className="font-semibold">
                  {user.followers.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">Followers</p>
              </div>
              <div className="text-center">
                <p className="font-semibold">{user.stats.posts}</p>
                <p className="text-xs text-muted-foreground">Posts</p>
              </div>
              <Button className="rounded-xl">
                <UserPlus className="h-4 w-4 mr-2" />
                Follow
              </Button>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}

// POST CARDS

interface PostCardProps {
  post: (typeof SAMPLE_DATA.posts)[0];
}

// Thẻ bài đăng cơ bản
function PostCardBasic({ post }: PostCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-all duration-300 rounded-xl">
      <div className="relative aspect-video">
        <img
          src={post.image || "/placeholder.svg"}
          alt={post.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 left-2">
          <Badge className={cn("text-white", post.color)}>
            {post.category}
          </Badge>
        </div>

        {post.type === "video" && (
          <>
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <div className="h-12 w-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Play className="h-6 w-6 text-white fill-white ml-1" />
              </div>
            </div>
            {post.duration && (
              <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">
                {post.duration}
              </div>
            )}
          </>
        )}
      </div>

      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={post.authorAvatar} alt={post.author} />
            <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
          </Avatar>
          <span className="text-sm">{post.author}</span>
          <span className="text-sm text-muted-foreground">•</span>
          <span className="text-sm text-muted-foreground">{post.date}</span>
        </div>

        <h3 className="font-semibold text-lg mb-2">{post.title}</h3>
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
          {post.excerpt}
        </p>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Heart
                className={cn(
                  "h-4 w-4",
                  post.saved && "fill-primary text-primary"
                )}
              />
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
                post.saved && "fill-primary text-primary"
              )}
            />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Thẻ bài đăng nổi bật
function PostCardFeatured({ post }: PostCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-all duration-300 rounded-xl">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-2/3 relative">
          <div className="aspect-video md:aspect-auto md:h-full">
            <img
              src={post.image || "/placeholder.svg"}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="absolute top-4 left-4 flex gap-2">
            <Badge className={cn("text-white", post.color)}>
              {post.category}
            </Badge>
            {post.featured && (
              <Badge className="bg-amber-500 text-white">
                <Award className="h-3 w-3 mr-1" />
                Nổi bật
              </Badge>
            )}
          </div>

          {post.type === "video" && (
            <>
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <div className="h-16 w-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Play className="h-8 w-8 text-white fill-white ml-1" />
                </div>
              </div>
              {post.duration && (
                <div className="absolute bottom-4 right-4 bg-black/70 text-white text-sm px-2 py-1 rounded">
                  {post.duration}
                </div>
              )}
            </>
          )}
        </div>

        <CardContent className="p-6 md:w-1/3 flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <Avatar className="h-8 w-8">
              <AvatarImage src={post.authorAvatar} alt={post.author} />
              <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{post.author}</div>
              <div className="text-xs text-muted-foreground">{post.date}</div>
            </div>
          </div>

          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-3">{post.title}</h2>
            <p className="text-muted-foreground mb-4">{post.excerpt}</p>
            <p className="line-clamp-3 mb-4">{post.content}</p>

            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="bg-muted/50">
                  #{tag}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center mt-auto pt-4 border-t">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Heart
                  className={cn(
                    "h-5 w-5",
                    post.saved && "fill-primary text-primary"
                  )}
                />
                <span>{post.likes}</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle className="h-5 w-5 text-muted-foreground" />
                <span>{post.comments}</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="h-5 w-5 text-muted-foreground" />
                <span>{post.views}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="ghost" size="icon" className="rounded-xl">
                <Bookmark
                  className={cn(
                    "h-5 w-5",
                    post.saved && "fill-primary text-primary"
                  )}
                />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-xl">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}

// Thẻ bài đăng nhỏ gọn
function PostCardCompact({ post }: PostCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-all duration-300 rounded-xl h-full">
      <div className="relative aspect-square">
        <img
          src={post.image || "/placeholder.svg"}
          alt={post.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>

        {post.type === "video" && (
          <>
            <div className="absolute inset-0 flex items-center justify-center">
              <Play className="h-10 w-10 text-white fill-white opacity-80" />
            </div>
            {post.duration && (
              <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">
                {post.duration}
              </div>
            )}
          </>
        )}

        <div className="absolute top-2 left-2">
          <Badge className={cn("text-white", post.color)}>
            {post.category}
          </Badge>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-3">
          <h3 className="font-semibold text-white line-clamp-2 mb-1">
            {post.title}
          </h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar className="h-5 w-5">
                <AvatarImage src={post.authorAvatar} alt={post.author} />
                <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="text-xs text-white/80">{post.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart
                className={cn(
                  "h-4 w-4 text-white",
                  post.saved && "fill-primary"
                )}
              />
              <span className="text-xs text-white/80">{post.likes}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

// Thẻ bài đăng ngang
function PostCardHorizontal({ post }: PostCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-all duration-300 rounded-xl">
      <div className="flex flex-col sm:flex-row">
        <div className="sm:w-1/3 lg:w-1/4 relative">
          <div className="aspect-video sm:aspect-square h-full">
            <img
              src={post.image || "/placeholder.svg"}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="absolute top-2 left-2">
            <Badge className={cn("text-white", post.color)}>
              {post.category}
            </Badge>
          </div>

          {post.type === "video" && (
            <>
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <Play className="h-10 w-10 text-white fill-white opacity-80" />
              </div>
              {post.duration && (
                <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">
                  {post.duration}
                </div>
              )}
            </>
          )}
        </div>

        <CardContent className="flex-1 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={post.authorAvatar} alt={post.author} />
              <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-sm">{post.author}</span>
            <span className="text-sm text-muted-foreground">•</span>
            <span className="text-sm text-muted-foreground">{post.date}</span>
            <span className="text-sm text-muted-foreground">•</span>
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              {post.type === "video" ? (
                <Play className="h-3 w-3" />
              ) : (
                <ImageIcon className="h-3 w-3" />
              )}
              {post.type === "video" ? "Video" : "Hình ảnh"}
            </span>
          </div>

          <h3 className="font-semibold text-lg mb-2">{post.title}</h3>
          <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
            {post.excerpt}
          </p>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Heart
                  className={cn(
                    "h-4 w-4",
                    post.saved && "fill-primary text-primary"
                  )}
                />
                <span className="text-sm">{post.likes}</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{post.comments}</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{post.views}</span>
              </div>
            </div>

            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-xl h-8 w-8"
              >
                <Bookmark
                  className={cn(
                    "h-4 w-4",
                    post.saved && "fill-primary text-primary"
                  )}
                />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-xl h-8 w-8"
              >
                <Share2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-xl h-8 w-8"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}

// PLAYLIST CARDS

interface PlaylistCardProps {
  playlist: (typeof SAMPLE_DATA.playlists)[0];
}

// Thẻ playlist cơ bản
function PlaylistCardBasic({ playlist }: PlaylistCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-all duration-300 rounded-xl h-full">
      <div className="flex flex-col h-full">
        <div className="relative aspect-square">
          <img
            src={playlist.cover || "/placeholder.svg"}
            alt={playlist.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
            <Button
              size="icon"
              className="rounded-full h-12 w-12 bg-primary/90 hover:bg-primary"
            >
              <Play className="h-6 w-6 fill-white text-white" />
            </Button>
          </div>
          <div className="absolute top-2 right-2">
            <Badge className="bg-black/60 hover:bg-black/60 text-white">
              <Music className="h-3 w-3 mr-1" />
              {playlist.tracks} bài
            </Badge>
          </div>
          {playlist.featured && (
            <div className="absolute top-2 left-2">
              <Badge className="bg-amber-500 text-white">
                <Star className="h-3 w-3 mr-1" />
                Nổi bật
              </Badge>
            </div>
          )}
        </div>

        <CardContent className="p-4 flex-grow">
          <h3 className="font-semibold text-lg line-clamp-1">
            {playlist.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mt-1 mb-3">
            {playlist.description}
          </p>

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage
                  src={playlist.authorAvatar}
                  alt={playlist.author}
                />
                <AvatarFallback>{playlist.author.charAt(0)}</AvatarFallback>
              </Avatar>
              <span>{playlist.author}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{playlist.duration}</span>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}

// Thẻ playlist nổi bật
function PlaylistCardFeatured({ playlist }: PlaylistCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-all duration-300 rounded-xl">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/3 relative">
          <div className="aspect-square">
            <img
              src={playlist.cover || "/placeholder.svg"}
              alt={playlist.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="absolute inset-0 bg-gradient-to-br from-black/60 to-transparent flex items-center justify-center">
            <Button
              size="icon"
              className="rounded-full h-16 w-16 bg-white/20 backdrop-blur-sm hover:bg-white/30"
            >
              <Play className="h-8 w-8 fill-white text-white ml-1" />
            </Button>
          </div>

          {playlist.featured && (
            <div className="absolute top-4 left-4">
              <Badge className="bg-amber-500 text-white">
                <Star className="h-3 w-3 mr-1" />
                Nổi bật
              </Badge>
            </div>
          )}

          <div className="absolute bottom-4 left-4">
            <Badge className="bg-black/60 hover:bg-black/60 text-white">
              <Music className="h-3 w-3 mr-1" />
              {playlist.tracks} bài
            </Badge>
          </div>
        </div>

        <CardContent className="p-6 md:w-2/3 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={playlist.authorAvatar}
                  alt={playlist.author}
                />
                <AvatarFallback>{playlist.author.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{playlist.author}</div>
                <div className="text-xs text-muted-foreground">
                  Cập nhật {playlist.lastUpdated}
                </div>
              </div>
            </div>

            <Badge
              variant="outline"
              className={cn("border-none", playlist.color)}
            >
              <Headphones className="h-3 w-3 mr-1" />
              {playlist.plays.toLocaleString()} lượt nghe
            </Badge>
          </div>

          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-2">{playlist.title}</h2>
            <p className="text-muted-foreground mb-4">{playlist.description}</p>

            <div className="flex flex-wrap gap-2 mb-4">
              {playlist.tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="bg-muted/50">
                  #{tag}
                </Badge>
              ))}
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
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
                <span>
                  {playlist.followers.toLocaleString()} người theo dõi
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
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

// Thẻ playlist nhỏ gọn
function PlaylistCardCompact({ playlist }: PlaylistCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-all duration-300 rounded-xl h-full">
      <div className="flex flex-col h-full">
        <div className="relative aspect-square">
          <img
            src={playlist.cover || "/placeholder.svg"}
            alt={playlist.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
            <Play className="h-8 w-8 text-white fill-white" />
          </div>
          {playlist.featured && (
            <div className="absolute top-1 right-1">
              <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
            </div>
          )}
        </div>

        <CardContent className="p-2 flex-grow">
          <h3 className="font-medium text-sm line-clamp-1">{playlist.title}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {playlist.tracks} bài • {playlist.duration}
          </p>
        </CardContent>
      </div>
    </Card>
  );
}

// Thẻ playlist ngang
function PlaylistCardHorizontal({ playlist }: PlaylistCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-all duration-300 rounded-xl">
      <div className="flex">
        <div className="w-24 h-24 relative flex-shrink-0">
          <img
            src={playlist.cover || "/placeholder.svg"}
            alt={playlist.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
            <Play className="h-8 w-8 text-white fill-white" />
          </div>
          {playlist.featured && (
            <div className="absolute top-1 right-1">
              <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
            </div>
          )}
        </div>

        <CardContent className="p-3 flex-grow flex flex-col justify-center">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-semibold line-clamp-1">{playlist.title}</h3>
            <Badge variant="outline" className="h-5 text-xs">
              <Music className="h-3 w-3 mr-1" />
              {playlist.tracks}
            </Badge>
          </div>

          <p className="text-xs text-muted-foreground line-clamp-1 mb-2">
            {playlist.description}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Avatar className="h-4 w-4">
                <AvatarImage
                  src={playlist.authorAvatar}
                  alt={playlist.author}
                />
                <AvatarFallback>{playlist.author.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="text-xs">{playlist.author}</span>
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 rounded-full"
              >
                <MoreHorizontal className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}

// Utility component for Globe icon
function Globe(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="2" x2="22" y1="12" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}
