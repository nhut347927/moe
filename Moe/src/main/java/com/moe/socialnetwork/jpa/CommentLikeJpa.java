package com.moe.socialnetwork.jpa;

import org.springframework.data.jpa.repository.JpaRepository;

import com.moe.socialnetwork.models.CommentLike;

public interface CommentLikeJpa extends JpaRepository<CommentLike, Long> {
    
}
