package com.moe.socialnetwork.api.dtos;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
/**
 * Author: nhutnm379
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ZRQDeleteDTO {
    @NotBlank(message = "Code cannot be blank")
    private String code;
}
