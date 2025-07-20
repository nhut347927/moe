package com.moe.socialnetwork.api.services.impl;

import java.io.File;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Pageable;
import com.moe.socialnetwork.api.dtos.RQPostCreateDTO;
import com.moe.socialnetwork.api.dtos.RPPostDTO;
import com.moe.socialnetwork.api.dtos.RPPostDetailDTO;
import com.moe.socialnetwork.api.dtos.RPPostSearchDTO;
import com.moe.socialnetwork.api.dtos.RQPostCreateDTO.FFmpegMergeParams;
import com.moe.socialnetwork.api.dtos.ZRPPageDTO;
import com.moe.socialnetwork.api.services.IFFmpegService;
import com.moe.socialnetwork.api.services.IPostService;
import com.moe.socialnetwork.api.services.ISearchService;
import com.moe.socialnetwork.jpa.AudioJPA;
import com.moe.socialnetwork.jpa.ImageJPA;
import com.moe.socialnetwork.jpa.LikeJPA;
import com.moe.socialnetwork.jpa.PostJPA;
import com.moe.socialnetwork.jpa.PostTagJPA;
import com.moe.socialnetwork.jpa.TagJPA;
import com.moe.socialnetwork.jpa.ViewJPA;
import com.moe.socialnetwork.models.Audio;
import com.moe.socialnetwork.models.Image;
import com.moe.socialnetwork.models.Like;
import com.moe.socialnetwork.models.Post;
import com.moe.socialnetwork.models.PostTag;
import com.moe.socialnetwork.models.Tag;
import com.moe.socialnetwork.models.User;
import com.moe.socialnetwork.models.View;
import com.moe.socialnetwork.exception.AppException;

import jakarta.transaction.Transactional;

/**
 * Author: nhutnm379
 */
@Service
public class PostServiceImpl implements IPostService {

	private final PostTagJPA postTagJPA;
	private final PostJPA postJPA;
	private final IFFmpegService ffmpegService;
	private final TagJPA tagJPA;
	private final AudioJPA audioJPA;
	private final ImageJPA imageJPA;
	private final LikeJPA likeJpa;
	private final CloudinaryServiceImpl cloudinaryService;
	private final ViewJPA viewJPA;
	private final ISearchService searchHistoryService;

	public PostServiceImpl(PostTagJPA postTagJPA, PostJPA postJPA, TagJPA tagJPA, AudioJPA audioJPA, ImageJPA imageJPA,
			CloudinaryServiceImpl cloudinaryService, IFFmpegService ffmpegService, LikeJPA likeJpa, ViewJPA viewJPA,
			ISearchService searchHistoryService) {
		this.postTagJPA = postTagJPA;
		this.postJPA = postJPA;
		this.tagJPA = tagJPA;
		this.audioJPA = audioJPA;
		this.imageJPA = imageJPA;
		this.cloudinaryService = cloudinaryService;
		this.ffmpegService = ffmpegService;
		this.likeJpa = likeJpa;
		this.viewJPA = viewJPA;
		this.searchHistoryService = searchHistoryService;
	}

