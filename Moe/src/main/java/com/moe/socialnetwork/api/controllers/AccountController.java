package com.moe.socialnetwork.api.controllers;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.moe.socialnetwork.api.dtos.AccountDetailDTO;
import com.moe.socialnetwork.api.dtos.AccountSearchResponseDTO;
import com.moe.socialnetwork.api.dtos.CodeDto;
import com.moe.socialnetwork.api.dtos.KeyWordPageSize;
import com.moe.socialnetwork.api.dtos.ProfileUpdateDTO;
import com.moe.socialnetwork.api.services.IAccountService;
import com.moe.socialnetwork.common.models.User;
import com.moe.socialnetwork.common.response.ResponseAPI;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/account")
public class AccountController {
    private final IAccountService accountService;

    public AccountController(IAccountService accountService) {
        this.accountService = accountService;

    }

    @PostMapping("/update-profile")
    public ResponseEntity<ResponseAPI<Void>> updateProfile(
            @RequestBody @Valid ProfileUpdateDTO dto,
            @AuthenticationPrincipal User userLogin) {

        accountService.updateProfileAccUser(dto.getDisplayName(), dto.getUserName(), dto.getBio(), userLogin);
        ResponseAPI<Void> response = new ResponseAPI<>();
        response.setCode(HttpStatus.OK.value());
        response.setMessage("Profile updated successfully");
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @PostMapping("/update-avatar")
    public ResponseEntity<ResponseAPI<String>> updateAvatar(
            @RequestBody @Valid CodeDto request,
            @AuthenticationPrincipal User userLogin) {

        String img =  accountService.updateImgAccUserFromBase64(request.getCode(), userLogin);

        ResponseAPI<String> response = new ResponseAPI<>();
        response.setCode(HttpStatus.OK.value());
        response.setMessage("Avatar updated successfully");
        response.setData(img);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @PostMapping("/search")
    public ResponseEntity<ResponseAPI<List<AccountSearchResponseDTO>>> searchUsers(
            @RequestBody KeyWordPageSize keyWordPageSize,
            @AuthenticationPrincipal User userLogin) {
        ResponseAPI<List<AccountSearchResponseDTO>> response = new ResponseAPI<>();

        List<AccountSearchResponseDTO> searchResults = accountService.searchUsers(
                keyWordPageSize.getKeyWord(), keyWordPageSize.getPage(), keyWordPageSize.getSize(), userLogin);
        response.setCode(HttpStatus.OK.value());
        response.setMessage("Search completed successfully");
        response.setData(searchResults);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @PostMapping("/follow")
    public ResponseEntity<ResponseAPI<Void>> followUser(
            @RequestBody @Valid CodeDto code,
            @AuthenticationPrincipal User userLogin) {

        accountService.followUser(UUID.fromString(code.getCode()), userLogin);
        ResponseAPI<Void> response = new ResponseAPI<>();
        response.setCode(HttpStatus.OK.value());
        response.setMessage("Follow/Unfollow action completed successfully");
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @PostMapping("/get-my-account-detail")
    public ResponseEntity<ResponseAPI<AccountDetailDTO>> getMyAccountDetail(
            @AuthenticationPrincipal User userLogin) {

        AccountDetailDTO accountDetail = accountService.getAccountDetail(userLogin.getCode(), userLogin);
        ResponseAPI<AccountDetailDTO> response = new ResponseAPI<>();
        response.setCode(HttpStatus.OK.value());
        response.setMessage("Account detail retrieved successfully");
        response.setData(accountDetail);
        return ResponseEntity.status(HttpStatus.OK).body(response);

    }

    @PostMapping("/get-account-detail")
    public ResponseEntity<ResponseAPI<AccountDetailDTO>> getAccountDetail(
            @RequestBody CodeDto code,
            @AuthenticationPrincipal User userLogin) {

        AccountDetailDTO accountDetail = accountService.getAccountDetail(UUID.fromString(code.getCode()), userLogin);
        ResponseAPI<AccountDetailDTO> response = new ResponseAPI<>();
        response.setCode(HttpStatus.OK.value());
        response.setMessage("Account detail retrieved successfully");
        response.setData(accountDetail);
        return ResponseEntity.status(HttpStatus.OK).body(response);

    }
}
