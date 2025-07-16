package com.moe.socialnetwork.jpa;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.moe.socialnetwork.models.Post;

/**
 * Author: nhutnm379
 */
public interface PostJPA extends JpaRepository<Post, Long> {

  @Query("SELECT p FROM Post p JOIN p.user u LEFT JOIN p.audio a WHERE p.isDeleted = false AND p.visibility = 'PUBLIC' AND p.type = 'VID' AND a IS NULL AND (p.title LIKE %:keyword% OR u.displayName LIKE %:keyword%)")
  List<Post> findByKeyword(@Param("keyword") String keyword, Pageable pageable);

  // Lấy top 25 tagId mà user đã like
  @Query("SELECT t.id FROM Tag t JOIN t.postTags pt JOIN pt.post p JOIN p.likes l WHERE l.user.id = :userId GROUP BY t.id ORDER BY COUNT(l.id) DESC")
  List<Long> findTopTagIdsUserLiked(@Param("userId") Long userId, Pageable pageable);

  // Lấy các post chứa tag, chưa xem
  @Query("SELECT DISTINCT p FROM Post p JOIN p.postTags pt WHERE pt.tag.id IN :tagIds AND p.id NOT IN (SELECT v.post.id FROM View v WHERE v.user.id = :userId) AND p.isDeleted = false AND p.visibility = 'PUBLIC'")
  List<Post> findUnviewedPostsByTags(@Param("userId") Long userId, @Param("tagIds") List<Long> tagIds);

  // Lấy post chưa xem bất kỳ
  @Query("SELECT p FROM Post p WHERE p.id NOT IN (SELECT v.post.id FROM View v WHERE v.user.id = :userId) AND p.isDeleted = false AND p.visibility = 'PUBLIC' ORDER BY FUNCTION('RAND')")
  List<Post> findRandomUnviewedPosts(@Param("userId") Long userId, Pageable pageable);

  // Lấy post ngẫu nhiên
  @Query("SELECT p FROM Post p WHERE p.isDeleted = false AND p.visibility = 'PUBLIC' ORDER BY FUNCTION('RAND')")
  List<Post> findRandomPosts(Pageable pageable);

  @Query("""
      SELECT EXISTS (
          SELECT 1
          FROM UserPlaylist up
          JOIN up.playlist p
          JOIN p.postPlaylists pp
          WHERE up.user.id = :userId AND pp.post.id = :postId
      )
      """)
  boolean existsPostInAnyUserPlaylist(@Param("userId") Long userId, @Param("postId") Long postId);

  @Query("SELECT p FROM Post p WHERE p.isDeleted = false AND p.visibility = 'PUBLIC' AND p.code = :postCode")
  Optional<Post> findPostByPostCode(@Param("postCode") UUID postCode);

  @Query("SELECT p FROM Post p WHERE p.isDeleted = false AND p.visibility = 'PUBLIC' " +
      "AND (LOWER(p.title) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR LOWER(p.description) LIKE LOWER(CONCAT('%', :searchTerm, '%')))")
  Page<Post> findPostsByTitleOrDescription(@Param("searchTerm") String searchTerm, Pageable pageable);

  @Query("SELECT p FROM Post p WHERE p.isDeleted = false AND p.visibility = 'PUBLIC' AND" +
      "(LOWER(p.title) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
      "OR LOWER(p.description) LIKE LOWER(CONCAT('%', :keyword, '%')))")
  Page<Post> searchPostsByKeyword(@Param("keyword") String keyword, Pageable pageable);

  @Query("SELECT p FROM Post p WHERE p.isDeleted = false AND p.visibility = 'PUBLIC' AND p.user.code = :userCode")
  Page<Post> findByUserPaged(@Param("userCode") UUID userCode, Pageable pageable);

}
