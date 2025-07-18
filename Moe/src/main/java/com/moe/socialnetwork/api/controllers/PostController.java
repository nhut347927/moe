package com.moe.socialnetwork.api.controllers;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.moe.socialnetwork.api.dtos.ZRQCodeAndContentDTO;
import com.moe.socialnetwork.api.dtos.ZRQFilterPageDTO;
import com.moe.socialnetwork.api.dtos.RQPostCreateDTO;
import com.moe.socialnetwork.api.dtos.ZRPPageDTO;
import com.moe.socialnetwork.api.dtos.RPPostDTO;
import com.moe.socialnetwork.api.dtos.RPPostDetailDTO;
import com.moe.socialnetwork.api.dtos.RPPostSearchDTO;
import com.moe.socialnetwork.api.services.IPostService;
import com.moe.socialnetwork.models.User;
import com.moe.socialnetwork.response.ResponseAPI;

import jakarta.validation.Valid;

/**
 * Author: nhutnm379
 */
@RestController
@RequestMapping("/api/posts")
public class PostController {

    private final IPostService postService;

    public PostController(IPostService postService) {
        this.postService = postService;
    }

    @PostMapping
    public ResponseEntity<ResponseAPI<String>> createPost(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody RQPostCreateDTO dto) {

        postService.createNewPost(dto, user);

        ResponseAPI<String> response = new ResponseAPI<>();
        response.setCode(HttpStatus.ACCEPTED.value());
        response.setMessage("Post is being processed.");
        response.setData("Please wait...");

        return ResponseEntity.status(HttpStatus.ACCEPTED).body(response);
    }

    @GetMapping
    public ResponseEntity<ResponseAPI<List<RPPostDTO>>> getPosts(@AuthenticationPrincipal User user) {
        List<RPPostDTO> posts = postService.getPostList(user);

        ResponseAPI<List<RPPostDTO>> response = new ResponseAPI<>();
        response.setCode(HttpStatus.OK.value());
        response.setMessage("Success");
        response.setData(posts);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/get")
    public ResponseEntity<ResponseAPI<RPPostDetailDTO>> getPostByCode(
            @ModelAttribute @Valid ZRQCodeAndContentDTO request,
            @AuthenticationPrincipal User user) {

        RPPostDetailDTO post = postService.getPostByCode(request.getCode(), user);

        ResponseAPI<RPPostDetailDTO> response = new ResponseAPI<>();
        response.setCode(HttpStatus.OK.value());
        response.setMessage("Success");
        response.setData(post);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/search")
    public ResponseEntity<ResponseAPI<ZRPPageDTO<RPPostSearchDTO>>> searchPosts(
            @ModelAttribute ZRQFilterPageDTO request, @AuthenticationPrincipal User user) {

        ZRPPageDTO<RPPostSearchDTO> posts = postService.searchPosts(
                request.getKeyWord(),
                request.getPage(),
                request.getSize(),
                request.getSort(),user);
                

        ResponseAPI<ZRPPageDTO<RPPostSearchDTO>> response = new ResponseAPI<>();
        response.setCode(HttpStatus.OK.value());
        response.setMessage("Success");
        response.setData(posts);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/view")
    public ResponseEntity<ResponseAPI<Void>> viewPost(
            @RequestBody @Valid ZRQCodeAndContentDTO request,
            @AuthenticationPrincipal User user) {

        postService.viewPost(request.getCode(), user);

        ResponseAPI<Void> response = new ResponseAPI<>();
        response.setCode(HttpStatus.OK.value());
        response.setMessage("Success");

        return ResponseEntity.ok(response);
    }

    @PostMapping("/like")
    public ResponseEntity<ResponseAPI<Void>> likePost(
            @RequestBody @Valid ZRQCodeAndContentDTO request,
            @AuthenticationPrincipal User user) {

        postService.likePost(request.getCode(), user);

        ResponseAPI<Void> response = new ResponseAPI<>();
        response.setCode(HttpStatus.OK.value());
        response.setMessage("Success");

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/delete")
    public ResponseEntity<ResponseAPI<Void>> deletePost(
            @RequestBody @Valid ZRQCodeAndContentDTO request,
            @AuthenticationPrincipal User user) {

        postService.deletePost(UUID.fromString(request.getCode()), user);

        ResponseAPI<Void> response = new ResponseAPI<>();
        response.setCode(HttpStatus.OK.value());
        response.setMessage("Success");

        return ResponseEntity.ok(response);
    }
}
