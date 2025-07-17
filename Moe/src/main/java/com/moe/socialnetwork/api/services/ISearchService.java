package com.moe.socialnetwork.api.services;

import com.moe.socialnetwork.api.dtos.RPKeywordCountDTO;
import com.moe.socialnetwork.models.User;

import java.util.List;
import java.util.UUID;

public interface ISearchService {

    List<String> getSuggestionsByPrefix(String prefix, int síze);

    List<RPKeywordCountDTO> getTopKeywords();

    void deleteByCode(UUID code);

    void addSearch(User user, String keyword);

}
