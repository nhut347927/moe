package com.moe.socialnetwork.api.services.impl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.moe.socialnetwork.api.dtos.RPUsersDTO;
import com.moe.socialnetwork.api.dtos.ZRPPageDTO;
import com.moe.socialnetwork.api.services.IUserService;
import com.moe.socialnetwork.jpa.UserJPA;
import com.moe.socialnetwork.models.User;
import com.moe.socialnetwork.util.PaginationUtils;

/**
 * Author: nhutnm379
 */
@Service
public class UserServiceImpl implements IUserService {
    private final UserJPA userJPA;

    public UserServiceImpl(UserJPA userJPA) {
        this.userJPA = userJPA;
    }

    @Override
    public ZRPPageDTO<RPUsersDTO> searchUsers(String query, int page, int size, String sort) {
        if (query == null || query.trim().isEmpty()) {
            query = "";
        }
        Pageable pageable = PaginationUtils.buildPageable(page, size, sort);
        Page<User> users = userJPA.searchUsers(query, pageable);

        List<RPUsersDTO> contents = users.stream()
                .map(this::mapUserToRPUsersDTO)
                .collect(Collectors.toList());

        return PaginationUtils.buildPageDTO(users, contents);
    }

    private RPUsersDTO mapUserToRPUsersDTO(User user) {
        return new RPUsersDTO(
                user.getCode().toString(),
                user.getEmail(),
                user.getUsername(),
                user.getDisplayName(),
                user.getBio(),
                user.getProvider(),
                user.getLocation(),
                user.getAvatar(),
                user.getDateOfBirth() == null ? null : user.getDateOfBirth().toString(),
                user.getGender().toString(),
                user.getIsVerified(),
                user.getIsDeleted(),
                user.getCreatedAt() == null ? null : user.getCreatedAt().toString(),
                user.getUpdatedAt() == null ? null : user.getUpdatedAt().toString(),
                user.getDeletedAt() == null ? null : user.getDeletedAt().toString(),
                user.getUserCreate() == null ? null : user.getUserCreate().getCode().toString(),
                user.getUserUpdate() == null ? null : user.getUserUpdate().getCode().toString(),
                user.getUserDelete() == null ? null : user.getUserDelete().getCode().toString(),
                user.getLastLogin() == null ? null : user.getLastLogin().toString());
    }

}