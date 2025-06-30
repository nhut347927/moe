package com.moe.socialnetwork.common.jpa;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.moe.socialnetwork.common.models.View;

import io.lettuce.core.dynamic.annotation.Param;

public interface ViewJpa extends JpaRepository<View, Long> {

    @Query("SELECT COUNT(v) > 0 FROM View v WHERE v.post.code = :postCode AND v.user.code = :userCode")
    boolean checkExistsByPostCodeAndUserCode(@Param("postCode") UUID postCode, @Param("userCode") UUID userCode);

}
