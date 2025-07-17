package com.moe.socialnetwork.api.services;

import com.moe.socialnetwork.api.dtos.RPKeywordSearchTimeDTO;
import com.moe.socialnetwork.api.dtos.RPPostDTO;
import com.moe.socialnetwork.api.dtos.RPUserCommentDTO;
import com.moe.socialnetwork.api.dtos.ZRPPageDTO;
import com.moe.socialnetwork.models.User;
/**
 * Author: nhutnm379
 */
public interface IUserActivityService {
    ZRPPageDTO<RPKeywordSearchTimeDTO> getSearchHistoryByUser(User user, int page, int size, String sort);

    ZRPPageDTO<RPPostDTO> getViewByUser(User user, int page, int size, String sort);

    ZRPPageDTO<RPPostDTO> getLikeByUser(User user, int page, int size, String sort);

    ZRPPageDTO<RPUserCommentDTO> getCommentByUser(User user, int page, int size, String sort);
}
