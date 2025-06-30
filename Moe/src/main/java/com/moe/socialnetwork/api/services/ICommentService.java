package com.moe.socialnetwork.api.services;

import com.moe.socialnetwork.api.dtos.CommentDTO;
import com.moe.socialnetwork.api.dtos.ReplyDTO;
import com.moe.socialnetwork.common.models.User;

import java.util.List;
import java.util.UUID;

public interface ICommentService {
    CommentDTO addComment(UUID postCode, String content, User user);
    ReplyDTO addReply(UUID commentCode, String content, User user);
    void likeComment(UUID commentCode, User user);
    void deleteComment(UUID commentCode, User user);
    List<CommentDTO> getCommentsByPost(UUID postCode, User user, int page, int size);
    List<ReplyDTO> getRepliesByComment(UUID commentCode, User user, int page, int size);
}