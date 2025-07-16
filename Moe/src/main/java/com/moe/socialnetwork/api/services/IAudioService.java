package com.moe.socialnetwork.api.services;

import com.moe.socialnetwork.api.dtos.RPPostDTO;
import com.moe.socialnetwork.api.dtos.ZRPPageDTO;
import com.moe.socialnetwork.models.User;

/**
 * Author: nhutnm379
 */
public interface IAudioService {
    ZRPPageDTO<RPPostDTO> getPostUseAudio(User user, String code, int page, int size, String sort);
}
