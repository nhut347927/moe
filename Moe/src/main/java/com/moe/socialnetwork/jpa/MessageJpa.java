package com.moe.socialnetwork.jpa;

import org.springframework.data.jpa.repository.JpaRepository;

import com.moe.socialnetwork.models.Message;
/**
 * Author: nhutnm379
 */
public interface MessageJPA extends JpaRepository<Message, Long>{

}
