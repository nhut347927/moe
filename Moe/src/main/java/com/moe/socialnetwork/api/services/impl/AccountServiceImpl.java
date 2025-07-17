package com.moe.socialnetwork.api.services.impl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.moe.socialnetwork.api.dtos.RPAccountDetailDTO;
import com.moe.socialnetwork.api.dtos.RPAccountSearchDTO;
import com.moe.socialnetwork.api.dtos.ZRPPageDTO;
import com.moe.socialnetwork.api.services.IAccountService;
import com.moe.socialnetwork.api.services.ICloudinaryService;
import com.moe.socialnetwork.api.services.ISearchService;
import com.moe.socialnetwork.jpa.FollowerJPA;
import com.moe.socialnetwork.jpa.PostJPA;
import com.moe.socialnetwork.jpa.UserJPA;
import com.moe.socialnetwork.models.Follower;
import com.moe.socialnetwork.models.Post;
import com.moe.socialnetwork.models.User;
import com.moe.socialnetwork.exception.AppException;
import com.moe.socialnetwork.util.Base64Util;

import jakarta.transaction.Transactional;

/**
 * Author: nhutnm379
 */
@Service
public class AccountServiceImpl implements IAccountService {
    private final UserJPA userJpa;
    private final FollowerJPA followerJpa;
    private final ICloudinaryService cloudinaryService;
    private final PostJPA postJpa;
    private final ISearchService searchHistoryService;

    public AccountServiceImpl(UserJPA userJpa, FollowerJPA followerJpa, ICloudinaryService cloudinaryService,
            PostJPA postJpa, ISearchService searchHistoryService) {
        this.userJpa = userJpa;
        this.followerJpa = followerJpa;
        this.cloudinaryService = cloudinaryService;
        this.postJpa = postJpa;
        this.searchHistoryService = searchHistoryService;
    }

    public String updateImgAccUserFromBase64(String base64Data, User user) {
        if (base64Data == null || base64Data.trim().isEmpty()) {
            throw new AppException("Base64 image cannot be empty", 400);
        }

        try {
            String fileName = "avatar.png";
            String contentType = "image/png";

            MultipartFile file = Base64Util.base64ToMultipartFile(base64Data, fileName, contentType);

            String publicId = cloudinaryService.uploadImage(file);
            String oldPublicId = user.getAvatar();

            user.setAvatar(publicId);
            user.setUpdatedAt(LocalDateTime.now());
            user.setUserUpdate(user);

            userJpa.save(user);
            if (oldPublicId != null && !oldPublicId.isEmpty()) {
                cloudinaryService.deleteFile(oldPublicId);
            }
            return publicId;
        } catch (Exception e) {
            throw new AppException("Failed to decode or upload base64 image: " + e.getMessage(), 500);
        }
    }

    public void updateProfileAccUser(String displayName, String userName, String bio, User user) {
        Long userId = user.getId();

        // Kiểm tra userName trùng
        if (userJpa.existsUserNameExcludingId(userName, userId)) {
            throw new AppException("Username already in use", 409);
        }

        // Kiểm tra displayName trùng
        if (userJpa.existsDisplayNameExcludingId(displayName, userId)) {
            throw new AppException("DisplayName already in use", 409);
        }

        // Cập nhật thông tin
        try {
            user.setDisplayName(displayName);
            user.setUserName(userName);
            user.setBio(bio);
            user.setUpdatedAt(LocalDateTime.now());
            user.setUserUpdate(user);

            userJpa.save(user);
        } catch (Exception e) {
            throw new AppException("Failed to update user information", 500);
        }
    }

    @Override
    public ZRPPageDTO<RPAccountSearchDTO> searchUsers(String searchTerm, int page, int size, String sort,
            User userLogin) {
        Pageable pageable = PageRequest.of(page, size,
                "desc".equalsIgnoreCase(sort) ? org.springframework.data.domain.Sort.by("id").descending()
                        : org.springframework.data.domain.Sort.by("id").ascending());
        Page<User> userPage = userJpa.findUsersByKeyword(searchTerm, pageable);
        searchHistoryService.addSearch(userLogin, searchTerm);
        List<RPAccountSearchDTO> dtoList = userPage.getContent().stream().map(user -> {
            RPAccountSearchDTO dto = new RPAccountSearchDTO();
            dto.setUserCode(user.getCode().toString());
            dto.setUserName(user.getUsername());
            dto.setDisplayName(user.getDisplayName());
            dto.setAvatarUrl(user.getAvatar());
            dto.setFollowerCount(String.valueOf(user.getFolloweds() != null ? user.getFolloweds().size() : 0));

            boolean isFollowed = false;
            if (userLogin != null) {
                isFollowed = followerJpa.checkExistsByUserFollowerCodeAndUserFollowedCode(
                        userLogin.getCode(), user.getCode());
                dto.setUserCurrentCode(userLogin.getCode().toString());
            }

            dto.setIsFollowed(isFollowed);
            return dto;
        }).collect(Collectors.toList());

        return new ZRPPageDTO<>(
                dtoList,
                userPage.getTotalElements(),
                userPage.getTotalPages(),
                userPage.getNumber(),
                userPage.getSize(),
                userPage.hasNext(),
                userPage.hasPrevious());
    }

