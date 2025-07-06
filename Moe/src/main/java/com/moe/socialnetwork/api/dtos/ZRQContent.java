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
public class ZRQContent {
    @NotBlank(message = "Content must not be blank")
    private String content;
}
