package com.moe.socialnetwork.jpa;

import org.springframework.data.jpa.repository.JpaRepository;

import com.moe.socialnetwork.models.Image;
/**
 * Author: nhutnm379
 */
public interface ImageJPA extends JpaRepository<Image, Long>{
    
}