	public ZRPPageDTO<RPPostSearchDTO> searchPosts(String keyword, int page, int size, String sort, User user) { // sort
																													// trả
																													// về
		// desc hoặc asc
		Sort.Direction direction = "asc".equalsIgnoreCase(sort) ? Sort.Direction.ASC : Sort.Direction.DESC;
		Pageable pageable = PageRequest.of(page, size, Sort.by(direction, "id"));
		Page<Post> postPage = postJPA.searchPostsByKeyword(keyword, pageable);
		searchHistoryService.addSearch(user, keyword);

		List<RPPostSearchDTO> responseList = postPage.getContent().stream().map(post -> {
			RPPostSearchDTO dto = new RPPostSearchDTO();
			dto.setUserCode(String.valueOf(post.getUser().getCode()));
			dto.setTitle(post.getTitle());
			dto.setUserName(post.getUser().getUsername());
			dto.setDisplayName(post.getUser().getDisplayName());
			dto.setAvatarUrl(post.getUser().getAvatar());
			dto.setPostCode(String.valueOf(post.getCode()));
			dto.setPostType(post.getType().toString());
			dto.setVideoThumbnail(post.getVideoThumbnail());

			if (post.getType() == Post.PostType.VID) {
				dto.setMediaUrl(post.getVideoUrl());

				// Tìm audio nếu có
				Audio aud = audioJPA.findAudioByOwnerPostId(post.getId());
				if (aud != null) {
					dto.setAudioCode(aud.getCode().toString());
					dto.setAudioPublicId(aud.getAudioName());
				}
			} else {
				if (post.getImages() != null && !post.getImages().isEmpty()) {
					dto.setMediaUrl(post.getImages().get(0).getImageName());
				}
				if (post.getAudio() != null) {
					dto.setAudioCode(post.getAudio().getCode().toString());
					dto.setAudioPublicId(post.getAudio().getAudioName());
				}
			}

			dto.setViewCount(String.valueOf(post.getViews().size()));
			dto.setCreateAt(post.getCreatedAt().toString());

			return dto;
		}).toList();

		return new ZRPPageDTO<>(
				responseList,
				postPage.getTotalElements(),
				postPage.getTotalPages(),
				page,
				size,
				postPage.hasNext(),
				postPage.hasPrevious());
	}

	public RPPostDetailDTO getPostByCode(String postCode, User user) {
		UUID code = UUID.fromString(postCode);
		Post post = postJPA.findPostByPostCode(code)
				.orElseThrow(() -> new AppException("Post not found with provided postCode", 404));
		return toPostDetailResponse(post, user);
	}

	@Transactional
	public void viewPost(String postCode, User user) {
		UUID code = UUID.fromString(postCode);

		Post post = postJPA.findPostByPostCode(code)
				.orElseThrow(() -> new AppException("Post not found with provided postCode", 404));

		boolean alreadyViewed = viewJPA.checkExistsByPostCodeAndUserCode(post.getCode(), user.getCode());

		if (!alreadyViewed) {
			View view = new View();
			view.setPost(post);
			view.setUser(user);
			view.setCreatedAt(LocalDateTime.now());
			viewJPA.save(view);
		}
	}

	@Transactional
	public void likePost(String postCode, User user) {
		UUID postId = UUID.fromString(postCode);
		Post post = postJPA.findPostByPostCode(postId)
				.orElseThrow(() -> new AppException("Post not found with provided postCode", 404));

		Optional<Like> existingLike = likeJpa.findByUserCodeAndPostCode(user.getCode(), post.getCode());

		if (existingLike.isPresent()) {
			// Unlike
			likeJpa.delete(existingLike.get());
		} else {
			// Like
			Like like = new Like();
			like.setUser(user);
			like.setPost(post);
			likeJpa.save(like);
		}
	}

