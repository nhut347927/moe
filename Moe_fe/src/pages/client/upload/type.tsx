// TypeScript types for PostCreateRequestDTO and FFmpegMergeParams

export interface FFmpegMergeParams {
    videoPublicId?: string;
    videoCutStart?: number; // >= 0
    videoCutEnd: number;    // >= 0.1, required
    audioPublicId?: string;
    audioCutStart?: number; // >= 0
    audioCutEnd?: number;   // >= 0.1
    videoVolume?: number;   // >= 0, <= 2, default 1.0
    audioVolume?: number;   // >= 0, <= 2, default 1.0
    audioOffset?: number;   // >= 0, default 0.0
}

export interface PostCreateForm {
    title: string; // required, max 150 chars
    description?: string;
    postType: 'VID' | 'IMG';
    isUseOtherAudio: boolean;
    videoPublicId?: string;
    videoThumbnail?: number; // >= 0, default 0
    imgPublicIdList?: string[];
    tagCodeList?: string[];
    visibility: 'PRIVATE' | 'PUBLIC';
    audioCode?: string;
    ffmpegMergeParams?: FFmpegMergeParams;
}



// (Removed Java class definition. If you need a TypeScript type, define it as an interface below.)

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
    audioCode: string;
    audioPublicId:string;
    title:string;
}
