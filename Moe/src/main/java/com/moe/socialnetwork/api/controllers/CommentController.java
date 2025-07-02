package com.moe.socialnetwork.api.controllers;

import com.moe.socialnetwork.api.dtos.CommentDTO;
import com.moe.socialnetwork.api.dtos.CodePageSize;
import com.moe.socialnetwork.api.dtos.CreateCommentDto;
import com.moe.socialnetwork.api.dtos.CreateReplyDto;
import com.moe.socialnetwork.api.dtos.ZCodeDto;
import com.moe.socialnetwork.api.dtos.ReplyDTO;
import com.moe.socialnetwork.api.services.ICommentService;
import com.moe.socialnetwork.models.User;
import com.moe.socialnetwork.response.ResponseAPI;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/comment")

public class CommentController {

    private final ICommentService commentService;
    public CommentController(ICommentService commentService) {
        this.commentService = commentService;
    }

    @PostMapping("/comment")
    public ResponseEntity<ResponseAPI<CommentDTO>> createComment(
            @RequestBody @Valid CreateCommentDto request,
            @AuthenticationPrincipal User user) {

        CommentDTO comment = commentService.addComment(UUID.fromString(request.getPostCode()), request.getContent(), user);

        ResponseAPI<CommentDTO> response = new ResponseAPI<>();
        response.setCode(HttpStatus.CREATED.value());
        response.setMessage("Tạo comment thành công");
        response.setData(comment);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    @PostMapping("/reply")
    public ResponseEntity<ResponseAPI<ReplyDTO>> createReply(
            @RequestBody @Valid CreateReplyDto request,
            @AuthenticationPrincipal User user) {

        ReplyDTO reply = commentService.addReply(UUID.fromString(request.getCommentCode()), request.getContent(), user);

        ResponseAPI<ReplyDTO> response = new ResponseAPI<>();
        response.setCode(HttpStatus.CREATED.value());
        response.setMessage("Tạo reply thành công");
        response.setData(reply);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/like")
    public ResponseEntity<ResponseAPI<Void>> likeComment(
            @RequestBody @Valid ZCodeDto request,
            @AuthenticationPrincipal User user) {

        commentService.likeComment(UUID.fromString(request.getCode()), user);

        ResponseAPI<Void> response = new ResponseAPI<>();
        response.setCode(HttpStatus.OK.value());
        response.setMessage("Like comment thành công");
        response.setData(null);

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @PostMapping("/delete")
    public ResponseEntity<ResponseAPI<Void>> deleteComment(
            @RequestBody @Valid ZCodeDto request,
            @AuthenticationPrincipal User user) {

        commentService.deleteComment(UUID.fromString(request.getCode()), user);

        ResponseAPI<Void> response = new ResponseAPI<>();
        response.setCode(HttpStatus.OK.value());
        response.setMessage("Xóa comment thành công");
        response.setData(null);

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @PostMapping("/get-main-comment")
    public ResponseEntity<ResponseAPI<List<CommentDTO>>> getCommentsByPost(
            @RequestBody @Valid CodePageSize request,
            @AuthenticationPrincipal User user) {

        List<CommentDTO> comments = commentService.getCommentsByPost(UUID.fromString(request.getCode()), user, request.getPage(), request.getSize());

        ResponseAPI<List<CommentDTO>> response = new ResponseAPI<>();
        response.setCode(HttpStatus.OK.value());
        response.setMessage("Lấy danh sách comment thành công");
        response.setData(comments);

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @PostMapping("/get-replies")
    public ResponseEntity<ResponseAPI<List<ReplyDTO>>> getRepliesByComment(
            @RequestBody @Valid CodePageSize request,
            @AuthenticationPrincipal User user) {

        List<ReplyDTO> replies = commentService.getRepliesByComment(UUID.fromString(request.getCode()), user, request.getPage(), request.getSize());

        ResponseAPI<List<ReplyDTO>> response = new ResponseAPI<>();
        response.setCode(HttpStatus.OK.value());
        response.setMessage("Lấy danh sách trả lời thành công");
        response.setData(replies);

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }
}
