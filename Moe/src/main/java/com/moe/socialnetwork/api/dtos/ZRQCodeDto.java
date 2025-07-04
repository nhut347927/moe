package com.moe.socialnetwork.api.dtos;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
/**
 * Author: nhutnm379
 */
@Data
public class ZRQCodeDto {
    @NotBlank(message = "Code must not be blank.")
    private String code;
}
