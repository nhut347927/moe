package com.moe.socialnetwork.api.controllers;


import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.moe.socialnetwork.api.dtos.RPActivityLogDTO;
import com.moe.socialnetwork.api.dtos.ZRPPageDTO;
import com.moe.socialnetwork.api.dtos.ZRQFilterPageDTO;
import com.moe.socialnetwork.api.services.IActivityLogService;
import com.moe.socialnetwork.auth.active.UserActivity;
import com.moe.socialnetwork.auth.active.UserActivityContextService;
import com.moe.socialnetwork.models.User;
import com.moe.socialnetwork.response.ResponseAPI;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/logs")
public class ActivityLogController {
    private final IActivityLogService userActivityService;
    private final UserActivityContextService userActivityContextService;

    public ActivityLogController(
            IActivityLogService userActivityService,
            UserActivityContextService userActivityContextService) {
        this.userActivityService = userActivityService;
        this.userActivityContextService = userActivityContextService;
    }

    @GetMapping("/active-users")
    public ResponseEntity<ResponseAPI<ZRPPageDTO<UserActivity>>> getActiveUsers(
            @Valid @ModelAttribute ZRQFilterPageDTO request, @AuthenticationPrincipal User user) {
        ZRPPageDTO<UserActivity> activeUsers = userActivityContextService.getActiveUsers(request.getKeyWord(),
                request.getPage(), request.getSize());
        ResponseAPI<ZRPPageDTO<UserActivity>> response = new ResponseAPI<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(activeUsers);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<ResponseAPI<ZRPPageDTO<RPActivityLogDTO>>> getLog(
            @Valid @ModelAttribute ZRQFilterPageDTO request,
            @AuthenticationPrincipal User user) {

        ZRPPageDTO<RPActivityLogDTO> data = userActivityService.getLog(
                request.getKeyWord(),
                request.getPage(),
                request.getSize(),
                request.getSort());

        ResponseAPI<ZRPPageDTO<RPActivityLogDTO>> response = new ResponseAPI<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(data);

        return ResponseEntity.ok(response);
    }
}
