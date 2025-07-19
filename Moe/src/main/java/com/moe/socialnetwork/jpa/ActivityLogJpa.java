package com.moe.socialnetwork.jpa;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.moe.socialnetwork.models.ActivityLog;

/**
 * Author: nhutnm379
 */
public interface ActivityLogJPA extends JpaRepository<ActivityLog, Long> {
    @Query("""
                SELECT a FROM ActivityLog a
                WHERE
                    (:keyword IS NULL
                    OR LOWER(a.type) LIKE LOWER(CONCAT('%', :keyword, '%'))
                    OR LOWER(a.ip) LIKE LOWER(CONCAT('%', :keyword, '%'))
                    OR LOWER(a.responseCode) LIKE LOWER(CONCAT('%', :keyword, '%'))
                    OR LOWER(a.message) LIKE LOWER(CONCAT('%', :keyword, '%'))
                    OR LOWER(a.error) LIKE LOWER(CONCAT('%', :keyword, '%'))
                    OR LOWER(a.data) LIKE LOWER(CONCAT('%', :keyword, '%')))
            """)
    Page<ActivityLog> searchLogs(@Param("keyword") String keyword, Pageable pageable);
}
