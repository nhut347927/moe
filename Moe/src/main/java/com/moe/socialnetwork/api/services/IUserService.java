package com.moe.socialnetwork.api.services;

import com.moe.socialnetwork.api.dtos.RPUsersDTO;
import com.moe.socialnetwork.api.dtos.ZRPPageDTO;

public interface IUserService {

    ZRPPageDTO<RPUsersDTO> searchUsers(String query, int page, int size, String sort);
}