	@Transactional
	public Boolean createNewPost(RQPostCreateDTO dto, User user) {
		Post save = null;
		// Create post
		Post post = new Post();
		post.setUser(user);
		post.setUserCreate(user);
		post.setTitle(dto.getTitle());
		post.setDescription(dto.getDescription());
		post.setType("VID".equals(dto.getPostType()) ? Post.PostType.VID : Post.PostType.IMG);
		post.setIsDeleted(false);
		post.setCreatedAt(LocalDateTime.now());
		post.setVideoThumbnail(String.valueOf(dto.getVideoThumbnail() != null ? dto.getVideoThumbnail() : 0));
		post.setVisibility("PUBLIC".equals(dto.getVisibility()) ? Post.Visibility.PUBLIC : Post.Visibility.PRIVATE);
		// Handle postType
		if ("VID".equals(dto.getPostType())) {
			// No extra audio
			if (Boolean.FALSE.equals(dto.getIsUseOtherAudio())) {
				post.setVideoUrl(dto.getVideoPublicId());
				post.setVideoThumbnail(String.valueOf(dto.getVideoThumbnail()));
				// File videoFile = ffmpegService.downloadFileFromCloudinary(dto.getVideoPublicId(),
				// 		"audio.mp3", "video"); // đúng ra ở đây sử dụng type audio nhưng cloudinary nhận
				// 								// audio là video
				try {
				//	File audioFile = ffmpegService.extractAudioFromVideo(videoFile);
				//	String audioPublicId = cloudinaryService.uploadAudio(audioFile);
//videoFile.delete(); // Xóa file video tạm sau khi trích xuất audio
				//	audioFile.delete(); // Xóa file audio tạm sau khi upload
					Audio audioPost = new Audio();
					// chuyển publicid của audio sang của video
					audioPost.setAudioName(dto.getVideoPublicId());

					save = postJPA.save(post);

					audioPost.setOwnerPost(save);
					audioJPA.save(audioPost);
				} catch (Exception e) {
					throw new AppException("Failed to extract audio from video: " + e.getMessage(), 500);
				}
			} else {
				// Has extra audio
				if (dto.getFfmpegMergeParams() == null || dto.getAudioCode() == null || dto.getAudioCode().isEmpty()) {
					throw new AppException(
							"ffmpegCommand and audioCode must not be null when using external audio", 400);
				}
				UUID audioCode = UUID.fromString(dto.getAudioCode());
				// Set audio from another post
				Audio audioPost = audioJPA.findAudioByCode(audioCode)
						.orElseThrow(() -> new AppException("Audio post not found with provided postCode", 404));
				post.setAudio(audioPost);

				// audio code -> audioPublicId
				FFmpegMergeParams ffmpegParams = dto.getFfmpegMergeParams();
				ffmpegParams.setAudioPublicId(audioPost.getAudioName());
				ffmpegParams.setVideoPublicId(dto.getVideoPublicId());

				// Mock FFmpeg processing logic
				// xử lí video với audio
				// nhưng hiện tại ko đủ bộ nhớ nếu deploy lên Railway nên tạm cắt

				//#################################################################################################
				// try {
				// 	String vidPublicId = ffmpegService.mergeAndUpload(ffmpegParams);
				// 	post.setVideoUrl(vidPublicId);
				// 	cloudinaryService.deleteFile(dto.getVideoPublicId());

				// 	save = postJPA.save(post);
				// } catch (Exception e) {
				// 	throw new AppException("Failed to process video with audio: " + e.getMessage(), 500);
				// }
				//#################################################################################################
			}

		} else if ("IMG".equals(dto.getPostType())) {
			if (dto.getAudioCode() == null || dto.getAudioCode().isEmpty()) {
				throw new AppException("audioCode is required for image posts", 400);
			}

			UUID audioCode = UUID.fromString(dto.getAudioCode());
			// Set audio from another post
			Audio audioPost = audioJPA.findAudioByCode(audioCode)
					.orElseThrow(() -> new AppException("Audio post not found with provided postCode", 404));
			post.setAudio(audioPost);

			// save
			save = postJPA.save(post);
			// Save images
			if (dto.getImgPublicIdList() != null && !dto.getImgPublicIdList().isEmpty()) {
				for (String imgName : dto.getImgPublicIdList()) {
					Image image = new Image();
					image.setPost(post);
					image.setImageName(imgName);
					imageJPA.save(image);
				}
			} else {
				throw new AppException("imgList must not be empty for image posts", 400);
			}

		}

		// Handle tagCodeList
		if (dto.getTagCodeList() != null) {
			for (String codeStr : dto.getTagCodeList()) {
				try {
					UUID code = UUID.fromString(codeStr);

					// Tìm tag theo code
					Tag tag = tagJPA.findByCode(code).orElse(null);
					if (tag == null) {
						// Nếu không tìm thấy thì bỏ qua hoặc log lại
						// System.out.println("Tag code not found: " + code);
						continue;
					}

					// Tăng usage count
					tag.incrementUsageCount();
					tagJPA.save(tag);

					// Tạo liên kết PostTag
					PostTag postTag = new PostTag();
					postTag.setPost(save);
					postTag.setTag(tag);
					postTagJPA.save(postTag);

				} catch (IllegalArgumentException e) {
					// Trường hợp mã không hợp lệ UUID
					throw new AppException("Invalid UUID: " + codeStr, 400);
				}
			}
		}

		return true;
	}

