package com.moe.socialnetwork.jpa;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.moe.socialnetwork.models.User;

/**
 * Author: nhutnm379
 */
public interface UserJPA extends JpaRepository<User, Long> {
	@Query("SELECT u FROM User u WHERE u.email = :email")
	Optional<User> findByEmail(@Param("email") String email);

	@Query("SELECT u FROM User u WHERE u.userName = :userName")
	Optional<User> findByUserName(@Param("userName") String userName);

	@Query("SELECT u FROM User u WHERE u.passwordResetToken = :passwordResetToken")
	Optional<User> findByPasswordResetToken(@Param("passwordResetToken") String passwordResetToken);

	@Query("SELECT u FROM User u WHERE u.code = :code AND u.isDeleted = false")
	Optional<User> findByCode(@Param("code") UUID code);

	@Query("""
			    SELECT u FROM User u
			    WHERE u.isDeleted = false
			      AND (LOWER(u.userName) LIKE LOWER(CONCAT('%', :keyword, '%'))
			        OR LOWER(u.displayName) LIKE LOWER(CONCAT('%', :keyword, '%')))
			""")
	Page<User> findUsersByKeyword(@Param("keyword") String keyword, Pageable pageable);

	// Query kiểm tra userName đã tồn tại, trừ chính người dùng có id
	@Query("SELECT COUNT(u) > 0 FROM User u WHERE u.userName = :userName AND u.id <> :excludedId")
	boolean existsUserNameExcludingId(@Param("userName") String userName, @Param("excludedId") Long excludedId);

	// Query kiểm tra displayName đã tồn tại, trừ chính người dùng có id
	@Query("SELECT COUNT(u) > 0 FROM User u WHERE u.displayName = :displayName AND u.id <> :excludedId")
	boolean existsDisplayNameExcludingId(@Param("displayName") String displayName,
			@Param("excludedId") Long excludedId);

	@Query("""
			    SELECT u FROM User u
			    WHERE
			        (:keyword IS NULL OR LOWER(u.email) LIKE LOWER(CONCAT('%', :keyword, '%')))
			        OR (:keyword IS NULL OR LOWER(u.userName) LIKE LOWER(CONCAT('%', :keyword, '%')))
			        OR (:keyword IS NULL OR LOWER(u.displayName) LIKE LOWER(CONCAT('%', :keyword, '%')))
			        OR (:keyword IS NULL OR LOWER(u.bio) LIKE LOWER(CONCAT('%', :keyword, '%')))
			        OR (:keyword IS NULL OR LOWER(u.provider) LIKE LOWER(CONCAT('%', :keyword, '%')))
			""")
	Page<User> searchUsers(@Param("keyword") String keyword, Pageable pageable);

}
