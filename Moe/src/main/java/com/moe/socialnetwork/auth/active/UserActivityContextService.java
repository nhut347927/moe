package com.moe.socialnetwork.auth.active;

import java.time.LocalDateTime;

import java.util.List;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.moe.socialnetwork.api.dtos.ZRPPageDTO;

@Service
public class UserActivityContextService {
    private final ConcurrentHashMap<String, UserActivity> activeUsers = new ConcurrentHashMap<>();

    // Add or update user activity
    public void addUserActivity(String userCode, String displayName, String ip) {
        LocalDateTime now = LocalDateTime.now();
        activeUsers.compute(userCode, (key, existing) -> {
            if (existing == null || now.isAfter(existing.getFirstAccessTime().plusHours(24))) {
                // New user or 24-hour window expired, create new entry
                return new UserActivity(userCode, displayName, ip, now);
            }
            // Existing user within 24 hours, keep original firstAccessTime
            return existing;
        });
    }

    public ZRPPageDTO<UserActivity> getActiveUsers(String query, int page, int size) {
        // Input validation
        if (page < 0)
            page = 0;
        if (size <= 0)
            size = 10; // Default size
        String normalizedQuery = query != null ? query.trim().toLowerCase() : "";

        // Step 1: Filter active users based on query
        List<UserActivity> filteredUsers = activeUsers.values().stream()
                .filter(user -> normalizedQuery.isEmpty() ||
                        user.getUserCode().toLowerCase().contains(normalizedQuery) ||
                        user.getIp().toLowerCase().contains(normalizedQuery)
                        || user.getDisplayName().toLowerCase().contains(normalizedQuery))
                .collect(Collectors.toList());

        // Step 2: Calculate pagination parameters
        long totalElements = filteredUsers.size();
        int totalPages = (int) Math.ceil((double) totalElements / size);
        int startIndex = page * size;
        int endIndex = Math.min(startIndex + size, filteredUsers.size());

        // Ensure indices are valid
        if (startIndex >= totalElements) {
            startIndex = 0;
            endIndex = 0;
        }

        // Step 3: Extract paginated content
        List<UserActivity> contents = startIndex < endIndex
                ? filteredUsers.subList(startIndex, endIndex)
                : List.of();

        // Step 4: Build ZRPPageDTO
        return new ZRPPageDTO<>(
                contents,
                totalElements,
                totalPages,
                page,
                size,
                page < totalPages - 1, // hasNext
                page > 0 // hasPrevious
        );
    }

    // Remove users inactive for more than 24 hours
    public void cleanupInactiveUsers() {
        LocalDateTime now = LocalDateTime.now();
        activeUsers.entrySet().removeIf(entry -> now.isAfter(entry.getValue().getFirstAccessTime().plusHours(24)));
    }
}