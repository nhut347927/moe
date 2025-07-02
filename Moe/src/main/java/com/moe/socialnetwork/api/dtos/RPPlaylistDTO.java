package com.moe.socialnetwork.api.dtos;

import lombok.Data;
import java.util.List;
/**
 * Author: nhutnm379
 */
@Data
public class RPPlaylistDTO {
    private String code;
    private String name;
    private String description;
    private Boolean isPublic;
    private String image;
    private List<RPPlaylistPostDTO> posts;
} 
