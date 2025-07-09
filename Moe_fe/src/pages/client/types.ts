// types.ts

// -------------------- Common types --------------------
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

// -------------------- Reply & Comment --------------------
export type Reply = {
  commentCode: string;
  avatarUrl: string;
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
  avatarUrl: string;
  content: string;
  displayName: string;
  likeCount: string;
  liked: boolean;
  replyCount: string;
  createdAt: string;

  userCommentCode: string;
  userCurrentCode: string;

  replies: Reply[];
  replyPage: number;
  hasNext: boolean;
  isOpenReply: boolean;
};

// -------------------- Post & Media --------------------
export type Post = {
  userCode: string;
  postCode: string;
  createdAt: string;

  userCurrentCode: string;

  avatarUrl: string;
  userDisplayName: string;
  userName: string;

  postType: "VID" | "IMG";
  videoUrl: string;
  thumbnail: string;
  imageUrls: string[];
  title: string;
  description: string;
  tags: string[];

  likeCount: string;
  commentCount: string;
  isAddPlaylist: boolean;
  isLiked: boolean;

  audioUrl: string;
  audioOwnerAvatar: string;
  audioOwnerDisplayName: string;
  audioCode: string;

  comments: Comment[];
  commentPage: number;
  hasNext: boolean;

  isPlaying: boolean;
};

export interface PostAccount {
  postCode: string;
  postType: "VID" | "IMG";
  mediaUrl: string;
  videoThumbnail: string;
  viewCount: string;
}

// -------------------- Account Detail --------------------
export interface AccountDetail {
  userCode: string;
  userName: string;
  displayName: string;
  bio: string;
  avatarUrl: string;

  follower: string;
  followed: string;
  likeCount: string;

  isFollowing: boolean;

  posts: PostAccount[];

  userAccountCode: string;
  userCurrentCode: string;

  page: number;
  hasNext: boolean;
}
