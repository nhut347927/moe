package com.moe.socialnetwork.auth.security;

import java.io.IOException;

import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.util.ContentCachingRequestWrapper;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.moe.socialnetwork.api.services.IActivityLogService;
import com.moe.socialnetwork.api.services.impl.ActivityLogServiceImpl;
import com.moe.socialnetwork.auth.active.UserActivityContextService;
import com.moe.socialnetwork.auth.services.impl.TokenServiceImpl;
import com.moe.socialnetwork.models.User;
import com.moe.socialnetwork.response.ResponseAPI;
import com.moe.socialnetwork.exception.AppException;

import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/**
 * Author: nhutnm379
 */
@Component
public class JwtRequestFilter extends OncePerRequestFilter {

    private final CustomUserDetailsService userDetailsService;

    private final TokenServiceImpl tokenService;

    private final IActivityLogService activityLogService;

    private final UserActivityContextService userActivityContextService;

    public JwtRequestFilter(CustomUserDetailsService userDetailsService, TokenServiceImpl tokenService,
            IActivityLogService activityLogService, UserActivityContextService userActivityContextService) {
        this.userDetailsService = userDetailsService;
        this.tokenService = tokenService;
        this.activityLogService = activityLogService;
        this.userActivityContextService = userActivityContextService;
    }

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response,
            @NonNull FilterChain chain) throws ServletException, IOException {

        ContentCachingRequestWrapper wrappedRequest = new ContentCachingRequestWrapper(request);

        String jwt = extractToken(wrappedRequest);
        String email = null;
        User user = null;

        // Skip token validation for public endpoints
        if (isPublicEndpoint(wrappedRequest)) {
            chain.doFilter(wrappedRequest, response);
            return;
        }

        if (jwt == null) {
            chain.doFilter(wrappedRequest, response); // vẫn cho đi để đọc body rồi mới log
            logFailure(null, "Missing JWT token", null, "401", wrappedRequest);
            sendErrorResponse(response, "JWT token is missing", 401);
            return;
        }

        try {
            if (tokenService.validateJwtToken(jwt)) {
                email = tokenService.getEmailFromJwtToken(jwt);
            } else {
                chain.doFilter(wrappedRequest, response);
                logFailure(null, "Invalid JWT token", null, "401", wrappedRequest);
                sendErrorResponse(response, "Invalid JWT token", 401);
                return;
            }
        } catch (ExpiredJwtException e) {
            chain.doFilter(wrappedRequest, response);
            logFailure(null, "Expired JWT token", e.getMessage(), "401", wrappedRequest);
            sendErrorResponse(response, "JWT token has expired. Please log in again.", 401);
            return;
        } catch (AppException e) {
            chain.doFilter(wrappedRequest, response);
            logFailure(null, "Authentication error: AppException", e.getMessage(), "401", wrappedRequest);
            sendErrorResponse(response, "Application error: " + sanitizeMessage(e.getMessage()), 500);
            return;
        } catch (Exception e) {
            chain.doFilter(wrappedRequest, response);
            logFailure(null, "Invalid JWT token format", e.getMessage(), "401", wrappedRequest);
            sendErrorResponse(response, "Invalid JWT token format", 401);
            return;
        }

        if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = userDetailsService.loadUserByUsername(email);

            if (userDetails != null) {
                user = (User) userDetails;
                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities());
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(wrappedRequest));
                SecurityContextHolder.getContext().setAuthentication(authentication);
            } else {
                chain.doFilter(wrappedRequest, response);
                logFailure(null, "User not found for email", email, "401", wrappedRequest);
                sendErrorResponse(response, "User not found", 401);
                return;
            }
        }

        // Gọi các filter/controller khác
        chain.doFilter(wrappedRequest, response);

        // Sau khi request đã xử lý xong -> Lấy body/log
        logSuccess(user, "Successful authentication for user: " + email, wrappedRequest);
    }

    private String extractToken(HttpServletRequest request) {
        // Extract token from cookie
        String jwt = tokenService.extractAccessTokenFromCookie(request);

        // If no token in cookie, try Authorization header
        if (jwt == null) {
            String authHeader = request.getHeader("Authorization");
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                jwt = authHeader.substring(7); // Remove "Bearer " prefix
            }
        }

        return jwt;
    }

    private boolean isPublicEndpoint(HttpServletRequest request) {
        String path = request.getRequestURI();
        return path.startsWith("/api/auth/register") ||
                path.startsWith("/api/auth/login") ||
                path.startsWith("/api/auth/google-login") ||
                path.startsWith("/api/auth/change-password") ||
                path.startsWith("/api/auth/password-reset-request") ||
                path.startsWith("/api/auth/password-reset") ||
                path.startsWith("/api/auth/refresh-token") ||
                path.startsWith("/api/file/upload-image") ||
                path.startsWith("/api/file/upload-video") ||
                path.startsWith("/api/file/upload-audio") ||
                path.startsWith("/api/file/upload-any");
    }

    private void sendErrorResponse(HttpServletResponse response, String message, int statusCode) throws IOException {
        ResponseAPI<String> res = new ResponseAPI<>();
        res.setCode(statusCode);
        res.setMessage(message);
        res.setData(null);

        response.setStatus(statusCode);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        ObjectMapper mapper = new ObjectMapper();
        String jsonResponse = mapper.writeValueAsString(res);
        response.getWriter().write(jsonResponse);
        response.getWriter().flush();
    }

    private String sanitizeMessage(String message) {
        if (message == null) {
            return null;
        }
        String sanitized = message.replaceAll("(?i)(password|token|creditCard)\\s*[:=]\\s*[^\\s,\\n]+",
                "$1: [REDACTED]");
        return sanitized;
    }

    private String getRequestBody(ContentCachingRequestWrapper request) {
        byte[] buf = request.getContentAsByteArray();
        if (buf.length == 0) {
            return "";
        }
        try {
            return new String(buf, 0, buf.length,
                    request.getCharacterEncoding() != null ? request.getCharacterEncoding() : "UTF-8");
        } catch (Exception e) {
            return "[Error reading request body]";
        }
    }

    private void logFailure(User user, String message, String error, String statusCode, HttpServletRequest req) {
        String query = getQueryOrBody(req);
        String path = req.getRequestURI();
        // Lấy địa chỉ IP
        String ip = req.getHeader("X-Forwarded-For");
        if (ip == null || ip.isEmpty()) {
            ip = req.getRemoteAddr();
        }

        if (!(path.startsWith("/api/logs") || path.startsWith("/api/logs/active-users"))) {
            activityLogService.logActivity(user, message, error, statusCode, query);
        }

        // Gắn IP vào message để ghi lại
        String fullMessage = String.format("[%s] %s", ip, message);

        userActivityContextService.addUserActivity(user.getCode().toString(), user.getDisplayName(), fullMessage);
    }

    private void logSuccess(User user, String message, HttpServletRequest req) {
        String query = getQueryOrBody(req);
        String path = req.getRequestURI();
        // Lấy địa chỉ IP
        String ip = req.getHeader("X-Forwarded-For");
        if (ip == null || ip.isEmpty()) {
            ip = req.getRemoteAddr();
        }

        if (!(path.startsWith("/api/logs") || path.startsWith("/api/logs/active-users"))) {
            activityLogService.logActivity(user, message, null, "200", query);
        }

        // Gắn IP vào message để ghi lại
        String fullMessage = String.format("[%s] %s", ip, message);

        userActivityContextService.addUserActivity(user.getCode().toString(), user.getDisplayName(), fullMessage);
    }

    private String getQueryOrBody(HttpServletRequest request) {
        String method = request.getMethod();
        if ("GET".equalsIgnoreCase(method)) {
            return request.getQueryString();
        }
        return getRequestBody((ContentCachingRequestWrapper) request);
    }

}