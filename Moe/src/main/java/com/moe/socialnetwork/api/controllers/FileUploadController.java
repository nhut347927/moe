package com.moe.socialnetwork.api.controllers;

import com.moe.socialnetwork.api.dtos.ZRQCodeAndContentDTO;
import com.moe.socialnetwork.api.dtos.RQFileUploadDTO;
import com.moe.socialnetwork.api.services.ICloudinaryService;
import com.moe.socialnetwork.api.services.impl.CloudinaryServiceImpl;
import com.moe.socialnetwork.response.ResponseAPI;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

/**
 * Author: nhutnm379
 */
@RestController
@RequestMapping("/api/files")
public class FileUploadController {

    private final ICloudinaryService cloudinaryService;

    public FileUploadController(CloudinaryServiceImpl cloudinaryService) {
        this.cloudinaryService = cloudinaryService;
    }

    @PostMapping("/images")
    public ResponseEntity<ResponseAPI<String>> uploadImage(
        @Valid @ModelAttribute RQFileUploadDTO request
    ) throws IOException {
        String publicId = cloudinaryService.uploadImage(request.getFile());
        ResponseAPI<String> response = new ResponseAPI<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(publicId);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/videos")
    public ResponseEntity<ResponseAPI<String>> uploadVideo(
        @Valid @ModelAttribute RQFileUploadDTO request
    ) throws IOException {
        String publicId = cloudinaryService.uploadVideo(request.getFile());
        ResponseAPI<String> response = new ResponseAPI<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(publicId);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/audios")
    public ResponseEntity<ResponseAPI<String>> uploadAudio(
        @Valid @ModelAttribute RQFileUploadDTO request
    ) throws IOException {
        String publicId = cloudinaryService.uploadAudio(request.getFile());
        ResponseAPI<String> response = new ResponseAPI<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(publicId);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/delete")
    public ResponseEntity<ResponseAPI<String>> deleteFile(
        @RequestBody ZRQCodeAndContentDTO request
    ) throws IOException {
        boolean deleted = cloudinaryService.deleteFile(request.getCode());
        ResponseAPI<String> response = new ResponseAPI<>();
        if (deleted) {
            response.setCode(200);
            response.setMessage("Success");
        } else {
            response.setCode(400);
            response.setMessage("Success");
        }
        return ResponseEntity.ok(response);
    }
}
