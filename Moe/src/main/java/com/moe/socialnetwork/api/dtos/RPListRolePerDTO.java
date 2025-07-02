package com.moe.socialnetwork.api.dtos;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
/**
 * Author: nhutnm379
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RPListRolePerDTO {
    List<RPRolePermissionDTO> rolePermissions;
}