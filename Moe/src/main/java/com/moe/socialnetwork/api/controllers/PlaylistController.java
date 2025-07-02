package com.moe.socialnetwork.api.controllers;

import com.moe.socialnetwork.api.dtos.RQPlaylistCodeDTO;
import com.moe.socialnetwork.api.dtos.RPPlaylistDTO;
import com.moe.socialnetwork.api.dtos.RQPlaylistPostActionDTO;
import com.moe.socialnetwork.api.dtos.RPPlaylistPostDTO;
import com.moe.socialnetwork.api.dtos.RQPlaylistSaveDTO;
import com.moe.socialnetwork.api.services.IPlaylistService;
import com.moe.socialnetwork.models.User;
import com.moe.socialnetwork.response.ResponseAPI;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
/**
 * Author: nhutnm379
 */
@RestController
@RequestMapping("/api/playlist")
public class PlaylistController {

    private final IPlaylistService playlistService;

    public PlaylistController(IPlaylistService playlistService) {
        this.playlistService = playlistService;
    }

    // Lấy danh sách playlist theo user (isDeleted = false)
    @GetMapping("/user")
    public ResponseEntity<ResponseAPI<List<RPPlaylistDTO>>> getUserPlaylists(@AuthenticationPrincipal User user) {
        List<RPPlaylistDTO> playlists = playlistService.getPlaylistsByUser(user.getCode());
        ResponseAPI<List<RPPlaylistDTO>> response = new ResponseAPI<>();
        response.setCode(HttpStatus.OK.value());
        response.setMessage("Success");
        response.setData(playlists);
        return ResponseEntity.ok(response);
    }

    // Lấy danh sách bài đăng theo playlist
    @GetMapping("/posts")
    public ResponseEntity<ResponseAPI<List<RPPlaylistPostDTO>>> getPostsByPlaylist(
            @PathVariable RQPlaylistCodeDTO playlistCode,
            @AuthenticationPrincipal User user) {
        List<RPPlaylistPostDTO> posts = playlistService.getPostsByPlaylist(UUID.fromString(playlistCode.getPlaylistCode()), user);
        ResponseAPI<List<RPPlaylistPostDTO>> response = new ResponseAPI<>();
        response.setCode(HttpStatus.OK.value());
        response.setMessage("Success");
        response.setData(posts);
        return ResponseEntity.ok(response);
    }

    // Tạo playlist
    @PostMapping("/create")
    public ResponseEntity<ResponseAPI<String>> createPlaylist(
            @RequestBody @Valid RQPlaylistSaveDTO dto,
            @AuthenticationPrincipal User user) {
        playlistService.createPlaylist(dto, user);
        ResponseAPI<String> response = new ResponseAPI<>();
        response.setCode(HttpStatus.CREATED.value());
        response.setMessage("Playlist created");
        response.setData("OK");
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // Cập nhật playlist
    @PutMapping("/update")
    public ResponseEntity<ResponseAPI<String>> updatePlaylist(
            @RequestBody @Valid RPPlaylistDTO dto,
            @AuthenticationPrincipal User user) {
        playlistService.updatePlaylist(dto, user);
        ResponseAPI<String> response = new ResponseAPI<>();
        response.setCode(HttpStatus.OK.value());
        response.setMessage("Playlist updated");
        response.setData("OK");
        return ResponseEntity.ok(response);
    }

    // Thêm bài post vào playlist
    @PostMapping("add-post")
    public ResponseEntity<ResponseAPI<String>> addPostToPlaylist(
            @AuthenticationPrincipal User user,
            @RequestBody @Valid RQPlaylistPostActionDTO playlistPostActionDTO) {
        playlistService.addPostToPlaylist(user, UUID.fromString(playlistPostActionDTO.getPlaylistCode()),
                UUID.fromString(playlistPostActionDTO.getPostCode()));
        ResponseAPI<String> response = new ResponseAPI<>();
        response.setCode(HttpStatus.OK.value());
        response.setMessage("Post added to playlist");
        response.setData("OK");
        return ResponseEntity.ok(response);
    }

    // Bỏ bài post khỏi playlist
    @DeleteMapping("/remove-post")
    public ResponseEntity<ResponseAPI<String>> removePostFromPlaylist(
            @AuthenticationPrincipal User user,
            @RequestBody @Valid RQPlaylistPostActionDTO playlistPostActionDTO) {
        playlistService.removePostFromPlaylist(user, UUID.fromString(playlistPostActionDTO.getPlaylistCode()),
                UUID.fromString(playlistPostActionDTO.getPostCode()));
        ResponseAPI<String> response = new ResponseAPI<>();
        response.setCode(HttpStatus.OK.value());
        response.setMessage("Post removed from playlist");
        response.setData("OK");
        return ResponseEntity.ok(response);
    }
}