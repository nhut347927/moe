// LikedPage.tsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Grid3X3, Layout, Rows, Clock } from "lucide-react";
import PostCard from "./post-card";
import { Post, LayoutType, FilterType, SortType } from "./types";

// Dữ liệu mẫu
const LIKED_POSTS: Post[] = [
  {
    id: 1,
    title: "Hoàng hôn trên bãi biển Đà Nẵng",
    excerpt: "Khoảnh khắc hoàng hôn tuyệt đẹp trên bãi biển Mỹ Khê, Đà Nẵng.",
    image: "https://res.cloudinary.com/dwv76nhoy/image/upload/v1739337151/rrspasosi59xmsriilae.png",
    type: "image",
    category: "Du lịch",
    author: "Minh Anh",
    authorAvatar: "https://res.cloudinary.com/dwv76nhoy/image/upload/v1739337151/rrspasosi59xmsriilae.png",
    date: "3 ngày trước",
    likes: 245,
    comments: 32,
    saved: true,
    featured: true,
    color: "bg-amber-500",
    size: "large",
  },
  {
    id: 2,
    title: "Cà phê sáng tạo tại Hà Nội",
    excerpt: "Khám phá những quán cà phê độc đáo và sáng tạo nhất tại thủ đô.",
    image: "https://res.cloudinary.com/dwv76nhoy/image/upload/v1739337151/rrspasosi59xmsriilae.png",
    type: "video",
    duration: "2:45",
    category: "Ẩm thực",
    author: "Hải Đăng",
    authorAvatar: "https://res.cloudinary.com/dwv76nhoy/image/upload/v1739337151/rrspasosi59xmsriilae.png",
    date: "1 tuần trước",
    likes: 189,
    comments: 24,
    saved: false,
    featured: false,
    color: "bg-orange-500",
    size: "medium",
  },
  {
    id: 3,
    title: "Nghệ thuật đường phố Sài Gòn",
    excerpt: "Những tác phẩm nghệ thuật đường phố ấn tượng nhất tại Sài Gòn.",
    image: "https://res.cloudinary.com/dwv76nhoy/image/upload/v1739337151/rrspasosi59xmsriilae.png",
    type: "image",
    category: "Nghệ thuật",
    author: "Thu Hà",
    authorAvatar: "https://res.cloudinary.com/dwv76nhoy/image/upload/v1739337151/rrspasosi59xmsriilae.png",
    date: "2 tuần trước",
    likes: 312,
    comments: 45,
    saved: true,
    featured: true,
    color: "bg-blue-500",
    size: "medium",
  },
  {
    id: 4,
    title: "Âm nhạc đường phố Hội An",
    excerpt: "Trải nghiệm âm nhạc đường phố tại phố cổ Hội An về đêm.",
    image: "https://res.cloudinary.com/dwv76nhoy/image/upload/v1739337151/rrspasosi59xmsriilae.png",
    type: "video",
    duration: "4:12",
    category: "Âm nhạc",
    author: "Quang Minh",
    authorAvatar: "https://res.cloudinary.com/dwv76nhoy/image/upload/v1739337151/rrspasosi59xmsriilae.png",
    date: "3 tuần trước",
    likes: 156,
    comments: 18,
    saved: false,
    featured: false,
    color: "bg-purple-500",
    size: "small",
  },
  {
    id: 5,
    title: "Ẩm thực đường phố Huế",
    excerpt: "Khám phá những món ăn đường phố đặc trưng của cố đô Huế.",
    image: "https://res.cloudinary.com/dwv76nhoy/image/upload/v1739337151/rrspasosi59xmsriilae.png",
    type: "image",
    category: "Ẩm thực",
    author: "Thanh Tâm",
    authorAvatar: "https://res.cloudinary.com/dwv76nhoy/image/upload/v1739337151/rrspasosi59xmsriilae.png",
    date: "1 tháng trước",
    likes: 278,
    comments: 36,
    saved: true,
    featured: false,
    color: "bg-green-500",
    size: "medium",
  },
  {
    id: 6,
    title: "Kiến trúc Pháp tại Hà Nội",
    excerpt: "Khám phá những công trình kiến trúc Pháp còn sót lại tại Hà Nội.",
    image: "https://res.cloudinary.com/dwv76nhoy/image/upload/v1739337151/rrspasosi59xmsriilae.png",
    type: "video",
    duration: "5:30",
    category: "Kiến trúc",
    author: "Minh Tuấn",
    authorAvatar: "https://res.cloudinary.com/dwv76nhoy/image/upload/v1739337151/rrspasosi59xmsriilae.png",
    date: "1 tháng trước",
    likes: 203,
    comments: 27,
    saved: false,
    featured: true,
    color: "bg-red-500",
    size: "small",
  },
  {
    id: 7,
    title: "Làng nghề truyền thống Bắc Ninh",
    excerpt: "Tìm hiểu về những làng nghề truyền thống lâu đời tại Bắc Ninh.",
    image: "https://res.cloudinary.com/dwv76nhoy/image/upload/v1739337151/rrspasosi59xmsriilae.png",
    type: "image",
    category: "Văn hóa",
    author: "Hồng Nhung",
    authorAvatar: "https://res.cloudinary.com/dwv76nhoy/image/upload/v1739337151/rrspasosi59xmsriilae.png",
    date: "2 tháng trước",
    likes: 167,
    comments: 21,
    saved: true,
    featured: false,
    color: "bg-teal-500",
    size: "large",
  },
  {
    id: 8,
    title: "Vườn quốc gia Cúc Phương",
    excerpt: "Khám phá vẻ đẹp hoang sơ của vườn quốc gia Cúc Phương.",
    image: "https://res.cloudinary.com/dwv76nhoy/image/upload/v1739337151/rrspasosi59xmsriilae.png",
    type: "video",
    duration: "3:45",
    category: "Du lịch",
    author: "Anh Tuấn",
    authorAvatar: "https://res.cloudinary.com/dwv76nhoy/image/upload/v1739337151/rrspasosi59xmsriilae.png",
    date: "2 tháng trước",
    likes: 234,
    comments: 29,
    saved: false,
    featured: false,
    color: "bg-emerald-500",
    size: "medium",
  },
];

