package com.moe.socialnetwork.api.controllers;

import com.moe.socialnetwork.api.dtos.RPKeywordCountDTO;
import com.moe.socialnetwork.api.dtos.ZRQCodeAndContentDTO;
import com.moe.socialnetwork.api.dtos.ZRQFilterPageDTO;
import com.moe.socialnetwork.api.services.ISearchService;
import com.moe.socialnetwork.models.User;
import com.moe.socialnetwork.response.ResponseAPI;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/search")
public class SearchController {

    private final ISearchService searchHistoryService;

    public SearchController(ISearchService searchHistoryService) {
        this.searchHistoryService = searchHistoryService;
    }

    @GetMapping("/suggestions")
    public ResponseEntity<ResponseAPI<List<String>>> getKeywordSuggestions(
            @Valid @ModelAttribute ZRQFilterPageDTO request,
            @AuthenticationPrincipal User user) {

        List<String> data = searchHistoryService.getSuggestionsByPrefix(
                request.getKeyWord(),
                request.getSize());

        ResponseAPI<List<String>> response = new ResponseAPI<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(data);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/top")
    public ResponseEntity<ResponseAPI<List<RPKeywordCountDTO>>> getTopKeywords() {
        List<RPKeywordCountDTO> result = searchHistoryService.getTopKeywords();

        ResponseAPI<List<RPKeywordCountDTO>> response = new ResponseAPI<>();
        response.setCode(HttpStatus.OK.value());
        response.setMessage("Success");
        response.setData(result);

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    // @PostMapping
    // public ResponseEntity<ResponseAPI<Void>> addSearch(
    // @RequestParam @NotBlank String keyword,
    // @AuthenticationPrincipal User user
    // ) {
    // searchHistoryService.addSearch(user, keyword);

    // ResponseAPI<Void> response = new ResponseAPI<>();
    // response.setCode(HttpStatus.OK.value());
    // response.setMessage("Success");
    // response.setData(null);

    // return ResponseEntity.status(HttpStatus.OK).body(response);
    // }

    @DeleteMapping("/delete")
    public ResponseEntity<ResponseAPI<Void>> deleteSearch(
            @ModelAttribute ZRQCodeAndContentDTO request) {
        searchHistoryService.deleteByCode(UUID.fromString(request.getCode()));

        ResponseAPI<Void> response = new ResponseAPI<>();
        response.setCode(HttpStatus.OK.value());
        response.setMessage("Success");
        response.setData(null);

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }
}
