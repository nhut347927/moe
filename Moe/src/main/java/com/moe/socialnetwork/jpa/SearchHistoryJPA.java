package com.moe.socialnetwork.jpa;

import com.moe.socialnetwork.api.dtos.RPKeywordCountDTO;
import com.moe.socialnetwork.models.SearchHistory;
import com.moe.socialnetwork.models.User;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface SearchHistoryJPA extends JpaRepository<SearchHistory, Long> {

    @Query("SELECT s FROM SearchHistory s WHERE s.user = :user")
    Page<SearchHistory> getByUser(@Param("user") User user, Pageable pageable);

    @Modifying
    @Query("DELETE FROM SearchHistory s WHERE s.code = :code")
    void deleteByCode(@Param("code") UUID code);

    @Query("SELECT new com.moe.socialnetwork.api.dtos.RPKeywordCountDTO(s.keyword, COUNT(s.keyword)) " +
            "FROM SearchHistory s " +
            "GROUP BY s.keyword " +
            "ORDER BY COUNT(s.keyword) DESC")
    List<RPKeywordCountDTO> findTopKeywords(Pageable pageable);

    @Query("""
                SELECT DISTINCT s.keyword
                FROM SearchHistory s
                WHERE LOWER(s.keyword) LIKE LOWER(CONCAT(:prefix, '%'))
            """)
    List<String> findTopKeywordsByPrefix(@Param("prefix") String prefix, Pageable pageable);

}
