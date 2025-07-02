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

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Pageable;
import com.moe.socialnetwork.api.dtos.PostCreateRepuestDTO;
import com.moe.socialnetwork.api.dtos.PostResponseDTO;
import com.moe.socialnetwork.api.dtos.PostSearchResponseDTO;
import com.moe.socialnetwork.api.dtos.PostCreateRepuestDTO.FFmpegMergeParams;
import com.moe.socialnetwork.api.services.IFFmpegService;
import com.moe.socialnetwork.api.services.IPostService;
import com.moe.socialnetwork.jpa.AudioJpa;
import com.moe.socialnetwork.jpa.ImageJpa;
import com.moe.socialnetwork.jpa.LikeJpa;
import com.moe.socialnetwork.jpa.PostJpa;
import com.moe.socialnetwork.jpa.PostTagJpa;
import com.moe.socialnetwork.jpa.TagJpa;
import com.moe.socialnetwork.jpa.ViewJpa;
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

@Service
public class PostServiceImpl implements IPostService {

	private final PostTagJpa postTagJPA;
	private final PostJpa postJPA;
	private final IFFmpegService ffmpegService;
	private final TagJpa tagJPA;
	private final AudioJpa audioJPA;
	private final ImageJpa imageJPA;
	private final LikeJpa likeJpa;
	private final CloudinaryServiceImpl cloudinaryService;
	private final ViewJpa viewJPA;

	public PostServiceImpl(PostTagJpa postTagJPA, PostJpa postJPA, TagJpa tagJPA, AudioJpa audioJPA, ImageJpa imageJPA,
			CloudinaryServiceImpl cloudinaryService, IFFmpegService ffmpegService, LikeJpa likeJpa, ViewJpa viewJPA) {
		this.postTagJPA = postTagJPA;
		this.postJPA = postJPA;
		this.tagJPA = tagJPA;
		this.audioJPA = audioJPA;
		this.imageJPA = imageJPA;
		this.cloudinaryService = cloudinaryService;
		this.ffmpegService = ffmpegService;
		this.likeJpa = likeJpa;
		this.viewJPA = viewJPA;
	}

	public List<PostSearchResponseDTO> searchPosts(String keyword, int page, int size) {
		Pageable pageable = PageRequest.of(page, size);
		List<Post> posts = postJPA.findPostsByTitleOrDescription(keyword, pageable).getContent();
		if (posts.isEmpty()) {
			throw new AppException("No posts found containing the keyword!", 404);
		}

		List<PostSearchResponseDTO> response = new ArrayList<>();
		for (Post post : posts) {
			PostSearchResponseDTO dto = new PostSearchResponseDTO();
			dto.setUserCode(String.valueOf(post.getUser().getCode()));
			dto.setTitle(post.getTitle());
			dto.setUserName(post.getUser().getUsername());
			dto.setDisplayName(post.getUser().getDisplayName());
			dto.setAvatarUrl(post.getUser().getAvatar());
			dto.setPostCode(String.valueOf(post.getCode()));
			dto.setPostType(post.getType().toString());
			dto.setVideoThumbnail(post.getVideoThumbnail());
			if (post.getType() != null && post.getType().toString().equals("VID")) {
				dto.setMediaUrl(post.getVideoUrl());
			} else {
				if (post.getImages() != null && !post.getImages().isEmpty()) {
					dto.setMediaUrl(post.getImages().get(0).getImageName());
				}
			}
			dto.setViewCount(String.valueOf(post.getViews().size()));
			dto.setCreateAt(post.getCreatedAt().toString());

			if (post.getType().equals("VID")) {
				Audio aud = audioJPA.findAudioByOwnerPostId(post.getId());
				dto.setAudioCode(aud.getCode().toString());
				dto.setAudioPublicId(aud.getAudioName());
			} else {
				dto.setAudioCode(post.getAudio() != null ? post.getAudio().getCode().toString() : null);
				dto.setAudioPublicId(post.getAudio() != null ? post.getAudio().getAudioName() : null);
			}

			response.add(dto);
		}
		return response;
	}

