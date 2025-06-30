package com.moe.socialnetwork.jpa;

import org.springframework.data.jpa.repository.JpaRepository;

import com.moe.socialnetwork.models.PostTag;

public interface PostTagJpa extends JpaRepository<PostTag, Long> {

}
