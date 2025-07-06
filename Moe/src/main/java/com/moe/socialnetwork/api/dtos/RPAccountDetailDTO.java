package com.moe.socialnetwork.api.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

import java.util.List;
/**
 * Author: nhutnm379
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RPAccountDetailDTO {
    private UUID userCode;
    private String userName;
    private String displayName;
    private String avatarUrl;
    private String follower; // 👉 NGƯỜI THEO DÕI (người đang bấm theo dõi)
    private String followed; // 👉 NGƯỜI ĐƯỢC THEO DÕI (người đang được theo dõi)
    private String likeCount; // tổng số lượt like
    private Boolean isFollowing = false; // người đang đăng nhập có theo dõi không
    private String bio;
    private List<RPAccountPostDTO> posts; // danh sách bài viết

    private String userAccountCode;
    private String userCurrentCode;

    @Data
    public static class RPAccountPostDTO {
        private UUID postCode;
        private String postType;
        private String videoThumbnail;
        private String mediaUrl;
        private String viewCount;
    }
}
