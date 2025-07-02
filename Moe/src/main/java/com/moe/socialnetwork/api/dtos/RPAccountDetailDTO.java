package com.moe.socialnetwork.api.dtos;

import lombok.Data;
import java.util.UUID;

import java.util.List;
/**
 * Author: nhutnm379
 */
@Data
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
    private List<AccountPostDTO> posts; // danh sách bài viết

    private String userAccountCode;
    private String userCurrentCode;

    @Data
    public static class AccountPostDTO {
        private UUID postCode;
        private String postType;
        private String videoThumbnail;
        private String mediaUrl;
        private String viewCount;
    }
}
