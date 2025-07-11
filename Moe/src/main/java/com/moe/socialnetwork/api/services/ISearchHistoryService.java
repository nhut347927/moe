package com.moe.socialnetwork.api.services;

import com.moe.socialnetwork.api.dtos.RPKeywordSearchTimeDTO;
import com.moe.socialnetwork.api.dtos.RPKeywordCountDTO;
import com.moe.socialnetwork.models.User;

import org.springframework.data.domain.Page;

import java.util.List;
import java.util.UUID;

public interface ISearchHistoryService {

    Page<RPKeywordSearchTimeDTO> getSearchHistoryByUser(User user, int page, int size, String sort);

    List<RPKeywordCountDTO> getTopKeywords();

    void deleteByCode(UUID code);
    
    void addSearch(User user, String keyword);

}
