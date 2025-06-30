package com.moe.socialnetwork.jpa;

import org.springframework.data.jpa.repository.JpaRepository;

import com.moe.socialnetwork.models.Message;

public interface MessageJpa extends JpaRepository<Message, Long>{

}
