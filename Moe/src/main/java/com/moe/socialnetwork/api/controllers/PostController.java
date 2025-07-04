package com.moe.socialnetwork.api.controllers;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.moe.socialnetwork.api.dtos.ZRQCodeDto;
import com.moe.socialnetwork.api.dtos.ZRQFilterPageDTO;
import com.moe.socialnetwork.api.dtos.RQKeyWordPageSizeDTO;
import com.moe.socialnetwork.api.dtos.RQPostCreateDTO;
import com.moe.socialnetwork.api.dtos.ZRPPageDTO;
import com.moe.socialnetwork.api.dtos.RPPostResponseDTO;
import com.moe.socialnetwork.api.dtos.RPPostSearchDTO;
import com.moe.socialnetwork.api.services.IPostService;
import com.moe.socialnetwork.models.User;
import com.moe.socialnetwork.response.ResponseAPI;

import jakarta.validation.Valid;

/**
 * Author: nhutnm379
 */
@RestController
@RequestMapping("/api/post")
public class PostController {
    private final IPostService postService;
    // private final PostCreationProducer postCreationProducer;

    public PostController(IPostService postService) {
        this.postService = postService;
    };

    @PostMapping("/delete")
    public ResponseEntity<ResponseAPI<Void>> deletePost(
            @RequestBody ZRQCodeDto postCode,
            @AuthenticationPrincipal User user) {

        postService.deletePost(UUID.fromString(postCode.getCode()), user);

        ResponseAPI<Void> response = new ResponseAPI<>();
        response.setCode(HttpStatus.OK.value());
        response.setMessage("Post delete successfully!");
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @GetMapping("/search")
    public ResponseEntity<ResponseAPI<ZRPPageDTO<RPPostSearchDTO>>> searchPosts(
            @ModelAttribute ZRQFilterPageDTO request) {

        ResponseAPI<ZRPPageDTO<RPPostSearchDTO>> response = new ResponseAPI<>();
        ZRPPageDTO<RPPostSearchDTO> posts = postService.searchPosts(
                request.getKeyWord(),
                request.getPage(),
                request.getSize(),
                request.getSort());

        response.setCode(HttpStatus.OK.value());
        response.setMessage("Search completed successfully!");
        response.setData(posts);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/get-post-by-code")
    public ResponseEntity<ResponseAPI<RPPostResponseDTO>> getPostByCode(
            @RequestBody ZRQCodeDto postCode,
            @AuthenticationPrincipal User user) {
        ResponseAPI<RPPostResponseDTO> response = new ResponseAPI<>();
        RPPostResponseDTO post = postService.getPostByCode(postCode.getCode(), user);
        response.setCode(HttpStatus.OK.value());
        response.setMessage("Post retrieved successfully!");
        response.setData(post);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @PostMapping("/view")
    public ResponseEntity<ResponseAPI<Void>> viewPost(
            @RequestBody ZRQCodeDto postCode,
            @AuthenticationPrincipal User user) {

        postService.viewPost(postCode.getCode(), user);

        ResponseAPI<Void> response = new ResponseAPI<>();
        response.setCode(HttpStatus.OK.value());
        response.setMessage("Post viewed successfully!");
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @PostMapping("/like")
    public ResponseEntity<ResponseAPI<Void>> likePost(
            @RequestBody ZRQCodeDto postCode,
            @AuthenticationPrincipal User user) {

        postService.likePost(postCode.getCode(), user);

        ResponseAPI<Void> response = new ResponseAPI<>();
        response.setCode(HttpStatus.OK.value());
        response.setMessage("Post liked successfully!");
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @GetMapping("/get-post")
    public ResponseEntity<ResponseAPI<List<RPPostResponseDTO>>> getPost(
            @AuthenticationPrincipal User user) {

        ResponseAPI<List<RPPostResponseDTO>> response = new ResponseAPI<>();

        List<RPPostResponseDTO> posts = postService.getPostList(user);
        response.setCode(HttpStatus.OK.value());
        response.setMessage("Successful!");
        response.setData(posts);
        return ResponseEntity.status(HttpStatus.OK).body(response);

    }

    @PostMapping("/create-new-post")
    public ResponseEntity<ResponseAPI<String>> createNewPost(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody RQPostCreateDTO dto) {

        postService.createNewPost(dto, user);

        ResponseAPI<String> response = new ResponseAPI<>();
        response.setCode(HttpStatus.ACCEPTED.value());
        response.setMessage("Post is being processed");
        response.setData("Please wait...");

        return ResponseEntity.status(HttpStatus.ACCEPTED).body(response);
    }
}
