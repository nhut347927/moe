package com.moe.socialnetwork.jpa;

import org.springframework.data.jpa.repository.JpaRepository;

import com.moe.socialnetwork.models.Notification;

public interface NotificationJpa extends JpaRepository<Notification, Long>{

}
