package com.moe.socialnetwork.jpa;

import org.springframework.data.jpa.repository.JpaRepository;

import com.moe.socialnetwork.models.ActivityLog;


/**
 * Author: nhutnm379
 */
public interface ActivityLogJPA extends JpaRepository<ActivityLog, Long>{

}
