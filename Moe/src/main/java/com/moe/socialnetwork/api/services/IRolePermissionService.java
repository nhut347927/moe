package com.moe.socialnetwork.api.services;

import java.util.List;
import java.util.UUID;

import com.moe.socialnetwork.api.dtos.RPRolePermissionDTO;
/**
 * Author: nhutnm379
 */
public interface IRolePermissionService {
    List<RPRolePermissionDTO> getPermissionsByUser(UUID userCode);

    void createOrUpdatePermission(List<RPRolePermissionDTO> rolePermissions);

    void deletePermission(String code);
}
