package com.moe.socialnetwork.api.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.moe.socialnetwork.api.dtos.ZRQDeleteDTO;
import com.moe.socialnetwork.api.dtos.RPListRolePerDTO;
import com.moe.socialnetwork.api.dtos.RPRolePermissionDTO;
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

    @GetMapping("/user/{userCode}")
    public ResponseEntity<ResponseAPI<List<RPRolePermissionDTO>>> getPermissionsByUser(@PathVariable String userCode) {
        List<RPRolePermissionDTO> permissions = rolePermissionService.getPermissionsByUser(userCode);
        ResponseAPI<List<RPRolePermissionDTO>> response = new ResponseAPI<>();
        response.setCode(HttpStatus.OK.value());
        response.setMessage("Success");
        response.setData(permissions);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/create-or-update")
    public ResponseEntity<ResponseAPI<String>> createOrUpdatePermission(@RequestBody @Valid RPListRolePerDTO dto) {
        rolePermissionService.createOrUpdatePermission(dto);
        ResponseAPI<String> response = new ResponseAPI<>();
        response.setCode(HttpStatus.OK.value());
        response.setMessage("Permissions updated successfully");
        response.setData("OK");
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/delete")
    public ResponseEntity<ResponseAPI<String>> deletePermission(@RequestBody @Valid ZRQDeleteDTO code) {
        rolePermissionService.deletePermission(code);
        ResponseAPI<String> response = new ResponseAPI<>();
        response.setCode(HttpStatus.OK.value());
        response.setMessage("Permissions deleted successfully");
        response.setData("OK");
        return ResponseEntity.ok(response);
    }
}