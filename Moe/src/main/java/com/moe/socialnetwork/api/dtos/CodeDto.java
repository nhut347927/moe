package com.moe.socialnetwork.api.dtos;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
@Data
public class CodeDto {
    @NotBlank(message = "Code must not be blank.")
    private String code;
}
