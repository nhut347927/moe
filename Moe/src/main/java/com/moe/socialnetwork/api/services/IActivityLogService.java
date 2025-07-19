package com.moe.socialnetwork.api.services;

import com.moe.socialnetwork.api.dtos.RPActivityLogDTO;
import com.moe.socialnetwork.api.dtos.ZRPPageDTO;
import com.moe.socialnetwork.models.User;

public interface IActivityLogService {
     void logActivity(User user, String message, String error, String code, String data);
     ZRPPageDTO<RPActivityLogDTO> getLog(String query, int page, int size, String sort);
}
