package com.moe.socialnetwork.api.services.impl;

import com.moe.socialnetwork.api.dtos.CommentDTO;
import com.moe.socialnetwork.api.dtos.ReplyDTO;
import com.moe.socialnetwork.api.services.ICommentService;
import com.moe.socialnetwork.common.jpa.CommentJpa;
import com.moe.socialnetwork.common.jpa.CommentLikeJpa;
import com.moe.socialnetwork.common.jpa.PostJpa;
import com.moe.socialnetwork.common.models.Comment;
import com.moe.socialnetwork.common.models.CommentLike;
import com.moe.socialnetwork.common.models.Post;
import com.moe.socialnetwork.common.models.User;

import jakarta.transaction.Transactional;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service

public class CommentServiceImpl implements ICommentService {

    private final CommentJpa commentJpa;
    private final PostJpa postJpa;
    private final CommentLikeJpa commentLikeJpa;

    public CommentServiceImpl(CommentJpa commentJpa, PostJpa postJpa, CommentLikeJpa commentLikeJpa) {
        this.commentJpa = commentJpa;
        this.postJpa = postJpa;
        this.commentLikeJpa = commentLikeJpa;
    }

    public CommentDTO addComment(UUID postCode, String content, User user) {
        Post post = postJpa.findPostByPostCode(postCode)
                .orElseThrow(() -> new IllegalArgumentException("Post not found with code: " + postCode));
        Comment comment = new Comment();
        comment.setPost(post);
        comment.setContent(content);
        comment.setUser(user);
        commentJpa.save(comment);

        CommentDTO dto = new CommentDTO();
        dto.setCommentCode(comment.getCode() != null ? comment.getCode().toString() : null);
        dto.setContent(comment.getContent());
        dto.setCreatedAt(comment.getCreatedAt() != null ? comment.getCreatedAt().toString() : null);
        dto.setDisplayName(user.getDisplayName());
        dto.setUserAvatar(user.getAvatar());
        dto.setLikeCount("0");
        dto.setLiked(false);
        dto.setReplies(null);
        dto.setUserCommentCode(user.getCode() != null ? user.getCode().toString() : null);
        dto.setUserCurrentCode(user.getCode() != null ? user.getCode().toString() : null);

        return dto;
    }

    public ReplyDTO addReply(UUID commentCode, String content, User user) {
        Comment parentComment = commentJpa.findCommentByCommentCode(commentCode)
                .orElseThrow(() -> new IllegalArgumentException("Comment not found with code: " + commentCode));
        Comment reply = new Comment();
        reply.setParentComment(parentComment);
        reply.setContent(content);
        reply.setUser(user);
        reply.setPost(parentComment.getPost());
        commentJpa.save(reply);

        ReplyDTO dto = new ReplyDTO();
        dto.setCommentCode(reply.getCode() != null ? reply.getCode().toString() : null);
        dto.setContent(reply.getContent());
        dto.setCreatedAt(reply.getCreatedAt() != null ? reply.getCreatedAt().toString() : null);
        dto.setDisplayName(user.getDisplayName());
        dto.setUserAvatar(user.getAvatar());
        dto.setLikeCount("0");
        dto.setLiked(false);
        dto.setUserCommentCode(user.getCode() != null ? user.getCode().toString() : null);
        dto.setUserCurrentCode(user.getCode() != null ? user.getCode().toString() : null);

        return dto;
    }

    @Transactional
    public void likeComment(UUID commentCode, User user) {
        Comment comment = commentJpa.findCommentByCommentCode(commentCode)
                .orElseThrow(() -> new IllegalArgumentException("Comment not found with code: " + commentCode));

        Optional<CommentLike> existingLike = comment.getCommentLikes()
                .stream()
                .filter(like -> like.getUser().getId().equals(user.getId()))
                .findFirst();

        if (existingLike.isPresent()) {
            // Unlike
            comment.getCommentLikes().remove(existingLike.get());
            commentLikeJpa.delete(existingLike.get());
        } else {
            // Like
            CommentLike newLike = new CommentLike();
            newLike.setUser(user);
            newLike.setComment(comment);
            comment.getCommentLikes().add(newLike);
            commentLikeJpa.save(newLike); // 👈 Thêm dòng này
        }

        // đã đặt cascade = CascadeType.PERSIST và orphanRemoval = true ở entity Comment
        // commentJpa.save(comment);
    }

    public void deleteComment(UUID commentCode, User user) {
        Comment comment = commentJpa.findCommentByCommentCode(commentCode)
                .orElseThrow(() -> new IllegalArgumentException("Comment not found with code: " + commentCode));

        if (!comment.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("You can only delete your own comments.");
        }
        comment.setUserDelete(user);
        comment.softDelete();
        commentJpa.save(comment);
    }

    @Override
    public List<CommentDTO> getCommentsByPost(UUID postCode, User user, int page, int size) {
        PageRequest pageable = PageRequest.of(page, size);

        return commentJpa.findTopLevelCommentsByPostCode(postCode, pageable)
                .stream()
                .map(comment -> {
                    CommentDTO dto = new CommentDTO();
                    dto.setCommentCode(comment.getCode().toString());
                    dto.setContent(comment.getContent());
                    dto.setCreatedAt(comment.getCreatedAt().toString());
                    dto.setDisplayName(comment.getUser().getDisplayName());
                    dto.setUserAvatar(comment.getUser().getAvatar());

                    // Like count dưới dạng chuỗi
                    dto.setLikeCount(String.valueOf(comment.getCommentLikes().size()));

                    // Kiểm tra xem người dùng đã like comment này chưa
                    boolean isLiked = comment.getCommentLikes()
                            .stream()
                            .anyMatch(like -> like.getUser().getId().equals(user.getId()));
                    dto.setLiked(isLiked);
                    // Đếm số reply không bị xoá
                    long replyCount = comment.getReplies()
                            .stream()
                            .filter(reply -> !Boolean.TRUE.equals(reply.getIsDeleted()))
                            .count();
                    dto.setReplyCount(String.valueOf(replyCount));

                    dto.setReplies(null); // Không load replies ở đây

                    // Lưu thông tin userCommentCode và userCurrentCode
                    dto.setUserCommentCode(comment.getUser().getCode().toString());
                    dto.setUserCurrentCode(user.getCode().toString());
                    return dto;
                })
                .collect(Collectors.toList());
    }

    @Override
    public List<ReplyDTO> getRepliesByComment(UUID commentCode, User user, int page, int size) {
        PageRequest pageable = PageRequest.of(page, size);

        return commentJpa.findRepliesByParentCode(commentCode, pageable)
                .stream()
                .map(reply -> {
                    ReplyDTO dto = new ReplyDTO();
                    dto.setCommentCode(reply.getCode().toString());
                    dto.setContent(reply.getContent());
                    dto.setCreatedAt(reply.getCreatedAt().toString());
                    dto.setDisplayName(reply.getUser().getDisplayName());
                    dto.setUserAvatar(reply.getUser().getAvatar());

                    // Like count dưới dạng chuỗi
                    dto.setLikeCount(String.valueOf(reply.getCommentLikes().size()));
                    // Kiểm tra xem người dùng đã like reply này chưa
                    boolean isLiked = reply.getCommentLikes()
                            .stream()
                            .anyMatch(like -> like.getUser().getId().equals(user.getId()));
                    dto.setLiked(isLiked);

                    // Lưu thông tin userCommentCode và userCurrentCode
                    dto.setUserCommentCode(reply.getUser().getCode().toString());
                    dto.setUserCurrentCode(user.getCode().toString());

                    return dto;
                })
                .collect(Collectors.toList());
    }
}
