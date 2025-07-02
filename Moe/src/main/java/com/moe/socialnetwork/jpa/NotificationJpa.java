package com.moe.socialnetwork.jpa;

import org.springframework.data.jpa.repository.JpaRepository;

import com.moe.socialnetwork.models.Notification;
/**
 * Author: nhutnm379
 */
public interface NotificationJPA extends JpaRepository<Notification, Long>{

}
