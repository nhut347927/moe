package com.moe.socialnetwork.api.dtos;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
/**
 * Author: nhutnm379
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class RQTagDTO {
    @NotBlank(message = "Tag must not be blank")
    private String tag;
}
