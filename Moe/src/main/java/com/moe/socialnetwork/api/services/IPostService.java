package com.moe.socialnetwork.api.services;

import java.util.List;
import java.util.UUID;

import com.moe.socialnetwork.api.dtos.RQPostCreateDTO;
import com.moe.socialnetwork.api.dtos.ZRPPageDTO;
import com.moe.socialnetwork.api.dtos.RPPostDTO;
import com.moe.socialnetwork.api.dtos.RPPostDetailDTO;
import com.moe.socialnetwork.api.dtos.RPPostSearchDTO;
import com.moe.socialnetwork.models.Post;
import com.moe.socialnetwork.models.User;

/**
 * Author: nhutnm379
 */
public interface IPostService {
	ZRPPageDTO<RPPostSearchDTO> searchPosts(String keyword, int page, int size, String sort, User user);

	RPPostDetailDTO getPostByCode(String postCode, User user);

	void viewPost(String postCode, User user);

	void likePost(String postCode, User user);

	Boolean createNewPost(RQPostCreateDTO dto, User user);

	List<RPPostDTO> getPostList(User user);

	void deletePost(UUID postCode, User user);

	RPPostDTO toPostResponse(Post post, User user);
}
