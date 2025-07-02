package com.moe.socialnetwork.jpa;

import org.springframework.data.jpa.repository.JpaRepository;

import com.moe.socialnetwork.models.Feedback;
/**
 * Author: nhutnm379
 */
public interface FeedbackJPA extends JpaRepository<Feedback, Long>{

}