	public void deletePost(UUID postCode, User user) {
		try {
			Post post = postJPA.findPostByPostCode(postCode)
					.orElseThrow(() -> new AppException("Post not found with code: " + postCode, 404));

			if (!post.getUser().getCode().equals(user.getCode())) {
				throw new AppException("User not authorized to delete this post", 403);
			}

			post.softDelete();
			post.setUserDelete(user);
			postJPA.save(post);

		} catch (Exception e) {
			throw new AppException("Failed to delete post: " + e.getMessage(), 500);
		}
	}

	@Override
	public List<RPPostDTO> getPostList(User user) {
		// 1. Lấy top 25 tagId mà user đã like
		List<Long> tagIds = postJPA.findTopTagIdsUserLiked(user.getId(), PageRequest.of(0, 24));

		// 2. Lấy các post chứa tag này, chưa xem
		List<Post> candidatePosts = tagIds.isEmpty() ? new ArrayList<>()
				: postJPA.findUnviewedPostsByTags(user.getId(), tagIds);

		// 3. Tính điểm và sắp xếp
		List<PostWithScore> scoredPosts = candidatePosts.stream()
				.map(post -> {
					int likes = post.getLikes() != null ? post.getLikes().size() : 0;
					int comments = post.getComments() != null ? post.getComments().size() : 0;
					int views = post.getViews() != null ? post.getViews().size() : 0;
					double hoursSincePosted = Duration.between(post.getCreatedAt(), LocalDateTime.now()).toHours();
					double score = computeScore(likes, comments, views, hoursSincePosted);
					return new PostWithScore(post, score);
				})
				.sorted(Comparator.comparingDouble(PostWithScore::getScore).reversed())
				.collect(Collectors.toList());

		// 4. Lấy 9-18 => 3-9 post đầu tiên
		int limit = Math.max(3, Math.min(9, scoredPosts.size()));
		List<Post> result = scoredPosts.stream()
				.limit(limit)
				.map(PostWithScore::getPost)
				.collect(Collectors.toList());

		// 5. Nếu chưa đủ, lấy thêm post chưa xem bất kỳ (lọc trùng)
		Set<Long> seenPostIds = result.stream().map(Post::getId).collect(Collectors.toSet());
		if (result.size() < 9) {
			List<Post> moreUnviewed = postJPA.findRandomUnviewedPosts(user.getId(),
					PageRequest.of(0, 9 - result.size()));
			for (Post p : moreUnviewed) {
				if (!seenPostIds.contains(p.getId())) {
					result.add(p);
					seenPostIds.add(p.getId());
				}
				if (result.size() >= 9)
					break;
			}
		}

		// 6. Nếu vẫn chưa đủ, lấy post ngẫu nhiên (lọc trùng)
		if (result.size() < 9) {
			List<Post> randomPosts = postJPA.findRandomPosts(PageRequest.of(0, 9 - result.size()));
			for (Post p : randomPosts) {
				if (!seenPostIds.contains(p.getId())) {
					result.add(p);
					seenPostIds.add(p.getId());
				}
				if (result.size() >= 9)
					break;
			}
		}

		// 7. Chuyển sang DTO
		return result.stream().limit(9).map(post -> this.toPostResponse(post, user)).collect(Collectors.toList());
	}

	public RPPostDTO toPostResponse(Post post, User user) {
		RPPostDTO dto = new RPPostDTO();
		dto.setUserCode(String.valueOf(post.getUser().getCode()));
		dto.setPostCode(String.valueOf(post.getCode()));
		dto.setAvatarUrl(post.getUser().getAvatar());
		dto.setCreatedAt(post.getCreatedAt().toString());
		dto.setPostType(post.getType().toString());
		dto.setVideoUrl(post.getVideoUrl());
		dto.setThumbnail(post.getVideoThumbnail());
		dto.setTitle(post.getTitle());
		List<String> imageUrls = new ArrayList<>();
		for (Image image : post.getImages()) {
			imageUrls.add(image.getImageName());
		}
		dto.setImageUrls(imageUrls);
		boolean isLiked = post.getLikes().stream()
				.anyMatch(like -> like.getUser().getId().equals(user.getId()));
		dto.setIsLiked(isLiked);

		if (post.getAudio() != null && post.getAudio().getOwnerPost() != null) {
			dto.setAudioUrl(post.getAudio().getAudioName());
		} else {
			// if post does not have audio, it means it uses default audio
			Audio defaultAudio = audioJPA.findAudioByOwnerPostId(post.getId());
			dto.setAudioUrl(defaultAudio.getAudioName());
		}

		dto.setComments(null);
		return dto;
	}

