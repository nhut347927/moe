package com.moe.socialnetwork.api.services.impl;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.cloudinary.Transformation;
import com.cloudinary.utils.ObjectUtils;
import com.moe.socialnetwork.api.services.ICloudinaryService;

@Service
public class CloudinaryServiceImpl implements ICloudinaryService {
    private final Cloudinary cloudinary;

    public CloudinaryServiceImpl(Cloudinary cloudinary) {
        this.cloudinary = cloudinary;
    }

    public String uploadImage(MultipartFile file) throws IOException {
        Map<?, ?> response = cloudinary.uploader().upload(
                file.getBytes(),
                ObjectUtils.asMap(
                        "resource_type", "image",
                        "format", "jpg",
                        "folder", "images"));
        return (String) response.get("public_id");
    }

 public String uploadVideo(MultipartFile file) throws IOException {
        final long MAX_SIZE = 100 * 1024 * 1024; // 100MB

        // Validate file
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Video file cannot be null or empty.");
        }

        if (file.getSize() > MAX_SIZE) {
            throw new IllegalArgumentException("Video file is too large. Maximum size allowed is 100MB.");
        }

        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("video/")) {
            throw new IllegalArgumentException("File must be a video (e.g., MP4, AVI).");
        }

        try (InputStream inputStream = file.getInputStream()) {
            Map<String, Object> options = ObjectUtils.asMap(
                "resource_type", "video",
                "format", "mp4",
                "folder", "videos",
                "eager", List.of(
                    new Transformation()
                        .width(640)
                        .crop("scale")
                        .fetchFormat("mp4")
                        .quality("auto")
                        .videoCodec("auto")
                ),
                "eager_async", true,
                "async", true, // Force asynchronous upload
                "chunk_size", 5 * 1024 * 1024 // 5MB chunks
            );

            // Log upload details for debugging
            System.out.println("Uploading video: size=" + file.getSize() + ", contentType=" + contentType);
            Map<String, Object> response = cloudinary.uploader().uploadLarge(inputStream, options);
            System.out.println("Cloudinary response: " + response);

            String publicId = (String) response.get("public_id");
            if (publicId == null) {
                throw new IOException("Failed to retrieve public_id from Cloudinary response.");
            }
            return publicId;
        } catch (Exception e) {
            throw new IOException("Failed to upload video to Cloudinary: " + e.getMessage(), e);
        }
    }

    public String uploadAudio(MultipartFile file) throws IOException {
        Map<?, ?> response = cloudinary.uploader().upload(
                file.getBytes(),
                ObjectUtils.asMap(
                        "resource_type", "video",
                        "format", "mp3",
                        "folder", "audios"));
        return (String) response.get("public_id");
    }

    public String uploadAnyFile(MultipartFile file) throws IOException {
        Map<?, ?> response = cloudinary.uploader().upload(
                file.getBytes(),
                ObjectUtils.asMap(
                        "resource_type", "raw",
                        "folder", "files"));
        return (String) response.get("public_id");
    }

    public boolean deleteFile(String publicId) throws IOException {
        String resourceType = getResourceTypeFromPublicId(publicId);

        Map<String, Object> options = new HashMap<>();
        options.put("resource_type", resourceType);

        Map<?, ?> response = cloudinary.uploader().destroy(publicId, options);
        System.out.println("Delete response: " + response);
        return "ok".equals(response.get("result"));
    }

    private String getResourceTypeFromPublicId(String publicId) {
        if (publicId.startsWith("videos/")) {
            return "video";
        } else if (publicId.startsWith("audios/")) {
            return "raw"; // Cloudinary xài "raw" cho file audio
        } else if (publicId.startsWith("images/")) {
            return "image";
        }
        // fallback nếu không rõ
        return "image";
    }

    public String uploadImage(File file) throws IOException {
        Map<?, ?> response = cloudinary.uploader().upload(
                file,
                ObjectUtils.asMap(
                        "resource_type", "image",
                        "format", "jpg", // Chuyển đổi tất cả thành JPG
                        "folder", "images"));
        return (String) response.get("public_id");
    }

    public String uploadVideo(File file) throws IOException {
        Map<?, ?> response = cloudinary.uploader().upload(
                file,
                ObjectUtils.asMap(
                        "resource_type", "video",
                        "format", "mp4",
                        "folder", "videos"));
        return (String) response.get("public_id");
    }

    public String uploadAudio(File file) throws IOException {
        Map<?, ?> response = cloudinary.uploader().upload(
                file,
                ObjectUtils.asMap(
                        "resource_type", "video", // Cloudinary nhận audio là video
                        "format", "mp3",
                        "folder", "audios"));
        return (String) response.get("public_id");
    }

}