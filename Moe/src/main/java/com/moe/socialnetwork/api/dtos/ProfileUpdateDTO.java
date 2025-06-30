package com.moe.socialnetwork.api.dtos;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ProfileUpdateDTO {
    @NotBlank(message = "Display name không được để trống")
    private String displayName;

    @NotBlank(message = "Username không được để trống")
    private String userName;

    private String bio;
}