export default function LikedPage() {
  const [layout, setLayout] = useState<LayoutType>("masonry");
  const [filter, setFilter] = useState<FilterType>("all");
  const [sort, setSort] = useState<SortType>("recent");
  const [posts, setPosts] = useState<Post[]>(LIKED_POSTS);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      let filteredPosts = [...LIKED_POSTS];

      if (filter === "featured") {
        filteredPosts = filteredPosts.filter((post) => post.featured);
      } else if (filter === "saved") {
        filteredPosts = filteredPosts.filter((post) => post.saved);
      } else if (filter === "recent") {
        filteredPosts = filteredPosts.filter(
          (post) => post.date.includes("ngày") || post.date.includes("tuần")
        );
      } else if (filter === "images") {
        filteredPosts = filteredPosts.filter((post) => post.type === "image");
      } else if (filter === "videos") {
        filteredPosts = filteredPosts.filter((post) => post.type === "video");
      }

      if (sort === "recent") {
        // Giả định rằng các bài viết đã được sắp xếp theo thứ tự gần đây nhất
      } else if (sort === "popular") {
        filteredPosts.sort((a, b) => b.likes - a.likes);
      } else if (sort === "oldest") {
        filteredPosts.reverse();
      }

      setPosts(filteredPosts);
      setIsLoading(false);
    }, 500);
  }, [filter, sort]);

  const renderPosts = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-60">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      );
    }

    if (posts.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-60 text-center">
          <div className="text-5xl mb-4">😢</div>
          <h3 className="text-xl font-medium mb-2">Không tìm thấy bài viết</h3>
          <p className="text-muted-foreground">
            Hãy thử thay đổi bộ lọc hoặc thích thêm bài viết
          </p>
        </div>
      );
    }

    switch (layout) {
      case "masonry":
        return (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
            <AnimatePresence>
              {posts.map((post) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="break-inside-avoid mb-4"
                >
                  <PostCard post={post} layout={layout} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        );

      case "grid":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence>
              {posts.map((post) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  <PostCard post={post} layout={layout} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        );

      case "list":
        return (
          <div className="space-y-4">
            <AnimatePresence>
              {posts.map((post) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <PostCard post={post} layout={layout} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        );

      case "timeline":
        return (
          <div className="relative border-l-2 border-muted ml-4 pl-6 space-y-8">
            <AnimatePresence>
              {posts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="relative"
                >
                  <div className="absolute -left-[3.25rem] top-0 h-6 w-6 rounded-full border-2 border-background bg-primary"></div>
                  <div className="text-sm text-muted-foreground mb-2">
                    {post.date}
                  </div>
                  <PostCard post={post} layout={layout} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="h-screen max-h-screen p-2">
      <div className="h-full rounded-3xl overflow-y-auto overflow-x-hidden scroll-but-hidden bg-white/50 dark:bg-zinc-800/70">
          <div className=" mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Bài Viết Đã Thích</h1>
              <p className="text-muted-foreground">
                Khám phá lại những bài viết bạn đã thích
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Tabs
                value={layout}
                onValueChange={(value) => setLayout(value as LayoutType)}
                className="w-auto"
              >
                <TabsList className="bg-muted/60">
                  <TabsTrigger
                    value="masonry"
                    className="data-[state=active]:bg-background rounded-xl"
                  >
                    <Layout className="h-4 w-4 mr-1" />
                    <span className="sr-only sm:not-sr-only sm:inline-block">
                      Masonry
                    </span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="grid"
                    className="data-[state=active]:bg-background rounded-xl"
                  >
                    <Grid3X3 className="h-4 w-4 mr-1" />
                    <span className="sr-only sm:not-sr-only sm:inline-block">
                      Lưới
                    </span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="list"
                    className="data-[state=active]:bg-background rounded-xl"
                  >
                    <Rows className="h-4 w-4 mr-1" />
                    <span className="sr-only sm:not-sr-only sm:inline-block">
                      Danh sách
                    </span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="timeline"
                    className="data-[state=active]:bg-background rounded-xl"
                  >
                    <Clock className="h-4 w-4 mr-1" />
                    <span className="sr-only sm:not-sr-only sm:inline-block">
                      Timeline
                    </span>
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="flex gap-2">
                <select
                  className="bg-muted/60 text-sm rounded-xl px-3 py-2 border-0"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as FilterType)}
                >
                  <option value="all">Tất cả</option>
                  <option value="images">Hình ảnh</option>
                  <option value="videos">Video</option>
                  <option value="featured">Nổi bật</option>
                  <option value="saved">Đã lưu</option>
                  <option value="recent">Gần đây</option>
                </select>

                <select
                  className="bg-muted/60 text-sm rounded-xl px-3 py-2 border-0"
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortType)}
                >
                  <option value="recent">Mới nhất</option>
                  <option value="popular">Phổ biến nhất</option>
                  <option value="oldest">Cũ nhất</option>
                </select>
              </div>
            </div>
          </div>

          {renderPosts()}
        </div>
      </div>
    </div>
  );
}