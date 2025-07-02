package com.moe.socialnetwork.api.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
/**
 * Author: nhutnm379
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RPCommentDTO {
    private String commentCode;
    private String userAvatar;
    private String content;
    private String displayName;
    private String createdAt;
    private String likeCount;
    private boolean isLiked;
    private String replyCount;

    private String userCommentCode;
    private String userCurrentCode;

    private List<RPReplyDTO> replies;
}
