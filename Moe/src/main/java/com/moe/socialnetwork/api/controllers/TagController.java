package com.moe.socialnetwork.api.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.moe.socialnetwork.api.dtos.ZRQCodeDto;
import com.moe.socialnetwork.api.dtos.RQKeyWordPageSizeDTO;
import com.moe.socialnetwork.api.dtos.RQTagDTO;
import com.moe.socialnetwork.api.dtos.RPTagDTO;
import com.moe.socialnetwork.api.services.ITagService;
import com.moe.socialnetwork.models.User;
import com.moe.socialnetwork.response.ResponseAPI;

import jakarta.validation.Valid;
/**
 * Author: nhutnm379
 */
@RestController
@RequestMapping("/api/tag")
public class TagController {

    private final ITagService tagService;

    public TagController(ITagService tagService) {
        this.tagService = tagService;
    }

    @GetMapping("/search-by-code")
    public ResponseEntity<ResponseAPI<List<RPTagDTO>>> searchTagByCode(@ModelAttribute  ZRQCodeDto request) {
        List<RPTagDTO> tagList = tagService.searchTags(request.getCode());

        ResponseAPI<List<RPTagDTO>> response = new ResponseAPI<>();
        response.setCode(200);
        response.setMessage("Lấy list tag thành công");
        response.setData(tagList);

        return ResponseEntity.status(200).body(response);
    }

    // Phương thức tìm kiếm tag theo keyword ()
    @GetMapping("/search")
    public ResponseEntity<ResponseAPI<List<RPTagDTO>>> searchTags(@ModelAttribute  RQKeyWordPageSizeDTO request) {
        List<RPTagDTO> tagList = tagService.searchTags(request.getKeyWord());

        ResponseAPI<List<RPTagDTO>> response = new ResponseAPI<>();
        response.setCode(200);
        response.setMessage("Tìm kiếm thành công");
        response.setData(tagList);

        return ResponseEntity.status(200).body(response);
    }

    // Phương thức tạo tag mới (POST)
    @PostMapping("/create")
    public ResponseEntity<ResponseAPI<RPTagDTO>> addTag(
            @RequestBody @Valid RQTagDTO request,
            @AuthenticationPrincipal User user) {

        RPTagDTO tag = tagService.addTag(request.getTag(), user);

        ResponseAPI<RPTagDTO> response = new ResponseAPI<>();
        response.setCode(200);
        response.setMessage("Tag được tạo thành công");
        response.setData(tag);

        return ResponseEntity.status(200).body(response);
    }
}
