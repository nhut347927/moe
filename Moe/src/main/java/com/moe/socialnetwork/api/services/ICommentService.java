package com.moe.socialnetwork.api.services;

import com.moe.socialnetwork.api.dtos.RPCommentDTO;
import com.moe.socialnetwork.api.dtos.RPReplyDTO;
import com.moe.socialnetwork.models.User;

import java.util.List;
import java.util.UUID;
/**
 * Author: nhutnm379
 */
public interface ICommentService {
    RPCommentDTO addComment(UUID postCode, String content, User user);
    RPReplyDTO addReply(UUID commentCode, String content, User user);
    void likeComment(UUID commentCode, User user);
    void deleteComment(UUID commentCode, User user);
    List<RPCommentDTO> getCommentsByPost(UUID postCode, User user, int page, int size);
    List<RPReplyDTO> getRepliesByComment(UUID commentCode, User user, int page, int size);
}