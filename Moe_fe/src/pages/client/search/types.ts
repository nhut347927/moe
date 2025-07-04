
export interface RPPostSearchDTO {
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

export interface RPAccountSearchDTO {
  userCode: string;
  userName: string;
  displayName: string;
  avatarUrl: string;
  followerCount: string;
  userCurrentCode: string;
  isFollowed: boolean;
}

export interface ZRPPageDTO<T> {
  contents: T[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface ResponseAPI<T> {
  code: number;
  message: string;
  data: T;
}