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
import com.moe.socialnetwork.exception.AppException;
/**
 * Author: nhutnm379
 */
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

    private static final long MAX_SIZE = 100 * 1024 * 1024; // 100MB
    private static final long FIVE_MB = 5 * 1024 * 1024; // 5MB
    private static final int POLL_TIMEOUT_SECONDS = 60; // Max wait time
    private static final int POLL_INTERVAL_MS = 3000; // Poll every 3 seconds

    public String uploadVideo(MultipartFile file) throws IOException {
        // Validate file
        if (file == null || file.isEmpty()) {
            throw new AppException("Video file cannot be null or empty.",400);
        }

        if (file.getSize() > MAX_SIZE) {
            throw new AppException("Video file is too large. Maximum size allowed is 100MB.",400);
        }

        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("video/")) {
            throw new AppException("File must be a video (e.g., MP4, AVI).",400);
        }

        // Choose upload method based on file size
        if (file.getSize() <= FIVE_MB) {
            return uploadSmallVideo(file);
        } else {
            return uploadLargeVideo(file);
        }
    }

    private String uploadSmallVideo(MultipartFile file) throws IOException {
        try {
            Map<?, ?> response = cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.asMap(
                            "resource_type", "video",
                            "format", "mp4",
                            "folder", "videos"));

            return (String) response.get("public_id");
        } catch (Exception e) {
            throw new AppException("Failed to upload small video to Cloudinary: " + e.getMessage(), 500);
        }
    }

    private String uploadLargeVideo(MultipartFile file) throws IOException {
        try (InputStream inputStream = file.getInputStream()) {
            Map<String, Object> largeFileOptions = ObjectUtils.asMap(
                    "resource_type", "video",
                    "format", "mp4",
                    "folder", "videos",
                    "eager", List.of(
                            new Transformation()
                                    .width(640)
                                    .crop("scale")
                                    .fetchFormat("mp4")
                                    .quality("auto")
                                    .videoCodec("auto")),
                    "eager_async", true,
                    "async", true,
                    "chunk_size", 5 * 1024 * 1024, // 5MB chunks
                    "timeout", 180_000, // Higher timeout for large files
                    "filename", file.getOriginalFilename());

            // Log upload details
            System.out.println("Uploading large video: size=" + file.getSize() + ", contentType="
                    + file.getContentType() + ", filename=" + file.getOriginalFilename());
            Map<String, Object> response = cloudinary.uploader().uploadLarge(inputStream, largeFileOptions);
            System.out.println("Cloudinary response: " + response);

            String batchId = (String) response.get("batch_id");
            String publicId = (String) response.get("public_id");

            // If public_id is available, return it
            if (publicId != null) {
                return publicId;
            }

            // If async, poll for public_id
            if (batchId == null) {
                throw new AppException("Neither public_id nor batch_id found in Cloudinary response.",500);
            }

            // Poll for upload completion
            long startTime = System.currentTimeMillis();
            while (System.currentTimeMillis() - startTime < POLL_TIMEOUT_SECONDS * 1000) {
                try {
                    // Use Cloudinary API to check upload status
                    Map<String, Object> statusResponse = cloudinary.api().resources(
                            ObjectUtils.asMap("resource_type", "video", "prefix", "videos/"));
                    System.out.println("Status response: " + statusResponse);

                    List<Map<String, Object>> resources = (List<Map<String, Object>>) statusResponse.get("resources");
                    if (resources != null) {
                        for (Map<String, Object> resource : resources) {
                            String status = (String) resource.get("status");
                            publicId = (String) resource.get("public_id");
                            if ("failed".equals(status)) {
                                throw new AppException("Cloudinary upload failed for public_id: " + publicId,500);
                            }
                            if (publicId != null && status != null && status.equals("active")) {
                                return publicId;
                            }
                        }
                    }
                    // Wait before next poll
                    Thread.sleep(POLL_INTERVAL_MS);
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                    throw new AppException("Polling interrupted for batch_id: " + batchId, 500);
                } catch (Exception e) {
                    throw new AppException("Failed to check upload status for batch_id: " + batchId, 500);
                }
            }

            throw new AppException("Timeout waiting for Cloudinary upload to complete for batch_id: " + batchId,500);
        } catch (Exception e) {
            throw new AppException("Failed to upload large video to Cloudinary: " + e.getMessage(), 500);
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