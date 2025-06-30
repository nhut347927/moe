package com.moe.socialnetwork.common.jpa;

import org.springframework.data.jpa.repository.JpaRepository;

import com.moe.socialnetwork.common.models.CommentLike;

public interface CommentLikeJpa extends JpaRepository<CommentLike, Long> {
    
}
