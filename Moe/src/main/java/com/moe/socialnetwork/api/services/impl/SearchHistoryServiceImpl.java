package com.moe.socialnetwork.api.services.impl;

import com.moe.socialnetwork.api.dtos.RPKeywordSearchTimeDTO;
import com.moe.socialnetwork.api.dtos.RPKeywordCountDTO;
import com.moe.socialnetwork.api.services.ISearchHistoryService;
import com.moe.socialnetwork.jpa.SearchHistoryJPA;
import com.moe.socialnetwork.models.SearchHistory;
import com.moe.socialnetwork.models.User;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class SearchHistoryServiceImpl implements ISearchHistoryService {

    private final SearchHistoryJPA searchHistoryRepository;

    public SearchHistoryServiceImpl(SearchHistoryJPA searchHistoryRepository) {
        this.searchHistoryRepository = searchHistoryRepository;
    }

    @Override
    public Page<RPKeywordSearchTimeDTO> getSearchHistoryByUser(User user, int page, int size, String sort) {
        Sort.Direction direction = "asc".equalsIgnoreCase(sort) ? Sort.Direction.ASC : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, "id"));
        ;
        Page<SearchHistory> searchPage = searchHistoryRepository.getByUser(user, pageable);
        return searchPage.map(s -> new RPKeywordSearchTimeDTO(s.getKeyword(), s.getCreatedAt().toString()));
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
