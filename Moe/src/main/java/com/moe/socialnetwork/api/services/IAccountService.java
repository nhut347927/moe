package com.moe.socialnetwork.api.services;

import java.util.List;
import java.util.UUID;

import com.moe.socialnetwork.api.dtos.AccountDetailDTO;
import com.moe.socialnetwork.api.dtos.AccountSearchResponseDTO;
import com.moe.socialnetwork.models.User;

public interface IAccountService {
    String updateImgAccUserFromBase64(String base64Data, User user);
    void updateProfileAccUser(String displayName, String userName, String bio, User user);
    List<AccountSearchResponseDTO> searchUsers(String searchTerm, int page, int size,  User userLogin);
    void followUser(UUID userCode, User userLogin);
    AccountDetailDTO getAccountDetail(UUID userCode, User userLogin);
}
