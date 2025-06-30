package com.moe.socialnetwork.jpa;

import org.springframework.data.jpa.repository.JpaRepository;

import com.moe.socialnetwork.models.Image;

public interface ImageJpa extends JpaRepository<Image, Long>{
    
}
