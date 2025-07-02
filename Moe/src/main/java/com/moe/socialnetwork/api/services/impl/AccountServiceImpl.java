package com.moe.socialnetwork.api.services.impl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.moe.socialnetwork.api.dtos.RPAccountDetailDTO;
import com.moe.socialnetwork.api.dtos.RPAccountSearchDTO;
import com.moe.socialnetwork.api.services.IAccountService;
import com.moe.socialnetwork.api.services.ICloudinaryService;
import com.moe.socialnetwork.jpa.FollowerJpa;
import com.moe.socialnetwork.jpa.PostJpa;
import com.moe.socialnetwork.jpa.UserJpa;
import com.moe.socialnetwork.models.Follower;
import com.moe.socialnetwork.models.User;
import com.moe.socialnetwork.exception.AppException;
import com.moe.socialnetwork.util.Base64Util;

import jakarta.transaction.Transactional;

@Service
public class AccountServiceImpl implements IAccountService {
    private final UserJpa userJpa;
    private final FollowerJpa followerJpa;
    private final ICloudinaryService cloudinaryService;
    private final PostJpa postJpa;

    public AccountServiceImpl(UserJpa userJpa, FollowerJpa followerJpa, ICloudinaryService cloudinaryService,PostJpa postJpa) {
        this.userJpa = userJpa;
        this.followerJpa = followerJpa;
        this.cloudinaryService = cloudinaryService;
        this.postJpa = postJpa;
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
            throw new IllegalArgumentException("Username đã được sử dụng.");
        }

        // Kiểm tra displayName trùng
        if (userJpa.existsDisplayNameExcludingId(displayName, userId)) {
            throw new IllegalArgumentException("DisplayName đã được sử dụng.");
        }

        // Cập nhật thông tin
        user.setDisplayName(displayName);
        user.setUserName(userName);
        user.setBio(bio);
        user.setUpdatedAt(LocalDateTime.now());
        user.setUserUpdate(user);

        userJpa.save(user);
    }

    public List<RPAccountSearchDTO> searchUsers(String searchTerm, int page, int size, User userLogin) {
        Pageable pageable = PageRequest.of(page, size);
        var userPage = userJpa.findUsersByUsernameOrDisplayName(searchTerm, pageable);
        List<User> users = userPage.getContent();
        return users.stream().map(user -> {
            RPAccountSearchDTO response = new RPAccountSearchDTO();
            response.setUserCode(user.getCode().toString());
            response.setUserName(user.getUsername());
            response.setDisplayName(user.getDisplayName());
            response.setAvatarUrl(user.getAvatar());
            response.setFollowerCount(String.valueOf(user.getFolloweds().size()));
            response.setUserCurrentCode(userLogin != null ? userLogin.getCode().toString() : null);
            boolean isFollowing = followerJpa.checkExistsByUserFollowerCodeAndUserFollowedCode(userLogin.getCode(),
                    user.getCode());
            response.setIsFollowed(isFollowing);
            return response;
        }).collect(Collectors.toList());
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

    public RPAccountDetailDTO getAccountDetail(UUID userCode, User userLogin) {
        if (userLogin == null) {
            throw new AppException("User not authenticated", 401);
        }

        User user = userJpa.findByCode(userCode)
                .orElseThrow(() -> new AppException("User not found with code: " + userCode, 404));

        RPAccountDetailDTO accountDetail = new RPAccountDetailDTO();
        accountDetail.setUserCode(user.getCode());
        accountDetail.setBio(user.getBio());
        accountDetail.setUserName(user.getUsername());
        accountDetail.setDisplayName(user.getDisplayName());
        accountDetail.setAvatarUrl(user.getAvatar());
        accountDetail.setFollower(String.valueOf(user.getFollowers().size()));
        accountDetail.setFollowed(String.valueOf(user.getFolloweds().size()));

        accountDetail.setUserAccountCode(userCode.toString());
        accountDetail.setUserCurrentCode(userLogin.getCode().toString());

        boolean isFollowing = followerJpa.checkExistsByUserFollowerCodeAndUserFollowedCode(
                userLogin.getCode(), userCode);
        accountDetail.setIsFollowing(isFollowing);

        int totalLikeCount = user.getPosts().stream()
                .mapToInt(post -> post.getLikes().size())
                .sum();
        accountDetail.setLikeCount(String.valueOf(totalLikeCount));

        List<RPAccountDetailDTO.AccountPostDTO> posts = postJpa.findListPostByUserId(userLogin.getId()).stream()
                .map(post -> {
                    RPAccountDetailDTO.AccountPostDTO postDTO = new RPAccountDetailDTO.AccountPostDTO();
                    postDTO.setPostCode(post.getCode());
                    postDTO.setPostType(post.getType() != null ? post.getType().toString() : null);
                    postDTO.setViewCount(String.valueOf(post.getViews().size()));
                    postDTO.setVideoThumbnail(post.getVideoThumbnail());

                    if (post.getType() != null && post.getType().toString().equals("VID")) {
                        postDTO.setMediaUrl(post.getVideoUrl());
                    } else {
                        if (post.getImages() != null && !post.getImages().isEmpty()) {
                            postDTO.setMediaUrl(post.getImages().get(0).getImageName());
                        }
                    }

                    return postDTO;
                })
                .collect(Collectors.toList());

        accountDetail.setPosts(posts);

        return accountDetail;
    }

}
