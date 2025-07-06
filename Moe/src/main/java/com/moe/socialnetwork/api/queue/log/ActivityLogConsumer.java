// package com.moe.socialnetwork.api.queue.log;

// import org.slf4j.Logger;
// import org.slf4j.LoggerFactory;
// import org.springframework.kafka.annotation.KafkaListener;
// import org.springframework.stereotype.Service;

// import com.moe.socialnetwork.jpa.ActivityLogJPA;
// import com.moe.socialnetwork.models.ActivityLog;

// /**
//  * Author: nhutnm379
//  */
// @Service
// public class ActivityLogConsumer {
//     private static final Logger logger = LoggerFactory.getLogger(ActivityLogConsumer.class);

//     private final ActivityLogJPA activityLogJPA;

//     public ActivityLogConsumer(ActivityLogJPA activityLogJPA) {
//         this.activityLogJPA = activityLogJPA;
//     }

//     @KafkaListener(topics = "activity-logs", groupId = "activity-log-group")
//     public void consumeActivityLog(ActivityLog log) {
//         try {
//             activityLogJPA.save(log);
//         } catch (Exception e) {
//             logger.error("Failed to save activity log to database: {}", e.getMessage(), e);
//         }
//     }
// }