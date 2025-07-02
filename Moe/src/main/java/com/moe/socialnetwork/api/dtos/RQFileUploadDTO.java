package com.moe.socialnetwork.api.dtos;

import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
/**
 * Author: nhutnm379
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RQFileUploadDTO {

    @NotNull(message = "File must not be null")
    private MultipartFile file;
}
