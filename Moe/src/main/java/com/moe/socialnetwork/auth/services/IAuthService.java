package com.moe.socialnetwork.auth.services;

import com.moe.socialnetwork.auth.dtos.RQLoginDTO;
import com.moe.socialnetwork.auth.dtos.RPLoginDTO;
import com.moe.socialnetwork.auth.dtos.RQRegisterDTO;
import com.moe.socialnetwork.auth.dtos.RPUserRegisterDTO;
import com.moe.socialnetwork.models.User;
/**
 * Author: nhutnm379
 */
public interface IAuthService {

	RPUserRegisterDTO register(RQRegisterDTO request);

	RPLoginDTO login(RQLoginDTO request);

	RPLoginDTO loginWithGoogle(String token);

	void changePassword(User user, String newPassword);

	void updateProfile(User user, String newBio, String newProfilePictureUrl);

	void logOut(User user);

	boolean validateNewPassword(String newPassword, String confirmNewPassword);

	User findByEmail(String email);

	User findByResetToken(String token);

	void updatePassword(User user, String newPassword);

	String refreshAccessToken(String refreshToken);
}
