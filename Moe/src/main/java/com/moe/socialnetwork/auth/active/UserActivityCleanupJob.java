package com.moe.socialnetwork.auth.active;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class UserActivityCleanupJob {

    private final UserActivityContextService userActivityContextService;

    public UserActivityCleanupJob(UserActivityContextService userActivityContextService) {
        this.userActivityContextService = userActivityContextService;
    }

    // Chạy mỗi 10 phút (600.000 ms)
    @Scheduled(fixedRate = 600_000)
    public void cleanupInactiveUsers() {
        System.out.println("[Scheduled] Cleaning up inactive users...");
        userActivityContextService.cleanupInactiveUsers();
    }
}
