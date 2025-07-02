package com.moe.socialnetwork.auth.dtos;

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
public class RQLoginWithGoogleDTO {
	@NotBlank(message = "Token is required.")
	private String token;
}
