package com.moe.socialnetwork.jpa;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.moe.socialnetwork.models.PostPlaylist;
/**
 * Author: nhutnm379
 */
public interface PostPlaylistJPA extends JpaRepository<PostPlaylist, Long> {
    @Query("SELECT pl FROM PostPlaylist pl WHERE pl.playlist.id = :playlistId AND pl.post.id = :postId")
    Optional<PostPlaylist> findPostPlaylistByPlaylistIdAndPostId(Long playlistId, Long postId);
}
