package com.moe.socialnetwork.jpa;

import org.springframework.data.jpa.repository.JpaRepository;

import com.moe.socialnetwork.models.Feedback;

public interface FeedbackJpa extends JpaRepository<Feedback, Long>{

}
