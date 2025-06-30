package com.moe.socialnetwork.api.controllers;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.moe.socialnetwork.api.dtos.CodeDto;
import com.moe.socialnetwork.api.dtos.CodePageSize;
import com.moe.socialnetwork.api.dtos.KeyWordPageSize;
import com.moe.socialnetwork.api.dtos.PostCreateRepuestDTO;
import com.moe.socialnetwork.api.dtos.PostResponseDTO;
import com.moe.socialnetwork.api.dtos.PostSearchResponseDTO;
import com.moe.socialnetwork.api.queue.post.PostCreationMessage;
import com.moe.socialnetwork.api.services.IPostService;
import com.moe.socialnetwork.api.queue.post.PostCreationProducer;
import com.moe.socialnetwork.common.models.User;
import com.moe.socialnetwork.common.response.ResponseAPI;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/post")
public class PostController {
    private final IPostService postService;
    private final PostCreationProducer postCreationProducer;

    public PostController(IPostService postService, PostCreationProducer postCreationProducer) {
        this.postService = postService;
        this.postCreationProducer = postCreationProducer;
    };
   @PostMapping("/delete")
    public ResponseEntity<ResponseAPI<Void>> deletePost(
            @RequestBody CodeDto postCode,
            @AuthenticationPrincipal User user) {

        postService.deletePost(UUID.fromString(postCode.getCode()), user);

        ResponseAPI<Void> response = new ResponseAPI<>();
        response.setCode(HttpStatus.OK.value());
        response.setMessage("Post delete successfully!");
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }


    @PostMapping("/search")
    public ResponseEntity<ResponseAPI<List<PostSearchResponseDTO>>> searchPosts(
            @RequestBody KeyWordPageSize keyPageSize) {

        ResponseAPI<List<PostSearchResponseDTO>> response = new ResponseAPI<>();
        List<PostSearchResponseDTO> posts = postService.searchPosts(keyPageSize.getKeyWord(), keyPageSize.getPage(),
                keyPageSize.getSize());
        response.setCode(HttpStatus.OK.value());
        response.setMessage("Search completed successfully!");
        response.setData(posts);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @PostMapping("/get-post-by-code")
    public ResponseEntity<ResponseAPI<PostResponseDTO>> getPostByCode(
            @RequestBody CodeDto postCode,
            @AuthenticationPrincipal User user) {
        ResponseAPI<PostResponseDTO> response = new ResponseAPI<>();
        PostResponseDTO post = postService.getPostByCode(postCode.getCode(), user);
        response.setCode(HttpStatus.OK.value());
        response.setMessage("Post retrieved successfully!");
        response.setData(post);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @PostMapping("/view")
    public ResponseEntity<ResponseAPI<Void>> viewPost(
            @RequestBody CodeDto postCode,
            @AuthenticationPrincipal User user) {

        postService.viewPost(postCode.getCode(), user);

        ResponseAPI<Void> response = new ResponseAPI<>();
        response.setCode(HttpStatus.OK.value());
        response.setMessage("Post viewed successfully!");
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @PostMapping("/like")
    public ResponseEntity<ResponseAPI<Void>> likePost(
            @RequestBody CodeDto postCode,
            @AuthenticationPrincipal User user) {

        postService.likePost(postCode.getCode(), user);

        ResponseAPI<Void> response = new ResponseAPI<>();
        response.setCode(HttpStatus.OK.value());
        response.setMessage("Post liked successfully!");
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @GetMapping("/get-post")
    public ResponseEntity<ResponseAPI<List<PostResponseDTO>>> getPost(
            @AuthenticationPrincipal User user) {

        ResponseAPI<List<PostResponseDTO>> response = new ResponseAPI<>();

        List<PostResponseDTO> posts = postService.getPostList(user);
        response.setCode(HttpStatus.OK.value());
        response.setMessage("Successful!");
        response.setData(posts);
        return ResponseEntity.status(HttpStatus.OK).body(response);

    }

    @PostMapping("/create-new-post")
    public ResponseEntity<ResponseAPI<String>> createNewPost(
            @AuthenticationPrincipal User user,
            @RequestBody @Valid PostCreateRepuestDTO dto) {

        PostCreationMessage job = new PostCreationMessage(user, dto);
        postCreationProducer.enqueue(job); // Đẩy vào hàng đợi

        ResponseAPI<String> response = new ResponseAPI<>();
        response.setCode(HttpStatus.ACCEPTED.value());
        response.setMessage("Post has been queued for creation.");
        response.setData("Please wait...");

        return ResponseEntity.status(HttpStatus.ACCEPTED).body(response);
    }
}
