package com.moe.socialnetwork.jpa;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.moe.socialnetwork.models.Follower;
/**
 * Author: nhutnm379
 */
public interface FollowerJPA extends JpaRepository<Follower, Long> {
    @Query("SELECT COUNT(f) > 0 FROM Follower f WHERE f.follower.code = :followerCode AND f.followed.code = :followedCode")
    boolean checkExistsByUserFollowerCodeAndUserFollowedCode(
            @Param("followerCode") UUID followerCode,
            @Param("followedCode") UUID followedCode);

    @Query("SELECT f FROM Follower f WHERE f.follower.code = :followerCode AND f.followed.code = :followedCode")
    Optional<Follower> findFollowerByUserFollowerCodeAndUserFollowedCode(
            @Param("followerCode") UUID followerCode,
            @Param("followedCode") UUID followedCode);

}
