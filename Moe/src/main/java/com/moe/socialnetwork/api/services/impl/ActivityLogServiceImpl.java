package com.moe.socialnetwork.api.services.impl;

import java.nio.charset.StandardCharsets;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.springframework.web.util.ContentCachingRequestWrapper;

import com.moe.socialnetwork.jpa.ActivityLogJPA;
import com.moe.socialnetwork.models.ActivityLog;
import com.moe.socialnetwork.models.User;

import jakarta.servlet.http.HttpServletRequest;

/**
 * Author: nhutnm379
 */
@Service
public class ActivityLogServiceImpl {
    private static final Logger logger = LoggerFactory.getLogger(ActivityLogServiceImpl.class);
    private static final int MAX_BODY_LENGTH = 1024; // Limit request body size
    private static final String DEFAULT_RESPONSE_CODE = "200"; // Default for successful requests

    private final ActivityLogJPA activityLogJPA;

    public ActivityLogServiceImpl(ActivityLogJPA activityLogJPA) {
        this.activityLogJPA = activityLogJPA;
    }

    public void logActivity(User user, String message, String error, String code, String data) {
        try {
            // Initialize log object
            ActivityLog log = new ActivityLog();
            log.setUser(user);
            log.setMessage(message);
            log.setError(error);
            if (!(code == null || code.isEmpty())) {
                log.setResponseCode(code);
            }
            if (data != null && !data.isEmpty()) {
                if (data.length() > 1024) {
                    data = data.substring(0, 1024); // Cắt bớt nếu quá dài
                }
                log.setData(data);
            }

            // Note: createdAt and code are set by @PrePersist in ActivityLog

            // Get HTTP request context
            ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder
                    .getRequestAttributes();
            if (attributes != null) {
                HttpServletRequest request = attributes.getRequest();
                enrichLogWithRequestDetails(log, request);
            } else {
                logger.warn("No HTTP request context available for logging activity for user: {}",
                        user != null ? user.getId() : "null");
                log.setMessage("[NON-HTTP] " + message);
                log.setType("NON-HTTP");
                log.setIp("0.0.0.0");
                log.setResponseCode(DEFAULT_RESPONSE_CODE);
            }

            // Sanitize sensitive data
            sanitizeLogData(log);

            activityLogJPA.save(log);
        } catch (Exception e) {
            logger.error("Failed to prepare log for Kafka: {}", e.getMessage(), e);
        }
    }

    private void enrichLogWithRequestDetails(ActivityLog log, HttpServletRequest request) {
        // Set HTTP-related fields
        log.setType(request.getMethod());
        log.setIp(request.getRemoteAddr());
        log.setResponseCode(DEFAULT_RESPONSE_CODE);

        String requestURI = request.getRequestURI();
        String queryString = request.getQueryString();
        String fullUri = queryString == null ? requestURI : requestURI + "?" + queryString;
        String userAgent = request.getHeader("User-Agent");

        // Get request body
        String requestBody = null;
        if (request instanceof ContentCachingRequestWrapper wrapper) {
            byte[] content = wrapper.getContentAsByteArray();
            if (content.length > 0) {
                requestBody = new String(content, StandardCharsets.UTF_8);
                if (requestBody.length() > MAX_BODY_LENGTH) {
                    requestBody = requestBody.substring(0, MAX_BODY_LENGTH) + "... [truncated]";
                }
            }
        } else {
            logger.debug("Request is not ContentCachingRequestWrapper; cannot capture body");
        }

        // Build full message
        StringBuilder fullMessage = new StringBuilder();
        fullMessage.append("[").append(log.getType()).append(" ").append(fullUri).append("] ");
        fullMessage.append("ClientIP: ").append(log.getIp());
        if (userAgent != null) {
            fullMessage.append(", UserAgent: ").append(userAgent);
        }
        fullMessage.append(" ").append(log.getMessage());
        log.setMessage(fullMessage.toString());

        // Set request body as data
        if (requestBody != null && !requestBody.isBlank()) {
            log.setData(requestBody);
        }
    }

    private void sanitizeLogData(ActivityLog log) {
        // Sanitize data and error fields
        if (log.getData() != null) {
            String sanitizedData = log.getData();
            sanitizedData = sanitizedData.replaceAll(
                    "(?i)(password|token|creditCard)\\s*[:=]\\s*[^\\s,\\n]+",
                    "$1: [REDACTED]");
            log.setData(sanitizedData);
        }
        if (log.getError() != null) {
            String sanitizedError = log.getError();
            sanitizedError = sanitizedError.replaceAll(
                    "(?i)(password|token|creditCard)\\s*[:=]\\s*[^\\s,\\n]+",
                    "$1: [REDACTED]");
            log.setError(sanitizedError);
        }
    }
}