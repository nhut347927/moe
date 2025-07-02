package com.moe.socialnetwork.api.services;

import java.util.List;
import java.util.UUID;

import com.moe.socialnetwork.api.dtos.RPAccountDetailDTO;
import com.moe.socialnetwork.api.dtos.RPAccountSearchDTO;
import com.moe.socialnetwork.models.User;

public interface IAccountService {
    String updateImgAccUserFromBase64(String base64Data, User user);
    void updateProfileAccUser(String displayName, String userName, String bio, User user);
    List<RPAccountSearchDTO> searchUsers(String searchTerm, int page, int size,  User userLogin);
    void followUser(UUID userCode, User userLogin);
    RPAccountDetailDTO getAccountDetail(UUID userCode, User userLogin);
}
