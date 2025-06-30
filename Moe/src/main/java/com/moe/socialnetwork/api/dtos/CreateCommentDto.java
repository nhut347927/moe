package com.moe.socialnetwork.api.dtos;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreateCommentDto {
    @NotBlank(message = "Code must not be blank.")
    private String postCode;
    @NotBlank(message = "Content must not be blank.")
    private String content;
}
