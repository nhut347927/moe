package com.moe.socialnetwork.jpa;

import java.util.List;
// Removed incorrect import. Use java.util.Optional instead.
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.moe.socialnetwork.models.Tag;
/**
 * Author: nhutnm379
 */
public interface TagJPA extends JpaRepository<Tag, Long> {

    @Query("SELECT t FROM Tag t WHERE t.name = :name")
    Optional<Tag> findByName(@Param("name") String name);

    // 🔍 Tìm kiếm tag theo tên gần đúng (case-insensitive)
    @Query("SELECT t FROM Tag t WHERE LOWER(t.name) LIKE LOWER(CONCAT('%', :keyword, '%')) ORDER BY t.usageCount DESC")
    List<Tag> searchTags(@Param("keyword") String keyword, Pageable pageable);

    // 🔍 Tìm tag theo code (UUID)
    @Query("SELECT t FROM Tag t WHERE t.code = :code")
    Optional<Tag> findByCode(@Param("code") UUID code);

    @Query("SELECT COUNT(t) > 0 FROM Tag t WHERE LOWER(t.name) = LOWER(:name)")
    boolean existsByNameIgnoreCase(@Param("name") String name);

}
