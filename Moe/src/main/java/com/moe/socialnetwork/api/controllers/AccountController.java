package com.moe.socialnetwork.api.controllers;

import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.moe.socialnetwork.api.dtos.RPAccountDetailDTO;
import com.moe.socialnetwork.api.dtos.RPAccountSearchDTO;
import com.moe.socialnetwork.api.dtos.ZRQCodeAndContentDTO;
import com.moe.socialnetwork.api.dtos.ZRQFilterPageDTO;
import com.moe.socialnetwork.api.dtos.RQProfileUpdateDTO;
import com.moe.socialnetwork.api.dtos.ZRPPageDTO;
import com.moe.socialnetwork.api.services.IAccountService;
import com.moe.socialnetwork.models.User;
import com.moe.socialnetwork.response.ResponseAPI;

import jakarta.validation.Valid;

/**
 * Author: nhutnm379
 */
@RestController
@RequestMapping("/api/accounts")
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
        response.setMessage("Success");
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @PostMapping("/update-avatar")
    public ResponseEntity<ResponseAPI<String>> updateAvatar(
            @RequestBody @Valid ZRQCodeAndContentDTO request,
            @AuthenticationPrincipal User userLogin) {

        String img = accountService.updateImgAccUserFromBase64(request.getCode(), userLogin);

        ResponseAPI<String> response = new ResponseAPI<>();
        response.setCode(HttpStatus.OK.value());
        response.setMessage("Success");
        response.setData(img);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @GetMapping("/search")
    public ResponseEntity<ResponseAPI<ZRPPageDTO<RPAccountSearchDTO>>> searchUsers(
            @ModelAttribute ZRQFilterPageDTO request,
            @AuthenticationPrincipal User userLogin) {

        ZRPPageDTO<RPAccountSearchDTO> result = accountService.searchUsers(
                request.getKeyWord(), request.getPage(), request.getSize(), request.getSort(), userLogin);

        ResponseAPI<ZRPPageDTO<RPAccountSearchDTO>> response = new ResponseAPI<>();
        response.setCode(HttpStatus.OK.value());
        response.setMessage("Success");
        response.setData(result);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/follow")
    public ResponseEntity<ResponseAPI<Void>> followUser(
            @RequestBody @Valid ZRQCodeAndContentDTO code,
            @AuthenticationPrincipal User userLogin) {

        accountService.followUser(UUID.fromString(code.getCode()), userLogin);
        ResponseAPI<Void> response = new ResponseAPI<>();
        response.setCode(HttpStatus.OK.value());
        response.setMessage("Success");
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @GetMapping("/me")
    public ResponseEntity<ResponseAPI<RPAccountDetailDTO>> getMyAccountDetail(
            @AuthenticationPrincipal User userLogin) {

        RPAccountDetailDTO accountDetail = accountService.getAccountSummary(userLogin.getCode(), userLogin);
        ResponseAPI<RPAccountDetailDTO> response = new ResponseAPI<>();
        response.setCode(HttpStatus.OK.value());
        response.setMessage("Success");
        response.setData(accountDetail);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @GetMapping("/detail")
    public ResponseEntity<ResponseAPI<RPAccountDetailDTO>> getAccountDetail(
            @ModelAttribute ZRQCodeAndContentDTO code,
            @AuthenticationPrincipal User userLogin) {

        RPAccountDetailDTO accountDetail = accountService.getAccountSummary(UUID.fromString(code.getCode()), userLogin);
        ResponseAPI<RPAccountDetailDTO> response = new ResponseAPI<>();
        response.setCode(HttpStatus.OK.value());
        response.setMessage("Success");
        response.setData(accountDetail);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @GetMapping("/posts")
    public ResponseEntity<ResponseAPI<ZRPPageDTO<RPAccountDetailDTO.RPAccountPostDTO>>> getAccountPosts(
            @ModelAttribute ZRQFilterPageDTO request) {

        UUID userCode = UUID.fromString(request.getCode());
        ZRPPageDTO<RPAccountDetailDTO.RPAccountPostDTO> postPage = accountService.getAccountPosts(
                userCode, request.getPage(), request.getSize(), request.getSort());

        ResponseAPI<ZRPPageDTO<RPAccountDetailDTO.RPAccountPostDTO>> response = new ResponseAPI<>();
        response.setCode(HttpStatus.OK.value());
        response.setMessage("Success");
        response.setData(postPage);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }
}
