package com.moe.socialnetwork.jpa;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.moe.socialnetwork.models.Audio;
/**
 * Author: nhutnm379
 */
public interface AudioJPA extends JpaRepository<Audio, Long> {
    @Query("SELECT a FROM Audio a Join a.ownerPost p WHERE p.isDeleted = false AND a.ownerPost.id = :postId")
    Audio findAudioByOwnerPostId(Long postId);

    @Query("SELECT a FROM Audio a WHERE a.code = :audioCode")
    Optional<Audio> findAudioByCode(UUID audioCode);   
}
