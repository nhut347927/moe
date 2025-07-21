package com.moe.socialnetwork.api.controllers;

import com.moe.socialnetwork.api.dtos.*;
import com.moe.socialnetwork.api.services.IUserActivityService;
import com.moe.socialnetwork.models.User;
import com.moe.socialnetwork.response.ResponseAPI;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/activity")
public class UserActivityController {

    private final IUserActivityService userActivityService;

    public UserActivityController(IUserActivityService userActivityService) {
        this.userActivityService = userActivityService;
    }

    @GetMapping("/search-history")
    public ResponseEntity<ResponseAPI<ZRPPageDTO<RPKeywordSearchTimeDTO>>> getSearchHistory(
            @Valid @ModelAttribute ZRQFilterPageDTO request,
            @AuthenticationPrincipal User user) {

        ZRPPageDTO<RPKeywordSearchTimeDTO> data = userActivityService.getSearchHistoryByUser(
                user,
                request.getPage(),
                request.getSize(),
                request.getSort()
        );

        ResponseAPI<ZRPPageDTO<RPKeywordSearchTimeDTO>> response = new ResponseAPI<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(data);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/views")
    public ResponseEntity<ResponseAPI<ZRPPageDTO<RPPostDTO>>> getViewedPosts(
            @Valid @ModelAttribute ZRQFilterPageDTO request,
            @AuthenticationPrincipal User user) {

        ZRPPageDTO<RPPostDTO> data = userActivityService.getViewByUser(
                user,
                request.getPage(),
                request.getSize(),
                request.getSort()
        );

        ResponseAPI<ZRPPageDTO<RPPostDTO>> response = new ResponseAPI<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(data);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/likes")
    public ResponseEntity<ResponseAPI<ZRPPageDTO<RPPostDTO>>> getLikedPosts(
            @Valid @ModelAttribute ZRQFilterPageDTO request,
            @AuthenticationPrincipal User user) {

        ZRPPageDTO<RPPostDTO> data = userActivityService.getLikeByUser(
                user,
                request.getPage(),
                request.getSize(),
                request.getSort()
        );

        ResponseAPI<ZRPPageDTO<RPPostDTO>> response = new ResponseAPI<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(data);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/comments")
    public ResponseEntity<ResponseAPI<ZRPPageDTO<RPUserCommentDTO>>> getUserComments(
            @Valid @ModelAttribute ZRQFilterPageDTO request,
            @AuthenticationPrincipal User user) {

        ZRPPageDTO<RPUserCommentDTO> data = userActivityService.getCommentByUser(
                user,
                request.getPage(),
                request.getSize(),
                request.getSort()
        );

        ResponseAPI<ZRPPageDTO<RPUserCommentDTO>> response = new ResponseAPI<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(data);

        return ResponseEntity.ok(response);
    }
}
