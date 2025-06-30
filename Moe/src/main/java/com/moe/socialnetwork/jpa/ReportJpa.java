package com.moe.socialnetwork.jpa;

import org.springframework.data.jpa.repository.JpaRepository;

import com.moe.socialnetwork.models.Report;

public interface ReportJpa extends JpaRepository<Report, Long>{

}