	private RPPostDetailDTO toPostDetailResponse(Post post, User user) {
		RPPostDetailDTO dto = new RPPostDetailDTO();
		dto.setUserCode(String.valueOf(post.getUser().getCode()));
		dto.setPostCode(String.valueOf(post.getCode()));
		dto.setCreatedAt(post.getCreatedAt().toString());

		dto.setUserCurrentCode(user.getCode().toString());

		dto.setAvatarUrl(post.getUser().getAvatar());
		dto.setUserDisplayName(post.getUser().getDisplayName());
		dto.setUserName(post.getUser().getUsername());

		dto.setPostType(post.getType().toString());
		dto.setVideoUrl(post.getVideoUrl());
		dto.setThumbnail(post.getVideoThumbnail());

		dto.setTitle(post.getTitle());
		dto.setDescription(post.getDescription());

		List<String> imageUrls = new ArrayList<>();
		for (Image image : post.getImages()) {
			imageUrls.add(image.getImageName());
		}
		dto.setImageUrls(imageUrls);

		List<String> tags = new ArrayList<>();
		for (PostTag tag : post.getPostTags()) {
			tags.add(tag.getTag().getName());
		}
		dto.setTags(tags);

		boolean isLiked = post.getLikes().stream()
				.anyMatch(like -> like.getUser().getId().equals(user.getId()));
		dto.setIsLiked(isLiked);

		dto.setLikeCount(String.valueOf(post.getLikes().size()));
		dto.setCommentCount(String.valueOf(post.getComments().size()));

		Boolean isInAnyPlaylist = postJPA.existsPostInAnyUserPlaylist(user.getId(), post.getId());
		dto.setIsAddPlaylist(isInAnyPlaylist);

		if (post.getAudio() != null && post.getAudio().getOwnerPost() != null) {
			dto.setAudioUrl(post.getAudio().getAudioName());
			dto.setAudioOwnerAvatar(post.getAudio().getOwnerPost().getUser().getAvatar());
			dto.setAudioOwnerDisplayName(post.getAudio().getOwnerPost().getUser().getDisplayName());
			dto.setAudioPostCode(post.getAudio().getOwnerPost().getCode().toString());
			dto.setAudioCode(String.valueOf(post.getAudio().getId()));
		} else {
			// if post does not have audio, it means it uses default audio
			Audio defaultAudio = audioJPA.findAudioByOwnerPostId(post.getId());

			dto.setAudioUrl(defaultAudio.getAudioName());
			dto.setAudioOwnerAvatar(user.getAvatar());
			dto.setAudioOwnerDisplayName(user.getDisplayName());
			dto.setAudioPostCode(post.getCode().toString());
			dto.setAudioCode(defaultAudio.getCode().toString());
		}

		dto.setComments(null);
		return dto;
	}

	public double computeScore(int likes, int comments, int views, double hoursSincePosted) {
		double l = Math.log(likes + 1);
		double c = Math.log(comments + 1);
		double v = Math.log(views + 1);

		double w1 = 5.0, w2 = 10.0, w3 = 1.0;
		double raw = w1 * l + w2 * c + w3 * v;

		double decayRate = 0.99; // Giảm dần theo thời gian
		double decay = Math.pow(decayRate, hoursSincePosted);

		return raw * decay;
	}

	private static class PostWithScore {
		private final Post post;
		private final double score;

		public PostWithScore(Post post, double score) {
			this.post = post;
			this.score = score;
		}

		public Post getPost() {
			return post;
		}

		public double getScore() {
			return score;
		}
	}

}
