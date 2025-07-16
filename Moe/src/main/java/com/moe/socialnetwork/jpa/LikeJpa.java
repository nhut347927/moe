package com.moe.socialnetwork.jpa;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.moe.socialnetwork.models.Like;

/**
 * Author: nhutnm379
 */
public interface LikeJPA extends JpaRepository<Like, Long> {
    @Query("SELECT l FROM Like l WHERE l.user.code = :userCode AND l.post.code = :postCode")
    Optional<Like> findByUserCodeAndPostCode(@Param("userCode") UUID userCode, @Param("postCode") UUID postCode);

    @Query("SELECT l From Like l WHERE l.user.id = :userId")
    Page<Like> findByLike(@Param("userId") Long userId, Pageable pageable);
}
