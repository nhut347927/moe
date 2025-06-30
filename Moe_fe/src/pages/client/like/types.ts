// types.ts
export interface Post {
    id: number;
    title: string;
    excerpt: string;
    image: string;
    type: "image" | "video";
    category: string;
    author: string;
    authorAvatar: string;
    date: string;
    likes: number;
    comments: number;
    saved: boolean;
    featured: boolean;
    color: string;
    size: "small" | "medium" | "large";
    duration?: string; // Chỉ áp dụng cho video
  }
  
  export type LayoutType = "masonry" | "grid" | "list" | "timeline";
  export type FilterType = "all" | "featured" | "saved" | "recent" | "images" | "videos";
  export type SortType = "recent" | "popular" | "oldest";