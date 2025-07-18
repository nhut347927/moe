package com.moe.socialnetwork.api.controllers;

import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.moe.socialnetwork.api.dtos.ZRQCodeAndContentDTO;
import com.moe.socialnetwork.api.services.IReportService;
import com.moe.socialnetwork.models.User;
import com.moe.socialnetwork.response.ResponseAPI;

import jakarta.validation.Valid;

/**
 * Author: nhutnm379
 */
@RestController
@RequestMapping("/api/reports")
public class ReportController {
    private final IReportService reportService;

    public ReportController(IReportService reportService) {
        this.reportService = reportService;
    }

    @PostMapping
    public ResponseEntity<ResponseAPI<Void>> createReport(
            @RequestBody @Valid ZRQCodeAndContentDTO request,
            @AuthenticationPrincipal User user) {

        reportService.addReport(UUID.fromString(request.getCode()), request.getContent(), user);

        ResponseAPI<Void> response = new ResponseAPI<>();
        response.setCode(HttpStatus.OK.value());
        response.setMessage("Success");
        response.setData(null);

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }
}
