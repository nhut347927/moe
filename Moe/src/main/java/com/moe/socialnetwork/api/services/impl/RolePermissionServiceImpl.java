package com.moe.socialnetwork.api.services.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.moe.socialnetwork.models.Role;
import com.moe.socialnetwork.api.dtos.RPRolePermissionDTO;
import com.moe.socialnetwork.api.services.IRolePermissionService;
import com.moe.socialnetwork.jpa.RoleJPA;
import com.moe.socialnetwork.jpa.RolePermissionJPA;
import com.moe.socialnetwork.jpa.UserJPA;
import com.moe.socialnetwork.models.RolePermission;
import com.moe.socialnetwork.models.User;
import com.moe.socialnetwork.exception.AppException;
/**
 * Author: nhutnm379
 */
@Service
public class RolePermissionServiceImpl implements IRolePermissionService {
    private final RolePermissionJPA rolePermissionJpa;
    private final UserJPA userJpa;
    private final RoleJPA roleJpa;

    public RolePermissionServiceImpl(RolePermissionJPA rolePermissionJpa, UserJPA userJpa, RoleJPA roleJpa) {
        this.rolePermissionJpa = rolePermissionJpa;
        this.userJpa = userJpa;
        this.roleJpa = roleJpa;
    }

    public List<RPRolePermissionDTO> getPermissionsByUser(String userCode) {
        List<RolePermission> rolePermission = rolePermissionJpa.findByUserCode(UUID.fromString(userCode));
        if (rolePermission.isEmpty()) {
            throw new AppException("No permissions found for user with code: " + userCode, 404);
        }
        return rolePermission.stream()
                .map(this::toDTO)
                .toList();
    }

    public void createOrUpdatePermission(List<RPRolePermissionDTO> rolePermissions) {
        // Lấy user
        String userCode = rolePermissions.get(0).getUserCode();
        User user = userJpa.findByCode(UUID.fromString(userCode))
                .orElseThrow(() -> new AppException("User not found or deleted",404));

        // Lấy tất cả role để cache
        List<Role> roles = roleJpa.findAll();

        // Danh sách gom tất cả entity cần lưu
        List<RolePermission> result = new ArrayList<>();

        // Xử lý từng RolePermissionDTO
        for (RPRolePermissionDTO perDto : rolePermissions) {
            Role role = roles.stream()
                    .filter(r -> r.getCode().toString().equals(perDto.getRoleCode()))
                    .findFirst()
                    .orElseThrow(() -> new AppException("Role not found", 404));

            RolePermission entity = new RolePermission();
            entity.setUser(user);
            entity.setRole(role);
            entity.setCanView(perDto.getCanView());
            entity.setCanInsert(perDto.getCanInsert());
            entity.setCanUpdate(perDto.getCanUpdate());
            entity.setCanDelete(perDto.getCanDelete());
            entity.setCanRestore(perDto.getCanRestore());

            if (perDto.getCode() != null && !perDto.getCode().isEmpty()) {
                try {
                    entity.setCode(UUID.fromString(perDto.getCode()));
                } catch (IllegalArgumentException ex) {
                    throw new AppException("Invalid UUID format: " + perDto.getCode(), 400);
                }
            }

            result.add(entity);
        }

        // Chỉ khi xử lý xong hết và không lỗi thì mới save
        rolePermissionJpa.saveAll(result);
    }

    public void deletePermission(String code) {
        rolePermissionJpa.deleteByUserCode(UUID.fromString(code));
    }

    private RPRolePermissionDTO toDTO(RolePermission entity) {
        return new RPRolePermissionDTO(
                entity.getCode().toString(),
                entity.getUser().getCode().toString(),
                entity.getRole().getCode().toString(),
                entity.getCanView(),
                entity.getCanInsert(),
                entity.getCanUpdate(),
                entity.getCanDelete(),
                entity.getCanRestore());
    }
}