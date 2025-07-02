package com.moe.socialnetwork.jpa;

import org.springframework.data.jpa.repository.JpaRepository;

import com.moe.socialnetwork.models.CommentLike;
/**
 * Author: nhutnm379
 */
public interface CommentLikeJPA extends JpaRepository<CommentLike, Long> {
    
}
