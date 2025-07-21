package com.moe.socialnetwork.api.controllers;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.moe.socialnetwork.api.dtos.RPListRolePerDTO;
import com.moe.socialnetwork.api.dtos.RPRolePermissionDTO;
import com.moe.socialnetwork.api.dtos.ZRQCodeAndContentDTO;
import com.moe.socialnetwork.api.services.IRolePermissionService;
import com.moe.socialnetwork.response.ResponseAPI;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

/**
 * Author: nhutnm379
 */
@RestController
@RequestMapping("/api/role-permission")
@RequiredArgsConstructor
public class RolePermissionController {

    private final IRolePermissionService rolePermissionService;

    @GetMapping("/user")
    public ResponseEntity<ResponseAPI<List<RPRolePermissionDTO>>> getPermissionsByUser(
            @ModelAttribute ZRQCodeAndContentDTO request) {

        List<RPRolePermissionDTO> permissions = rolePermissionService.getPermissionsByUser(UUID.fromString(request.getCode()));

        ResponseAPI<List<RPRolePermissionDTO>> response = new ResponseAPI<>();
        response.setCode(HttpStatus.OK.value());
        response.setMessage("Success");
        response.setData(permissions);

        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<ResponseAPI<String>> createOrUpdatePermissions(
            @RequestBody @Valid RPListRolePerDTO dto) {

        rolePermissionService.createOrUpdatePermission(dto.getRolePermissions());

        ResponseAPI<String> response = new ResponseAPI<>();
        response.setCode(HttpStatus.OK.value());
        response.setMessage("Success");
        response.setData("OK");

        return ResponseEntity.ok(response);
    }

    @DeleteMapping
    public ResponseEntity<ResponseAPI<String>> deletePermission(
            @RequestBody @Valid ZRQCodeAndContentDTO code) {

        rolePermissionService.deletePermission(code.getCode());

        ResponseAPI<String> response = new ResponseAPI<>();
        response.setCode(HttpStatus.OK.value());
        response.setMessage("Success");
        response.setData("OK");

        return ResponseEntity.ok(response);
    }
}
