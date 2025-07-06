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
public class RPAccountSearchDTO {
    private String userCode;
    private String userName;
    private String displayName;
    private String avatarUrl;
    private String followerCount; // 👉 NGƯỜI THEO DÕI (người đang theo dõi)
    private String userCurrentCode;
    private Boolean isFollowed;
}
