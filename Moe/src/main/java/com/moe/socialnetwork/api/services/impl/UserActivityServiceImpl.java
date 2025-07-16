package com.moe.socialnetwork.api.services.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.moe.socialnetwork.api.dtos.RPKeywordSearchTimeDTO;
import com.moe.socialnetwork.api.dtos.RPPostDTO;
import com.moe.socialnetwork.api.dtos.RPUserCommentDTO;
import com.moe.socialnetwork.api.dtos.ZRPPageDTO;
import com.moe.socialnetwork.api.services.IUserActivityService;
import com.moe.socialnetwork.jpa.CommentJPA;
import com.moe.socialnetwork.jpa.LikeJPA;
import com.moe.socialnetwork.jpa.SearchHistoryJPA;
import com.moe.socialnetwork.jpa.ViewJPA;
import com.moe.socialnetwork.models.Comment;
import com.moe.socialnetwork.models.Like;
import com.moe.socialnetwork.models.SearchHistory;
import com.moe.socialnetwork.models.User;
import com.moe.socialnetwork.models.View;
import com.moe.socialnetwork.util.PaginationUtils;

/**
 * Author: nhutnm379
 */
@Service
public class UserActivityServiceImpl implements IUserActivityService {

    private final LikeJPA likeJPA;
    private final ViewJPA viewJPA;
    private final CommentJPA commentJPA;
    private final SearchHistoryJPA searchHistoryRepository;
    private final PostServiceImpl postServiceImpl;

    public UserActivityServiceImpl(LikeJPA likeJPA, ViewJPA viewJPA, CommentJPA commentJPA,
            PostServiceImpl postServiceImpl,
            SearchHistoryJPA searchHistoryRepository) {
        this.likeJPA = likeJPA;
        this.viewJPA = viewJPA;
        this.commentJPA = commentJPA;
        this.searchHistoryRepository = searchHistoryRepository;
        this.postServiceImpl = postServiceImpl;
    }

    // ✅ Search history
    public ZRPPageDTO<RPKeywordSearchTimeDTO> getSearchHistoryByUser(User user, int page, int size, String sort) {
        Pageable pageable = PaginationUtils.buildPageable(page, size, sort);
        Page<SearchHistory> searchPage = searchHistoryRepository.getByUser(user, pageable);

        List<RPKeywordSearchTimeDTO> contents = searchPage.stream()
                .map(s -> new RPKeywordSearchTimeDTO(s.getKeyword(), s.getCreatedAt().toString()))
                .collect(Collectors.toList());

        return PaginationUtils.buildPageDTO(searchPage, contents);
    }

    // ✅ Views
    public ZRPPageDTO<RPPostDTO> getViewByUser(User user, int page, int size, String sort) {
        Pageable pageable = PaginationUtils.buildPageable(page, size, sort);
        Page<View> views = viewJPA.findByView(user.getId(), pageable);

        List<RPPostDTO> contents = views.stream()
                .map(view -> postServiceImpl.toPostResponse(view.getPost(), user))
                .collect(Collectors.toList());

        return PaginationUtils.buildPageDTO(views, contents);
    }

    // ✅ Likes
    public ZRPPageDTO<RPPostDTO> getLikeByUser(User user, int page, int size, String sort) {
        Pageable pageable = PaginationUtils.buildPageable(page, size, sort);
        Page<Like> likes = likeJPA.findByLike(user.getId(), pageable);

        List<RPPostDTO> contents = likes.stream()
                .map(like -> postServiceImpl.toPostResponse(like.getPost(), user))
                .collect(Collectors.toList());

        return PaginationUtils.buildPageDTO(likes, contents);
    }

    // ✅ Comments
    public ZRPPageDTO<RPUserCommentDTO> getCommentByUser(User user, int page, int size, String sort) {
        Pageable pageable = PaginationUtils.buildPageable(page, size, sort);
        Page<Comment> comments = commentJPA.findByComment(user.getId(), pageable);

        List<RPUserCommentDTO> contents = comments.stream()
                .map(c -> new RPUserCommentDTO(
                        c.getCode().toString(),
                        c.getPost().getCode().toString(),
                        c.getContent(),
                        c.getCreatedAt().toString()))
                .collect(Collectors.toList());

        return PaginationUtils.buildPageDTO(comments, contents);
    }
}
