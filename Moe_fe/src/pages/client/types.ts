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
  imageSelect:number;
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

export interface PostSearch {
  userCode: string;
  userName: string;
  title: string;
  displayName: string;
  avatarUrl: string;
  postCode: string;
  postType: string;
  videoThumbnail?: string;
  mediaUrl: string;
  viewCount: string;
  createAt: string;
  audioCode?: string;
  audioPublicId?: string;
}

export interface AccountSearch {
  userCode: string;
  userName: string;
  displayName: string;
  avatarUrl: string;
  followerCount: string;
  userCurrentCode: string;
  isFollowed: boolean;
}

// TypeScript types for PostCreateRequestDTO and FFmpegMergeParams

export interface FFmpegMergeParams {
  videoPublicId?: string;
  videoCutStart?: number; // >= 0
  videoCutEnd: number; // >= 0.1, required
  audioPublicId?: string;
  audioCutStart?: number; // >= 0
  audioCutEnd?: number; // >= 0.1
  videoVolume?: number; // >= 0, <= 2, default 1.0
  audioVolume?: number; // >= 0, <= 2, default 1.0
  audioOffset?: number; // >= 0, default 0.0
}

export interface PostCreateForm {
  title: string; // required, max 150 chars
  description?: string;
  postType: "VID" | "IMG";
  isUseOtherAudio: boolean;
  videoPublicId?: string;
  videoThumbnail?: number; // >= 0, default 0
  imgPublicIdList?: string[];
  tagCodeList?: string[];
  visibility: "PRIVATE" | "PUBLIC";
  audioCode?: string;
  ffmpegMergeParams?: FFmpegMergeParams;
}

export interface TopSearch {
  keyword: string;
  count: string;
}
