export interface PostSearch {
    userCode: string;
    userName: string;
    displayName: string;
    avatarUrl: string;
    postCode: string;
    postType: string;
    videoThumbnail: string;
    mediaUrl: string;
    viewCount: string;
    createAt: string;
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
