package com.moe.socialnetwork.api.controllers;

import com.moe.socialnetwork.api.dtos.RPKeywordCountDTO;
import com.moe.socialnetwork.api.dtos.RPKeywordSearchTimeDTO;
import com.moe.socialnetwork.api.dtos.ZRQCodeAndContentDTO;
import com.moe.socialnetwork.api.dtos.ZRQFilterPageDTO;
import com.moe.socialnetwork.api.services.ISearchHistoryService;
import com.moe.socialnetwork.models.User;
import com.moe.socialnetwork.response.ResponseAPI;

import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/search-history")
public class SearchHistoryController {

    private final ISearchHistoryService searchHistoryService;

    public SearchHistoryController(ISearchHistoryService searchHistoryService) {
        this.searchHistoryService = searchHistoryService;
    }

    @GetMapping
    public ResponseEntity<ResponseAPI<Page<RPKeywordSearchTimeDTO>>> getSearchHistory(
            @ModelAttribute ZRQFilterPageDTO request,
            @AuthenticationPrincipal User user) {
        Page<RPKeywordSearchTimeDTO> result = searchHistoryService.getSearchHistoryByUser(user, request.getPage(),
                request.getSize(), request.getSort());

        ResponseAPI<Page<RPKeywordSearchTimeDTO>> response = new ResponseAPI<>();
        response.setCode(HttpStatus.OK.value());
        response.setMessage("Lấy lịch sử tìm kiếm thành công");
        response.setData(result);

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @GetMapping("/top")
    public ResponseEntity<ResponseAPI<List<RPKeywordCountDTO>>> getTopKeywords() {
        List<RPKeywordCountDTO> result = searchHistoryService.getTopKeywords();

        ResponseAPI<List<RPKeywordCountDTO>> response = new ResponseAPI<>();
        response.setCode(HttpStatus.OK.value());
        response.setMessage("Lấy top từ khoá thành công");
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
    // response.setMessage("Thêm từ khoá thành công");
    // response.setData(null);

    // return ResponseEntity.status(HttpStatus.OK).body(response);
    // }

    @DeleteMapping("/delete")
    public ResponseEntity<ResponseAPI<Void>> deleteSearch(
            @ModelAttribute ZRQCodeAndContentDTO request) {
        searchHistoryService.deleteByCode(UUID.fromString(request.getCode()));

        ResponseAPI<Void> response = new ResponseAPI<>();
        response.setCode(HttpStatus.OK.value());
        response.setMessage("Xoá từ khoá thành công");
        response.setData(null);

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }
}
