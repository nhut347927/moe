package com.moe.socialnetwork.jpa;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.moe.socialnetwork.models.View;

/**
 * Author: nhutnm379
 */
public interface ViewJPA extends JpaRepository<View, Long> {

    @Query("SELECT COUNT(v) > 0 FROM View v WHERE v.post.code = :postCode AND v.user.code = :userCode")
    boolean checkExistsByPostCodeAndUserCode(@Param("postCode") UUID postCode, @Param("userCode") UUID userCode);

    @Query("SELECT v From View v WHERE v.user.id = :userId")
    Page<View> findByView(@Param("userId") Long userId, Pageable pageable);
}
