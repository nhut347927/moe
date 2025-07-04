package com.moe.socialnetwork.api.controllers;

import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.moe.socialnetwork.api.dtos.RQReportDTO;
import com.moe.socialnetwork.api.services.IReportService;
import com.moe.socialnetwork.models.User;
import com.moe.socialnetwork.response.ResponseAPI;

import jakarta.validation.Valid;
/**
 * Author: nhutnm379
 */
@RestController
@RequestMapping("/api/report")
public class ReportController {
    private final IReportService iReportService;

    public ReportController(IReportService iReportService) {
        this.iReportService = iReportService;
    }

    @PostMapping("/create")
    public ResponseEntity<ResponseAPI<Void>> likeComment(
            @RequestBody @Valid RQReportDTO request,
            @AuthenticationPrincipal User user) {

        iReportService.addReport(UUID.fromString(request.getPostCode()), request.getReason(),
                user);

        ResponseAPI<Void> response = new ResponseAPI<>();
        response.setCode(HttpStatus.OK.value());
        response.setMessage("Report được tạo thành công");
        response.setData(null);

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }
}
