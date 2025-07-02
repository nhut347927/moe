package com.moe.socialnetwork.api.dtos;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

/**
 * Author: nhutnm379
 */
@Data
public class RQCodePageSizeDTO {

    @NotNull(message = "Code must not be null.")
    private String code;

    @Min(value = 0, message = "Page must be greater than or equal to 0.")
    private int page = 0;

    @Min(value = 1, message = "Size must be greater than or equal to 1.")
    private int size = 10;
}
