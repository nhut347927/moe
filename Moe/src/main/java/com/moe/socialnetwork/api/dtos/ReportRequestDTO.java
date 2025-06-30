package com.moe.socialnetwork.api.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

/**
 * DTO for report request data
 */
@Data
public class ReportRequestDTO {

    @NotBlank(message = "Reason cannot be empty")
    private String reason;

    @NotBlank(message = "Post code cannot be empty")
    private String postCode;
}