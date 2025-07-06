package com.moe.socialnetwork.models;

import java.time.LocalDateTime;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Author: nhutnm379
 */
@Entity
@Table(name = "ActivityLogs")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ActivityLog {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(unique = true, nullable = false, updatable = false)
	private UUID code;

	@Column(name = "type", length = 255)
	private String type;	  //get/post/put/delete/path

	@Column(name = "ip", length = 255)
	private String ip;	//ip user
	
	@Column(name = "response_code", length = 255)
	private String responseCode;//200, 500, 400, 404...

	@Column(name = "message", columnDefinition = "TEXT")
	private String message;	// sự kiện gì

	@Column(name = "error", columnDefinition = "TEXT")
	private String error; // lỗi cụ thể

	@Column(name = "data", columnDefinition = "TEXT")
	private String data; //data json của request đó

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "user_id", updatable = false)
	@JsonBackReference
	private User user;

	@Column(name = "created_at", nullable = false, updatable = false)
	private LocalDateTime createdAt;

	@PrePersist
	protected void onCreate() {
		this.createdAt = LocalDateTime.now();
		this.code = UUID.randomUUID();

	}
}
