package com.moe.socialnetwork.jpa;

import org.springframework.data.jpa.repository.JpaRepository;

import com.moe.socialnetwork.models.ActivityLog;



public interface ActivityLogJpa extends JpaRepository<ActivityLog, Long>{

}
