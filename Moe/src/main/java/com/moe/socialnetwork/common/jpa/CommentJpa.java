package com.moe.socialnetwork.common.jpa;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.moe.socialnetwork.common.models.Comment;

public interface CommentJpa extends JpaRepository<Comment, Long> {
    @Query("""
                SELECT c FROM Comment c
                WHERE c.post.code = :postCode
                  AND c.parentComment IS NULL
                  AND c.isDeleted = false
                ORDER BY c.createdAt DESC
            """)
    Page<Comment> findTopLevelCommentsByPostCode(@Param("postCode") UUID postCode, Pageable pageable);

    @Query("""
                SELECT c FROM Comment c
                WHERE c.parentComment.code = :parentCode
                  AND c.isDeleted = false
                ORDER BY c.createdAt ASC
            """)
    Page<Comment> findRepliesByParentCode(@Param("parentCode") UUID parentCode, Pageable pageable);

    
    @Query("SELECT c FROM Comment c WHERE c.isDeleted = false AND c.code = :code")
    Optional<Comment> findCommentByCommentCode(@Param("code") UUID code);

}
