package com.moe.socialnetwork.api.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
/**
 * Author: nhutnm379
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RPPostSearchDTO {
    private String userCode;
    private String userName;
    private String title;
    private String displayName;
    private String avatarUrl;
    private String postCode;
    private String postType;
    private String videoThumbnail;
    private String mediaUrl;
    private String viewCount;
    private String createAt;
    private String audioCode;
    private String audioPublicId;
}
