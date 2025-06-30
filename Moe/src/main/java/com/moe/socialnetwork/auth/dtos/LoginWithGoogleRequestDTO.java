package com.moe.socialnetwork.auth.dtos;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginWithGoogleRequestDTO {
	@NotBlank(message = "Token is required.")
	private String token;
}
