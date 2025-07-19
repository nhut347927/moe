package com.moe.socialnetwork.auth.active;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
/**
 * Author: nhutnm379
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserActivity {
    private String userCode;
    private String displayName;
    private String ip;
    private LocalDateTime firstAccessTime;
}