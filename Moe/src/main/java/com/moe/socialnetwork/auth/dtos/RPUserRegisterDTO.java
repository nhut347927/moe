package com.moe.socialnetwork.auth.dtos;

import java.util.Set;

import com.moe.socialnetwork.models.User.Gender;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
/**
 * Author: nhutnm379
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RPUserRegisterDTO {
	private Long userId;
	private String email;
	private String userName;
	private String profilePictureUrl;
	private String bio;
	private Gender gender;
	private String provider;
	private Set<String> roles;
}
