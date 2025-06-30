package com.moe.socialnetwork.api.services;

import java.util.List;
import java.util.UUID;

import com.moe.socialnetwork.api.dtos.PostCreateRepuestDTO;
import com.moe.socialnetwork.api.dtos.PostResponseDTO;
import com.moe.socialnetwork.api.dtos.PostSearchResponseDTO;
import com.moe.socialnetwork.models.User;

public interface IPostService {
	List<PostSearchResponseDTO> searchPosts(String keyword, int page, int size);
	PostResponseDTO getPostByCode(String postCode, User user);
	void viewPost(String postCode, User user);
	void likePost(String postCode, User user);
	Boolean createNewPost(PostCreateRepuestDTO dto, User user);
	List<PostResponseDTO> getPostList(User user);
	void deletePost(UUID postCode, User user);
}
