package com.moe.socialnetwork.api.controllers;

import com.moe.socialnetwork.api.dtos.RPCommentDTO;
import com.moe.socialnetwork.api.dtos.ZRQCodeAndContentDTO;
import com.moe.socialnetwork.api.dtos.ZRQFilterPageDTO;
import com.moe.socialnetwork.api.dtos.RPReplyDTO;
import com.moe.socialnetwork.api.dtos.ZRPPageDTO;
import com.moe.socialnetwork.api.services.ICommentService;
import com.moe.socialnetwork.models.User;
import com.moe.socialnetwork.response.ResponseAPI;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

/**
 * Author: nhutnm379
 */
@RestController
@RequestMapping("/api/comments")
public class CommentController {

    private final ICommentService commentService;

    public CommentController(ICommentService commentService) {
        this.commentService = commentService;
    }

    @PostMapping
    public ResponseEntity<ResponseAPI<RPCommentDTO>> createComment(
            @RequestBody @Valid ZRQCodeAndContentDTO request,
            @AuthenticationPrincipal User user) {

        RPCommentDTO comment = commentService.addComment(UUID.fromString(request.getCode()), request.getContent(), user);

        ResponseAPI<RPCommentDTO> response = new ResponseAPI<>();
        response.setCode(HttpStatus.CREATED.value());
        response.setMessage("Success");
        response.setData(comment);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/reply")
    public ResponseEntity<ResponseAPI<RPReplyDTO>> createReply(
            @RequestBody @Valid ZRQCodeAndContentDTO request,
            @AuthenticationPrincipal User user) {

        RPReplyDTO reply = commentService.addReply(UUID.fromString(request.getCode()), request.getContent(), user);

        ResponseAPI<RPReplyDTO> response = new ResponseAPI<>();
        response.setCode(HttpStatus.CREATED.value());
        response.setMessage("Success");
        response.setData(reply);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/like")
    public ResponseEntity<ResponseAPI<Void>> likeComment(
            @RequestBody @Valid ZRQCodeAndContentDTO request,
            @AuthenticationPrincipal User user) {

        commentService.likeComment(UUID.fromString(request.getCode()), user);

        ResponseAPI<Void> response = new ResponseAPI<>();
        response.setCode(HttpStatus.OK.value());
        response.setMessage("Success");
        response.setData(null);

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @DeleteMapping("/delete")
    public ResponseEntity<ResponseAPI<Void>> deleteComment(
            @RequestBody @Valid ZRQCodeAndContentDTO request,
            @AuthenticationPrincipal User user) {

        commentService.deleteComment(UUID.fromString(request.getCode()), user);

        ResponseAPI<Void> response = new ResponseAPI<>();
        response.setCode(HttpStatus.OK.value());
        response.setMessage("Success");
        response.setData(null);

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @GetMapping("/comments")
    public ResponseEntity<ResponseAPI<ZRPPageDTO<RPCommentDTO>>> getCommentsByPost(
            @ModelAttribute @Valid ZRQFilterPageDTO request,
            @AuthenticationPrincipal User user) {

        ZRPPageDTO<RPCommentDTO> comments = commentService.getCommentsByPost(UUID.fromString(request.getCode()), user, request.getPage(), request.getSize(), request.getSort());

        ResponseAPI<ZRPPageDTO<RPCommentDTO>> response = new ResponseAPI<>();
        response.setCode(HttpStatus.OK.value());
        response.setMessage("Success");
        response.setData(comments);

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @GetMapping("/replies")
    public ResponseEntity<ResponseAPI<ZRPPageDTO<RPReplyDTO>>> getRepliesByComment(
            @ModelAttribute @Valid ZRQFilterPageDTO request,
            @AuthenticationPrincipal User user) {

        ZRPPageDTO<RPReplyDTO> replies = commentService.getRepliesByComment(UUID.fromString(request.getCode()), user, request.getPage(), request.getSize(),request.getSort());

        ResponseAPI<ZRPPageDTO<RPReplyDTO>> response = new ResponseAPI<>();
        response.setCode(HttpStatus.OK.value());
        response.setMessage("Success");
        response.setData(replies);

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }
}
