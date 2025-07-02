package com.moe.socialnetwork.api.services;

import java.util.List;
import java.util.UUID;

import com.moe.socialnetwork.api.dtos.RQPostCreateDTO;
import com.moe.socialnetwork.api.dtos.RPPostResponseDTO;
import com.moe.socialnetwork.api.dtos.RPPostSearchDTO;
import com.moe.socialnetwork.models.User;
/**
 * Author: nhutnm379
 */
public interface IPostService {
	List<RPPostSearchDTO> searchPosts(String keyword, int page, int size);
	RPPostResponseDTO getPostByCode(String postCode, User user);
	void viewPost(String postCode, User user);
	void likePost(String postCode, User user);
	Boolean createNewPost(RQPostCreateDTO dto, User user);
	List<RPPostResponseDTO> getPostList(User user);
	void deletePost(UUID postCode, User user);
}
