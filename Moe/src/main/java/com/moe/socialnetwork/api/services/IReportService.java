package com.moe.socialnetwork.api.services;

import java.util.UUID;

import com.moe.socialnetwork.common.models.User;

public interface IReportService {
    void addReport(UUID postCode,String reason, User user);
}
