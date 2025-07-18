package com.moe.socialnetwork.api.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.moe.socialnetwork.api.dtos.ZRQCodeAndContentDTO;
import com.moe.socialnetwork.api.dtos.ZRQFilterPageDTO;
import com.moe.socialnetwork.api.dtos.ZRQContent;
import com.moe.socialnetwork.api.dtos.RPTagDTO;
import com.moe.socialnetwork.api.services.ITagService;
import com.moe.socialnetwork.models.User;
import com.moe.socialnetwork.response.ResponseAPI;

import jakarta.validation.Valid;

/**
 * Author: nhutnm379
 */
@RestController
@RequestMapping("/api/tags")
public class TagController {

    private final ITagService tagService;

    public TagController(ITagService tagService) {
        this.tagService = tagService;
    }

    @GetMapping("/by-code")
    public ResponseEntity<ResponseAPI<List<RPTagDTO>>> searchTagsByCode(@ModelAttribute ZRQCodeAndContentDTO request) {
        List<RPTagDTO> tagList = tagService.searchByCode(request.getCode());

        ResponseAPI<List<RPTagDTO>> response = new ResponseAPI<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(tagList);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/search")
    public ResponseEntity<ResponseAPI<List<RPTagDTO>>> searchTags(
            @ModelAttribute ZRQFilterPageDTO request) {

        List<RPTagDTO> tagList = tagService.searchTags(
                request.getKeyWord(),
                request.getPage(),
                request.getSize(),
                request.getSort()
        );

        ResponseAPI<List<RPTagDTO>> response = new ResponseAPI<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(tagList);

        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<ResponseAPI<RPTagDTO>> createTag(
            @RequestBody @Valid ZRQContent request,
            @AuthenticationPrincipal User user) {

        RPTagDTO tag = tagService.addTag(request.getContent(), user);

        ResponseAPI<RPTagDTO> response = new ResponseAPI<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(tag);

        return ResponseEntity.ok(response);
    }
}
