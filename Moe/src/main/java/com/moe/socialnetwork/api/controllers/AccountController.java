package com.moe.socialnetwork.api.controllers;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.moe.socialnetwork.api.dtos.RPAccountDetailDTO;
import com.moe.socialnetwork.api.dtos.RPAccountSearchDTO;
import com.moe.socialnetwork.api.dtos.ZCodeDto;
import com.moe.socialnetwork.api.dtos.RQKeyWordPageSizeDTO;
import com.moe.socialnetwork.api.dtos.RQProfileUpdateDTO;
import com.moe.socialnetwork.api.services.IAccountService;
import com.moe.socialnetwork.models.User;
import com.moe.socialnetwork.response.ResponseAPI;

import jakarta.validation.Valid;
/**
 * Author: nhutnm379
 */
@RestController
@RequestMapping("/api/account")
public class AccountController {
    private final IAccountService accountService;

    public AccountController(IAccountService accountService) {
        this.accountService = accountService;

    }

    @PostMapping("/update-profile")
    public ResponseEntity<ResponseAPI<Void>> updateProfile(
            @RequestBody @Valid RQProfileUpdateDTO dto,
            @AuthenticationPrincipal User userLogin) {

        accountService.updateProfileAccUser(dto.getDisplayName(), dto.getUserName(), dto.getBio(), userLogin);
        ResponseAPI<Void> response = new ResponseAPI<>();
        response.setCode(HttpStatus.OK.value());
        response.setMessage("Profile updated successfully");
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @PostMapping("/update-avatar")
    public ResponseEntity<ResponseAPI<String>> updateAvatar(
            @RequestBody @Valid ZCodeDto request,
            @AuthenticationPrincipal User userLogin) {

        String img =  accountService.updateImgAccUserFromBase64(request.getCode(), userLogin);

        ResponseAPI<String> response = new ResponseAPI<>();
        response.setCode(HttpStatus.OK.value());
        response.setMessage("Avatar updated successfully");
        response.setData(img);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @PostMapping("/search")
    public ResponseEntity<ResponseAPI<List<RPAccountSearchDTO>>> searchUsers(
            @RequestBody RQKeyWordPageSizeDTO keyWordPageSize,
            @AuthenticationPrincipal User userLogin) {
        ResponseAPI<List<RPAccountSearchDTO>> response = new ResponseAPI<>();

        List<RPAccountSearchDTO> searchResults = accountService.searchUsers(
                keyWordPageSize.getKeyWord(), keyWordPageSize.getPage(), keyWordPageSize.getSize(), userLogin);
        response.setCode(HttpStatus.OK.value());
        response.setMessage("Search completed successfully");
        response.setData(searchResults);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @PostMapping("/follow")
    public ResponseEntity<ResponseAPI<Void>> followUser(
            @RequestBody @Valid ZCodeDto code,
            @AuthenticationPrincipal User userLogin) {

        accountService.followUser(UUID.fromString(code.getCode()), userLogin);
        ResponseAPI<Void> response = new ResponseAPI<>();
        response.setCode(HttpStatus.OK.value());
        response.setMessage("Follow/Unfollow action completed successfully");
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @PostMapping("/get-my-account-detail")
    public ResponseEntity<ResponseAPI<RPAccountDetailDTO>> getMyAccountDetail(
            @AuthenticationPrincipal User userLogin) {

        RPAccountDetailDTO accountDetail = accountService.getAccountDetail(userLogin.getCode(), userLogin);
        ResponseAPI<RPAccountDetailDTO> response = new ResponseAPI<>();
        response.setCode(HttpStatus.OK.value());
        response.setMessage("Account detail retrieved successfully");
        response.setData(accountDetail);
        return ResponseEntity.status(HttpStatus.OK).body(response);

    }

    @PostMapping("/get-account-detail")
    public ResponseEntity<ResponseAPI<RPAccountDetailDTO>> getAccountDetail(
            @RequestBody ZCodeDto code,
            @AuthenticationPrincipal User userLogin) {

        RPAccountDetailDTO accountDetail = accountService.getAccountDetail(UUID.fromString(code.getCode()), userLogin);
        ResponseAPI<RPAccountDetailDTO> response = new ResponseAPI<>();
        response.setCode(HttpStatus.OK.value());
        response.setMessage("Account detail retrieved successfully");
        response.setData(accountDetail);
        return ResponseEntity.status(HttpStatus.OK).body(response);

    }
}
