package com.moe.socialnetwork.auth.controllers;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.moe.socialnetwork.api.services.IEmailService;
import com.moe.socialnetwork.auth.dtos.RQChangePasswordDTO;
import com.moe.socialnetwork.auth.dtos.RQLoginDTO;
import com.moe.socialnetwork.auth.dtos.RPLoginDTO;
import com.moe.socialnetwork.auth.dtos.RQLoginWithGoogleDTO;
import com.moe.socialnetwork.auth.dtos.RQRegisterDTO;
import com.moe.socialnetwork.auth.dtos.RQPasswordResetRequestDTO;
import com.moe.socialnetwork.auth.dtos.RQPasswordResetDTO;
import com.moe.socialnetwork.auth.dtos.RPUserRegisterDTO;
import com.moe.socialnetwork.auth.services.IAuthService;
import com.moe.socialnetwork.auth.services.ITokenService;
import com.moe.socialnetwork.models.User;
import com.moe.socialnetwork.response.ResponseAPI;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

/**
 * Author: nhutnm379
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final IAuthService authService;
    private final ITokenService tokenService;
    private final IEmailService emailService;

    @Value("${app.expiration24h}")
    private Long jwtExpirationMs;

    @Value("${app.expiration6months}")
    private Long jwtExpirationMs2;

    public AuthController(IAuthService authService, ITokenService tokenService, IEmailService emailService) {
        this.authService = authService;
        this.tokenService = tokenService;
        this.emailService = emailService;
    }

    @PostMapping("/register")
    public ResponseEntity<ResponseAPI<RPUserRegisterDTO>> register(
            @RequestBody @Valid RQRegisterDTO request) {
        RPUserRegisterDTO registeredUser = authService.register(request);
        return ResponseEntity.ok(ResponseAPI.of(HttpStatus.OK.value(), "Success", registeredUser));
    }

    @PostMapping("/login")
    public ResponseEntity<ResponseAPI<RPLoginDTO>> login(@RequestBody @Valid RQLoginDTO request) {
        RPLoginDTO login = authService.login(request);
        return buildLoginResponse(login);
    }

    @PostMapping("/google-login")
    public ResponseEntity<ResponseAPI<RPLoginDTO>> loginWithGoogle(
            @RequestBody @Valid RQLoginWithGoogleDTO request) {
        RPLoginDTO login = authService.loginWithGoogle(request.getToken());
        return buildLoginResponse(login);
    }

    @PutMapping("/change-password")
    public ResponseEntity<ResponseAPI<String>> changePassword(@AuthenticationPrincipal User user,
            @RequestBody @Valid RQChangePasswordDTO request) {
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ResponseAPI.error(HttpStatus.UNAUTHORIZED.value(), "User is not authenticated", null));
        }

        authService.validateNewPassword(request.getNewPassword(), request.getConfirmNewPassword());
        authService.changePassword(user, request.getNewPassword());

        return ResponseEntity.ok(ResponseAPI.of(HttpStatus.OK.value(), "Password changed successfully",
                "Password updated for user: " + user.getUsername()));
    }

    @PostMapping("/password-reset-request")
    public ResponseEntity<ResponseAPI<String>> passwordResetRequest(
            @RequestBody @Valid RQPasswordResetRequestDTO request) {
        User user = authService.findByEmail(request.getEmail());
        String resetToken = tokenService.generatePasswordResetToken(user);
        emailService.sendPasswordResetEmail(user.getEmail(), resetToken);

        return ResponseEntity.ok(ResponseAPI.of(HttpStatus.OK.value(),
                "Password reset email sent successfully. Please check your email!", "Success"));
    }

    @PostMapping("/password-reset")
    public ResponseEntity<ResponseAPI<String>> passwordReset(@RequestBody @Valid RQPasswordResetDTO request) {
        User user = authService.findByResetToken(request.getToken());

        if (!tokenService.validatePasswordResetToken(user, request.getToken())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ResponseAPI.error(HttpStatus.UNAUTHORIZED.value(), "Invalid or expired reset token", null));
        }

        authService.validateNewPassword(request.getNewPassword(), request.getConfirmNewPassword());
        authService.updatePassword(user, request.getNewPassword());

        return ResponseEntity.ok(ResponseAPI.of(HttpStatus.OK.value(), "Success", null));
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<ResponseAPI<String>> refreshAccessToken(HttpServletRequest httpRequest) {
        int maxAgeAccessToken = (int) (jwtExpirationMs / 1000);

        // B1: Lấy refresh token từ cookie
        String reToken = tokenService.extractRefreshTokenFromCookie(httpRequest);

        // B2: Kiểm tra token
        if (reToken == null || !tokenService.validateJwtToken(reToken)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ResponseAPI.error(HttpStatus.UNAUTHORIZED.value(), "Invalid or expired refresh token", null));
        }

        // B3: Lấy user
        String email = tokenService.getEmailFromJwtToken(reToken);
        User user = authService.findByEmail(email);

        // B4: Tạo access token mới
        String newAccessToken = tokenService.generateJwtToken(user);
        ResponseCookie accessCookie = ResponseCookie.from("access_token", newAccessToken)
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(maxAgeAccessToken)
                .sameSite("Strict") // hoặc "Lax" nếu redirect từ bên ngoài
                .build();

        // B5: Trả về cookie và access token mới
        return ResponseEntity
                .ok()
                .header(HttpHeaders.SET_COOKIE, accessCookie.toString())
                .body(ResponseAPI.of(HttpStatus.OK.value(), "Success", newAccessToken));
    }

    @PostMapping("/logout")
    public ResponseEntity<ResponseAPI<String>> logout(@AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ResponseAPI.error(HttpStatus.UNAUTHORIZED.value(), "User is not authenticated", null));
        }

        authService.logOut(user);

        ResponseCookie deleteAccessCookie = ResponseCookie.from("access_token", "")
                .httpOnly(true)
                .secure(true)
                .path("/")
                .sameSite("Strict")
                .maxAge(0)
                .build();

        ResponseCookie deleteRefreshCookie = ResponseCookie.from("refresh_token", "")
                .httpOnly(true)
                .secure(true)
                .path("/")
                .sameSite("Strict")
                .maxAge(0)
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, deleteAccessCookie.toString(), deleteRefreshCookie.toString())
                .body(ResponseAPI.of(HttpStatus.OK.value(), "Success", null));
    }

    private ResponseEntity<ResponseAPI<RPLoginDTO>> buildLoginResponse(RPLoginDTO login) {
        int maxAgeAccessToken = (int) (jwtExpirationMs / 1000);
        int maxAgeRefreshToken = (int) (jwtExpirationMs2 / 1000);

        ResponseCookie refreshCookie = ResponseCookie.from("refresh_token", login.getRefreshToken())
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(maxAgeRefreshToken)
                .sameSite("Strict")
                .build();

        ResponseCookie accessCookie = ResponseCookie.from("access_token", login.getAccessToken())
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(maxAgeAccessToken)
                .sameSite("Strict")
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, accessCookie.toString(), refreshCookie.toString())
                .body(ResponseAPI.of(HttpStatus.OK.value(), "Success", login));
    }
}