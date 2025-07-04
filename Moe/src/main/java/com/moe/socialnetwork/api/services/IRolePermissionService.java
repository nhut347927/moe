package com.moe.socialnetwork.api.services;

import java.util.List;

import com.moe.socialnetwork.api.dtos.ZRQDeleteDTO;
import com.moe.socialnetwork.api.dtos.RPListRolePerDTO;
import com.moe.socialnetwork.api.dtos.RPRolePermissionDTO;
/**
 * Author: nhutnm379
 */
public interface IRolePermissionService {
    List<RPRolePermissionDTO> getPermissionsByUser(String userCode);

    void createOrUpdatePermission(RPListRolePerDTO dto);

    void deletePermission(ZRQDeleteDTO code);
}
