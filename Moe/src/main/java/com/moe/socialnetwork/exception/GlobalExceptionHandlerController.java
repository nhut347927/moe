package com.moe.socialnetwork.exception;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import com.moe.socialnetwork.api.services.IActivityLogService;
import com.moe.socialnetwork.models.User;
import com.moe.socialnetwork.response.ResponseAPI;

/**
 * Author: nhutnm379
 */
@ControllerAdvice
public class GlobalExceptionHandlerController {
    private final IActivityLogService activityLogService;

    public GlobalExceptionHandlerController(IActivityLogService activityLogService) {
        this.activityLogService = activityLogService;
    }

    private User getAuthenticatedUser() {
        try {
            Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            if (principal instanceof User) {
                return (User) principal;
            }
            return null;
        } catch (Exception e) {
            return null;
        }
    }

    private String sanitizeMessage(String message) {
        if (message == null) {
            return null;
        }
        // Sanitize sensitive data
        String sanitized = message.replaceAll("(?i)(password|token|creditCard)\\s*[:=]\\s*[^\\s,\\n]+", "$1: [REDACTED]");
        // Truncate to 255 characters
        return sanitized;
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ResponseAPI<Map<String, String>>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors()
                .forEach(error -> errors.put(error.getField(), error.getDefaultMessage()));

        String message = "Validation error: " + errors.toString();
        User user = getAuthenticatedUser();
        activityLogService.logActivity(user, "Validation error", sanitizeMessage(message), String.valueOf(HttpStatus.BAD_REQUEST.value()), null);

        return ResponseEntity.badRequest()
                .body(ResponseAPI.error(HttpStatus.BAD_REQUEST.value(), "Validation failed", errors));
    }

    @ExceptionHandler(AppException.class)
    public ResponseEntity<ResponseAPI<Map<String, String>>> handleAppException(AppException ex) {
        String message = "AppException: Code " + ex.getStatusCode() + " - " + ex.getMessage();
        User user = getAuthenticatedUser();
        activityLogService.logActivity(user, "Application error", sanitizeMessage(message),String.valueOf(ex.getStatusCode()),null);

        return ResponseEntity.status(ex.getStatusCode())
                .body(ResponseAPI.error(ex.getStatusCode(), sanitizeMessage(ex.getMessage()), new HashMap<>()));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ResponseAPI<Map<String, String>>> handleGlobalException(Exception ex) {
        String message = "Unexpected error: " + ex.getClass().getSimpleName() + " - " + ex.getMessage();
        User user = getAuthenticatedUser();
        activityLogService.logActivity(user, "Unexpected error", sanitizeMessage(message),"500",null);

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ResponseAPI.error(HttpStatus.INTERNAL_SERVER_ERROR.value(), "An unexpected error occurred", new HashMap<>()));
    }
}