	public PostResponseDTO getPostByCode(String postCode, User user) {
		UUID code = UUID.fromString(postCode);
		Post post = postJPA.findPostByPostCode(code)
				.orElseThrow(() -> new AppException("Post not found with provided postCode", 404));
		return toPostResponse(post, user);
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
	public Boolean createNewPost(PostCreateRepuestDTO dto, User user) {
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
				File videoFile = ffmpegService.downloadFileFromCloudinary(dto.getVideoPublicId(),
						"audio.mp3", "video"); // đúng ra ở đây sử dụng type audio nhưng cloudinary nhận
												// audio là video
				try {
					File audioFile = ffmpegService.extractAudioFromVideo(videoFile);
					String audioPublicId = cloudinaryService.uploadAudio(audioFile);
					videoFile.delete(); // Xóa file video tạm sau khi trích xuất audio
					audioFile.delete(); // Xóa file audio tạm sau khi upload
					Audio audioPost = new Audio();
					audioPost.setAudioName(audioPublicId);

					save = postJPA.save(post);

					audioPost.setOwnerPost(save);
					audioJPA.save(audioPost);
				} catch (java.io.IOException e) {
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
				try {
					String vidPublicId = ffmpegService.mergeAndUpload(ffmpegParams);
					post.setVideoUrl(vidPublicId);
					cloudinaryService.deleteFile(dto.getVideoPublicId());

					save = postJPA.save(post);
				} catch (Exception e) {
					throw new AppException("Failed to process video with audio: " + e.getMessage(), 500);
				}
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

		} catch (AppException e) {
			throw e;
		} catch (Exception e) {
			throw new AppException("Failed to delete post: " + e.getMessage(), 500);
		}
	}

	@Override
	public List<PostResponseDTO> getPostList(User user) {
		// 1. Lấy top 25 tagId mà user đã like
		List<Long> tagIds = postJPA.findTopTagIdsUserLiked(user.getId(), PageRequest.of(0, 25));

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

		// 4. Lấy 9-18 post đầu tiên
		int limit = Math.max(9, Math.min(18, scoredPosts.size()));
		List<Post> result = scoredPosts.stream()
				.limit(limit)
				.map(PostWithScore::getPost)
				.collect(Collectors.toList());

		// 5. Nếu chưa đủ, lấy thêm post chưa xem bất kỳ (lọc trùng)
		Set<Long> seenPostIds = result.stream().map(Post::getId).collect(Collectors.toSet());
		if (result.size() < 18) {
			List<Post> moreUnviewed = postJPA.findRandomUnviewedPosts(user.getId(),
					PageRequest.of(0, 18 - result.size()));
			for (Post p : moreUnviewed) {
				if (!seenPostIds.contains(p.getId())) {
					result.add(p);
					seenPostIds.add(p.getId());
				}
				if (result.size() >= 18)
					break;
			}
		}

		// 6. Nếu vẫn chưa đủ, lấy post ngẫu nhiên (lọc trùng)
		if (result.size() < 18) {
			List<Post> randomPosts = postJPA.findRandomPosts(PageRequest.of(0, 18 - result.size()));
			for (Post p : randomPosts) {
				if (!seenPostIds.contains(p.getId())) {
					result.add(p);
					seenPostIds.add(p.getId());
				}
				if (result.size() >= 18)
					break;
			}
		}

		// 7. Chuyển sang DTO
		return result.stream().limit(18).map(post -> this.toPostResponse(post, user)).collect(Collectors.toList());
	}

	private PostResponseDTO toPostResponse(Post post, User user) {
		PostResponseDTO dto = new PostResponseDTO();
		dto.setPostId(post.getId().toString());
		dto.setUserCode(String.valueOf(post.getUser().getCode()));
		dto.setPostCode(String.valueOf(post.getCode()));
		dto.setCreatedAt(post.getCreatedAt().toString());

		dto.setUserCurrentCode(user.getCode().toString());

		dto.setUserAvatar(post.getUser().getAvatar());
		dto.setUserDisplayName(post.getUser().getDisplayName());
		dto.setUserName(post.getUser().getUsername());

		dto.setPostType(post.getType().toString());
		dto.setVideoUrl(post.getVideoUrl());

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
			dto.setAudioCode(String.valueOf(post.getAudio().getId()));
		} else {
			// if post does not have audio, it means it uses default audio
			Audio defaultAudio = audioJPA.findAudioByOwnerPostId(post.getId());

			dto.setAudioUrl(defaultAudio.getAudioName());
			dto.setAudioOwnerAvatar(user.getAvatar());
			dto.setAudioOwnerDisplayName(user.getDisplayName());
			dto.setAudioCode(defaultAudio.getCode().toString());
		}

		dto.setComments(null);
		return dto;
	}

	public double computeScore(int likes, int comments, int views, double hoursSincePosted) {
		double l = Math.log(likes + 1);
		double c = Math.log(comments + 1);
		double v = Math.log(views + 1);

		double w1 = 2.0, w2 = 3.0, w3 = 1.0;
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
