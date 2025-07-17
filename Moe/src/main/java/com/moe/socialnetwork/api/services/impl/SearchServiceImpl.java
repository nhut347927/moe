package com.moe.socialnetwork.api.services.impl;

import com.moe.socialnetwork.api.dtos.RPKeywordCountDTO;
import com.moe.socialnetwork.api.services.ISearchService;
import com.moe.socialnetwork.jpa.SearchHistoryJPA;
import com.moe.socialnetwork.models.SearchHistory;
import com.moe.socialnetwork.models.User;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class SearchServiceImpl implements ISearchService {

    private final SearchHistoryJPA searchHistoryRepository;

    public SearchServiceImpl(SearchHistoryJPA searchHistoryRepository) {
        this.searchHistoryRepository = searchHistoryRepository;
    }

    @Override
    public List<String> getSuggestionsByPrefix(String prefix, int síze) {
        if (prefix == null || prefix.trim().isEmpty()) {
            return List.of(); // hoặc Collections.emptyList()
        }
        return searchHistoryRepository.findTopKeywordsByPrefix(prefix.trim(), PageRequest.of(0, síze));
    }

    @Override
    public List<RPKeywordCountDTO> getTopKeywords() {
        Pageable pageable = PageRequest.of(0, 10);
        return searchHistoryRepository.findTopKeywords(pageable);
    }

    @Override
    public void deleteByCode(UUID code) {
        searchHistoryRepository.deleteByCode(code);
    }

    @Override
    public void addSearch(User user, String keyword) {
        if (keyword == null || keyword.trim().isEmpty())
            return;

        SearchHistory search = new SearchHistory();
        search.setUser(user);
        search.setKeyword(keyword.trim());
        searchHistoryRepository.save(search);
    }

}
