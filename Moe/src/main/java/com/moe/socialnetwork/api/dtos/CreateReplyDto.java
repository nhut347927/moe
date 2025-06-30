package com.moe.socialnetwork.api.dtos;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
@Data
public class CreateReplyDto {
     @NotBlank(message = "Code must not be blank.")
    private String commentCode;
    @NotBlank(message = "Content must not be blank.")
    private String content;
}
