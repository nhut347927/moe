package com.moe.socialnetwork.api.services;

import java.util.UUID;

import com.moe.socialnetwork.api.dtos.RPAccountDetailDTO;
import com.moe.socialnetwork.api.dtos.RPAccountSearchDTO;
import com.moe.socialnetwork.api.dtos.ZRPPageDTO;
import com.moe.socialnetwork.models.User;

/**
 * Author: nhutnm379
 */
public interface IAccountService {
    String updateImgAccUserFromBase64(String base64Data, User user);

    void updateProfileAccUser(String displayName, String userName, String bio, User user);

    ZRPPageDTO<RPAccountSearchDTO> searchUsers(String searchTerm, int page, int size, String sort, User userLogin);

    void followUser(UUID userCode, User userLogin);

    RPAccountDetailDTO getAccountSummary(UUID userCode, User userLogin);

    ZRPPageDTO<RPAccountDetailDTO.RPAccountPostDTO> getAccountPosts(
            UUID userCode, int page, int size, String sort);
}
