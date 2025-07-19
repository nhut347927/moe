package com.moe.socialnetwork.api.dtos;

import java.time.LocalDateTime;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Column;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Author: nhutnm379
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RPActivityLogDTO {

    private UUID code;
    private String type; // get/post/put/delete/path
    private String ip; // ip user
    private String responseCode;// 200, 500, 400, 404...
    private String message; // sự kiện gì
    private String error; // lỗi cụ thể
    private String data; // data json của request đó
    private String userCode; // mã người dùng thực hiện request
    private String createdAt;
}
