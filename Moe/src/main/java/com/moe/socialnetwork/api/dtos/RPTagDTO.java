package com.moe.socialnetwork.api.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
/**
 * Author: nhutnm379
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class RPTagDTO {
    private String code;
    private String name;
    private String usageCount;
    private String username;
    private String avatar;
}
