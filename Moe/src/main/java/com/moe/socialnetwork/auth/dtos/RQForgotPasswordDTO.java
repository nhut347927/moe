package com.moe.socialnetwork.auth.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;
/**
 * Author: nhutnm379
 */
@Data
public class RQForgotPasswordDTO {
  	@Pattern(regexp = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$", message = "Email must be a valid email address.")
	@NotBlank(message = "Email is required.")
	@Size(max = 100, message = "Email must not exceed 100 characters.")
    private String email;
}