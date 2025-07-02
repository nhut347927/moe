package com.moe.socialnetwork.api.services.impl;

import java.util.UUID;

import org.springframework.stereotype.Service;

import com.moe.socialnetwork.api.services.IReportService;
import com.moe.socialnetwork.jpa.PostJPA;
import com.moe.socialnetwork.jpa.ReportJPA;
import com.moe.socialnetwork.models.Post;
import com.moe.socialnetwork.models.Report;
import com.moe.socialnetwork.models.User;
import com.moe.socialnetwork.exception.AppException;
/**
 * Author: nhutnm379
 */
@Service
public class ReportServiceImpl implements IReportService {

    private final ReportJPA reportJpa;
    private final PostJPA postJpa;

    public ReportServiceImpl(ReportJPA reportJpa, PostJPA postJpa) {
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
