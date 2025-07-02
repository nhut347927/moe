package com.moe.socialnetwork.api.dtos;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
@Data
public class ZCodeDto {
    @NotBlank(message = "Code must not be blank.")
    private String code;
}
