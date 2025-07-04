package com.moe.socialnetwork.api.dtos;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
/**
 * Author: nhutnm379
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ZRQFilterPageDTO {
    private String code;
    private String keyWord;

    @Min(value = 0, message = "Page must be greater than or equal to 0.")
    private Integer page = 0;

    @Min(value = 1, message = "Size must be greater than or equal to 1.")
    private Integer size = 10;

    @Pattern(regexp = "^(desc|asc)$", message = "Sort type must be either 'desc' or 'asc'")
    private String sort = "desc";
}
