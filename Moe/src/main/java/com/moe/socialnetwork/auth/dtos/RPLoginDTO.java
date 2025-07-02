package com.moe.socialnetwork.auth.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
/**
 * Author: nhutnm379
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RPLoginDTO {
    private String accessToken;
    private String accessTokenExpiresIn;
    private String refreshToken;
    private String refreshTokenExpiresIn;
    private String provider;
    private RPUserRegisterDTO user;
}
