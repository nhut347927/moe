package com.moe.socialnetwork.api.dtos;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
/**
 * Author: nhutnm379
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RPPostResponseDTO {
    private String postId;
    private String userCode;
    private String postCode;
    private String createdAt;

    private String userAvatar;
    private String userDisplayName;
    private String userName;

    private String postType; // "VID" hoặc "IMG"
    private String videoUrl;
    private List<String> imageUrls;
    private String title;
    private String description;
    private List<String> tags;

    private String likeCount;
    private String commentCount;
    private Boolean isAddPlaylist;
    private Boolean isLiked;

    private String audioUrl;
    private String audioOwnerAvatar;
    private String audioOwnerDisplayName;
    private String audioCode;

    private String userCurrentCode;

    private List<RPCommentDTO> comments;
}