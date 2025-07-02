package com.moe.socialnetwork.api.dtos;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
/**
 * Author: nhutnm379
 */
@Data
public class RQProfileUpdateDTO {
    @NotBlank(message = "Display name không được để trống")
    private String displayName;

    @NotBlank(message = "Username không được để trống")
    private String userName;
    
    @NotBlank(message = "bio không được để trống")
    private String bio;
}
