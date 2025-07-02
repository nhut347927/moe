package com.moe.socialnetwork.api.dtos;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
/**
 * Author: nhutnm379
 */
@Data
public class RQCreateReplyDTO {
     @NotBlank(message = "Code must not be blank.")
    private String commentCode;
    @NotBlank(message = "Content must not be blank.")
    private String content;
}
