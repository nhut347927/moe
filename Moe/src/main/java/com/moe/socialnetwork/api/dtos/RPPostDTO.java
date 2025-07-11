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
public class RPPostDTO {

    private String userCode;
    private String postCode;
    private String createdAt;

    private String avatarUrl;

    private String postType; // "VID" hoặc "IMG"

    private String videoUrl;
    private String thumbnail;
    private List<String> imageUrls;
    private String title;

    private Boolean isLiked;

    private String audioUrl;

    private List<RPCommentDTO> comments;
}