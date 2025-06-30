package com.moe.socialnetwork.api.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.moe.socialnetwork.api.dtos.CodeDto;
import com.moe.socialnetwork.api.dtos.KeyWordPageSize;
import com.moe.socialnetwork.api.dtos.TagRequestDTO;
import com.moe.socialnetwork.api.dtos.TagResponseDTO;
import com.moe.socialnetwork.api.services.ITagService;
import com.moe.socialnetwork.models.User;
import com.moe.socialnetwork.response.ResponseAPI;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/tag")
public class TagController {

    private final ITagService tagService;

    public TagController(ITagService tagService) {
        this.tagService = tagService;
    }

    @PostMapping("/search-by-code")
    public ResponseEntity<ResponseAPI<List<TagResponseDTO>>> searchTagByCode(@RequestBody CodeDto request) {
        List<TagResponseDTO> tagList = tagService.searchTags(request.getCode());

        ResponseAPI<List<TagResponseDTO>> response = new ResponseAPI<>();
        response.setCode(200);
        response.setMessage("Lấy list tag thành công");
        response.setData(tagList);

        return ResponseEntity.status(200).body(response);
    }

    // Phương thức tìm kiếm tag theo keyword ()
    @PostMapping("/search")
    public ResponseEntity<ResponseAPI<List<TagResponseDTO>>> searchTags(@RequestBody KeyWordPageSize request) {
        List<TagResponseDTO> tagList = tagService.searchTags(request.getKeyWord());

        ResponseAPI<List<TagResponseDTO>> response = new ResponseAPI<>();
        response.setCode(200);
        response.setMessage("Tìm kiếm thành công");
        response.setData(tagList);

        return ResponseEntity.status(200).body(response);
    }

    // Phương thức tạo tag mới (POST)
    @PostMapping("/create")
    public ResponseEntity<ResponseAPI<TagResponseDTO>> addTag(
            @RequestBody @Valid TagRequestDTO request,
            @AuthenticationPrincipal User user) {

        TagResponseDTO tag = tagService.addTag(request.getTag(), user);

        ResponseAPI<TagResponseDTO> response = new ResponseAPI<>();
        response.setCode(200);
        response.setMessage("Tag được tạo thành công");
        response.setData(tag);

        return ResponseEntity.status(200).body(response);
    }
}
