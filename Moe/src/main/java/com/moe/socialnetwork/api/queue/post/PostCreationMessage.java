package com.moe.socialnetwork.api.queue.post;

import com.moe.socialnetwork.api.dtos.RQPostCreateDTO;
import com.moe.socialnetwork.models.User;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
/**
 * Author: nhutnm379
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PostCreationMessage {
    private User user;
    private RQPostCreateDTO dto;
}
