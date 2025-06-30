package com.moe.socialnetwork.api.controllers;

import com.moe.socialnetwork.api.dtos.CodeDto;
import com.moe.socialnetwork.api.dtos.FileUploadRequestDTO;
import com.moe.socialnetwork.api.services.ICloudinaryService;
import com.moe.socialnetwork.api.services.impl.CloudinaryServiceImpl;
import com.moe.socialnetwork.response.ResponseAPI;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/api/file")
public class FileUploadController {

    private final ICloudinaryService cloudinaryService;

    public FileUploadController(CloudinaryServiceImpl cloudinaryService) {
        this.cloudinaryService = cloudinaryService;
    }

    @PostMapping("/upload/image")
    public ResponseEntity<ResponseAPI<String>> uploadImage(
        @Valid @ModelAttribute FileUploadRequestDTO request
    ) throws IOException {
        String publicId = cloudinaryService.uploadImage(request.getFile());
        ResponseAPI<String> response = new ResponseAPI<>();
        response.setCode(200);
        response.setMessage("Upload image successful");
        response.setData(publicId);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/upload/video")
    public ResponseEntity<ResponseAPI<String>> uploadVideo(
        @Valid @ModelAttribute FileUploadRequestDTO request
    ) throws IOException {
        String publicId = cloudinaryService.uploadVideo(request.getFile());
        ResponseAPI<String> response = new ResponseAPI<>();
        response.setCode(200);
        response.setMessage("Upload video successful");
        response.setData(publicId);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/upload/audio")
    public ResponseEntity<ResponseAPI<String>> uploadAudio(
        @Valid @ModelAttribute FileUploadRequestDTO request
    ) throws IOException {
        String publicId = cloudinaryService.uploadAudio(request.getFile());
        ResponseAPI<String> response = new ResponseAPI<>();
        response.setCode(200);
        response.setMessage("Upload audio successful");
        response.setData(publicId);
        return ResponseEntity.ok(response);
    }

    // Xóa file theo publicId
    @PostMapping("/delete")
    public ResponseEntity<ResponseAPI<String>> deleteFile(@RequestBody CodeDto request) throws IOException {
        boolean deleted = cloudinaryService.deleteFile(request.getCode());
        ResponseAPI<String> response = new ResponseAPI<>();
        if (deleted) {
            response.setCode(200);
            response.setMessage("Delete successful");
            return ResponseEntity.ok(response);
        } else {
            response.setCode(400);
            response.setMessage("Delete failed");
            return ResponseEntity.ok(response);
        }
    }
}
