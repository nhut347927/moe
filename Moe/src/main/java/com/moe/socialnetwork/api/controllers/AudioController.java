package com.moe.socialnetwork.api.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.moe.socialnetwork.api.dtos.RPPostDTO;
import com.moe.socialnetwork.api.dtos.ZRPPageDTO;
import com.moe.socialnetwork.api.dtos.ZRQFilterPageDTO;
import com.moe.socialnetwork.api.services.IAudioService;
import com.moe.socialnetwork.models.User;
import com.moe.socialnetwork.response.ResponseAPI;

import jakarta.validation.Valid;

/**
 * Author: nhutnm379
 */
@RestController
@RequestMapping("/api/audios")
public class AudioController {

    private final IAudioService iAudioService;

    public AudioController(IAudioService iAudioService) {
        this.iAudioService = iAudioService;
    }

    @GetMapping("posts-by-audio")
    public ResponseEntity<ResponseAPI<ZRPPageDTO<RPPostDTO>>> getPostsByAudio(
            @Valid @ModelAttribute ZRQFilterPageDTO request,
            @AuthenticationPrincipal User user) {

        ZRPPageDTO<RPPostDTO> data = iAudioService.getPostUseAudio(
                user,
                request.getCode(),
                request.getPage(),
                request.getSize(),
                request.getSort());

        ResponseAPI<ZRPPageDTO<RPPostDTO>> response = new ResponseAPI<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(data);

        return ResponseEntity.ok(response);
    }
}
