// types.ts
export type Reply = {
  commentCode: string;
  userAvatar: string;
  content: string;
  displayName: string;
  likeCount: string;
  liked: boolean;
  createdAt: string;

  userCommentCode: string;
  userCurrentCode: string;
};

export type Comment = {
  commentCode: string;
  userAvatar: string;
  content: string;
  displayName: string;
  likeCount: string;
  liked: boolean;
  replyCount: string;
  createdAt: string;
  replies: Reply[];

  userCommentCode: string;
  userCurrentCode: string;
};

export type Post = {
  postId: string;

  userCode: string;
  postCode: string;
  createdAt: string;

  userCurrentCode: string;

  userAvatar: string;
  userDisplayName: string;
  userName: string;

  postType: "VID" | "IMG";
  videoUrl: string;
  imageUrls: string[];
  title: string;
  description: string;
  tags: string[];

  likeCount: string;
  commentCount: string;
  isAddPlaylist: Boolean;
  isLiked: boolean;

  audioUrl: string;
  audioOwnerAvatar: string;
  audioOwnerDisplayName: string;
  audioCode: string;

  comments: Comment[];
  accountDetail?: AccountDetail;

  currentTab: TabType;
  isPlaying: boolean;
  isLoadingComments: boolean;
};

export type TabType = "home" | "cmt" | "acc";

export const commonEmojis = [
  "😊",
  "😂",
  "❤️",
  "👍",
  "🔥",
  "✨",
  "🙌",
  "👏",
  "🎉",
  "🤔",
  "😍",
  "🥰",
  "😎",
  "🤩",
  "👀",
  "💯",
  "🙏",
  "💪",
  "👌",
  "😢",
];

export interface AccountPost {
  postCode: string; // UUID dạng string
  postType: "VID" | "IMG";
  mediaUrl: string;
  videoThumbnail: string;
  viewCount: string;
}

export interface AccountDetail {
  userCode: string; // UUID dạng string
  userName: string;
  displayName: string;
  bio: string;
  avatarUrl: string;
  follower: string; // số người theo dõi
  followed: string; // số người đang theo dõi
  likeCount: string; // tổng lượt like
  isFollowing: boolean; // người dùng hiện tại có đang theo dõi không
  posts: AccountPost[]; // danh sách bài viết

  userAccountCode: string;
  userCurrentCode: string;

  page:Number;          
  hasNext: boolean;    
}
