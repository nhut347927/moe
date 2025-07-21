package com.moe.socialnetwork.api.dtos;

import java.util.List;

import jakarta.validation.Valid;
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
    @Valid
    List<RPRolePermissionDTO> rolePermissions;
}