    @Transactional
    public void followUser(UUID userCode, User userLogin) {

        // 1. Kiểm tra người dùng tồn tại
        User userToFollow = userJpa.findByCode(userCode)
                .orElseThrow(() -> new AppException("User not found with code: " + userCode, 404));

        // 2. Không cho tự follow chính mình
        if (userToFollow.getCode().equals(userLogin.getCode())) {
            throw new AppException("You cannot follow yourself", 400);
        }

        // 3. Kiểm tra đã follow chưa
        Optional<Follower> existingFollower = followerJpa
                .findFollowerByUserFollowerCodeAndUserFollowedCode(userLogin.getCode(), userToFollow.getCode());

        if (existingFollower.isPresent()) {
            // Nếu đã follow → unfollow
            followerJpa.delete(existingFollower.get());
        } else {
            // Nếu chưa → tạo mới
            Follower follower = new Follower();
            follower.setFollower(userLogin);
            follower.setFollowed(userToFollow);
            followerJpa.save(follower);
        }
    }

    public RPAccountDetailDTO getAccountSummary(UUID userCode, User userLogin) {
        User user = userJpa.findByCode(userCode)
                .orElseThrow(() -> new AppException("User not found with code: " + userCode, 404));

        RPAccountDetailDTO dto = new RPAccountDetailDTO();
        dto.setUserCode(user.getCode());
        dto.setBio(user.getBio());
        dto.setUserName(user.getUsername());
        dto.setDisplayName(user.getDisplayName());
        dto.setAvatarUrl(user.getAvatar());
        dto.setFollower(String.valueOf(user.getFollowers().size()));
        dto.setFollowed(String.valueOf(user.getFolloweds().size()));
        dto.setUserAccountCode(userCode.toString());
        dto.setUserCurrentCode(userLogin.getCode().toString());

        boolean isFollowing = followerJpa.checkExistsByUserFollowerCodeAndUserFollowedCode(
                userLogin.getCode(), userCode);
        dto.setIsFollowing(isFollowing);

        int totalLikeCount = user.getPosts().stream()
                .mapToInt(post -> post.getLikes().size())
                .sum();
        dto.setLikeCount(String.valueOf(totalLikeCount));

        return dto;
    }

    public ZRPPageDTO<RPAccountDetailDTO.RPAccountPostDTO> getAccountPosts(
            UUID userCode, int page, int size, String sort) {
        Sort.Direction direction = "asc".equalsIgnoreCase(sort) ? Sort.Direction.ASC : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, "id")); // sort theo id

        Page<Post> postPage = postJpa.findByUserPaged(userCode, pageable); // bước này cần viết method query mới

        List<RPAccountDetailDTO.RPAccountPostDTO> contents = postPage.getContent().stream()
                .map(post -> {
                    RPAccountDetailDTO.RPAccountPostDTO dto = new RPAccountDetailDTO.RPAccountPostDTO();
                    dto.setPostCode(post.getCode());
                    dto.setPostType(post.getType() != null ? post.getType().toString() : null);
                    dto.setVideoThumbnail(post.getVideoThumbnail());
                    dto.setViewCount(String.valueOf(post.getViews().size()));

                    if (post.getType() != null && post.getType().toString().equals("VID")) {
                        dto.setMediaUrl(post.getVideoUrl());
                    } else if (post.getImages() != null && !post.getImages().isEmpty()) {
                        dto.setMediaUrl(post.getImages().get(0).getImageName());
                    }

                    return dto;
                })
                .collect(Collectors.toList());

        return new ZRPPageDTO<>(
                contents,
                postPage.getTotalElements(),
                postPage.getTotalPages(),
                postPage.getNumber(),
                postPage.getSize(),
                postPage.hasNext(),
                postPage.hasPrevious());
    }

}
