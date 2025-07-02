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
public class RPReplyDTO {
    private String commentCode;
    private String userAvatar;
    private String content;
    private String displayName;
    private String likeCount;
    private boolean isLiked;
    private String createdAt;
    private String userCommentCode;
    private String userCurrentCode;
}