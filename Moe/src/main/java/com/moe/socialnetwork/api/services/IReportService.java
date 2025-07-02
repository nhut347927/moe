package com.moe.socialnetwork.api.services;

import java.util.UUID;

import com.moe.socialnetwork.models.User;
/**
 * Author: nhutnm379
 */
public interface IReportService {
    void addReport(UUID postCode,String reason, User user);
}
