package com.moe.socialnetwork.api.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

/**
 * Author: nhutnm379
 */
@Data
public class RQReportDTO {

    @NotBlank(message = "Reason cannot be empty")
    private String reason;

    @NotBlank(message = "Post code cannot be empty")
    private String postCode;
}