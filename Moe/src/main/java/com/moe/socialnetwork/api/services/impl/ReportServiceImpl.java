package com.moe.socialnetwork.api.services.impl;

import java.util.UUID;

import org.springframework.stereotype.Service;

import com.moe.socialnetwork.api.services.IReportService;
import com.moe.socialnetwork.jpa.PostJpa;
import com.moe.socialnetwork.jpa.ReportJpa;
import com.moe.socialnetwork.models.Post;
import com.moe.socialnetwork.models.Report;
import com.moe.socialnetwork.models.User;
import com.moe.socialnetwork.exception.AppException;

@Service
public class ReportServiceImpl implements IReportService {

    private final ReportJpa reportJpa;
    private final PostJpa postJpa;

    public ReportServiceImpl(ReportJpa reportJpa, PostJpa postJpa) {
        this.reportJpa = reportJpa;
        this.postJpa = postJpa;
    }

    public void addReport(UUID postCode, String reason, User user) {
        Post post = postJpa.findPostByPostCode(postCode)
                .orElseThrow(() -> new AppException("Post not found.", 404));

        Report report = new Report();
        report.setUser(user);
        report.setPost(post);
        report.setReason(reason);
        report.setStatus("PENDING");
        reportJpa.save(report);
    }
}
