package com.moe.socialnetwork.api.dtos;

import jakarta.validation.constraints.Min;
import lombok.Data;
/**
 * Author: nhutnm379
 */
@Data
public class RQKeyWordPageSizeDTO {
    private String keyWord;

    @Min(value = 0, message = "Page must be greater than or equal to 0.")
    private int page = 0;

    @Min(value = 1, message = "Size must be greater than or equal to 1.")
    private int size = 10;
}
