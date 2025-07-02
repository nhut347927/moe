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
public class RPPlaylistPostDTO {

    private String postCode;
    private String postType; // "VIDEO" hoặc "IMAGE"
    private String videoUrl;
    private List<String> imageUrls;
    private String thumbnail; // (s)
    private String title;
    private String userName;
    private String userDisplayName;
    private String created;

    private String audioUrl;
    private String audioOwnerAvatar;
    private String audioOwnerDisplayName;
    private String audioCode;

}
