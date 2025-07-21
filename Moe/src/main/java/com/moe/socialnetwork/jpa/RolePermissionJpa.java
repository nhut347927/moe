package com.moe.socialnetwork.jpa;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.moe.socialnetwork.models.RolePermission;
/**
 * Author: nhutnm379
 */
public interface RolePermissionJPA extends JpaRepository<RolePermission, Long> {
	@Query("SELECT rp FROM RolePermission rp JOIN rp.user u WHERE u.id = :userId")
	List<RolePermission> findRolePermissionsByUserId(@Param("userId") Long userId);

	@Query("SELECT rp FROM RolePermission rp JOIN rp.user u WHERE u.code = :code")
	List<RolePermission> findByUserCode(@Param("code") UUID code);

	// viết phương thức delete permisson theo code của user
	@Query("DeLETE FROM RolePermission rp WHERE rp.user.code = :code")
	void deleteByUserCode(@Param("code") UUID code);


	@Query("SELECT rp FROM RolePermission rp  WHERE rp.code = :roleCode")
	 Optional<RolePermission> findByCode(@Param("roleCode") UUID roleCode);
}