package com.moe.socialnetwork.api.services;

import com.moe.socialnetwork.api.dtos.RPPlaylistDTO;
import com.moe.socialnetwork.api.dtos.RPPlaylistPostDTO;
import com.moe.socialnetwork.api.dtos.RQPlaylistSaveDTO;
import com.moe.socialnetwork.models.User;

import java.util.List;
import java.util.UUID;
/**
 * Author: nhutnm379
 */
public interface IPlaylistService {
    List<RPPlaylistDTO> getPlaylistsByUser(UUID userCode);
    List<RPPlaylistPostDTO> getPostsByPlaylist(UUID playlistCode, User user);
    void createPlaylist(RQPlaylistSaveDTO dto, User user);
    void updatePlaylist(RPPlaylistDTO dto, User user);
    void addPostToPlaylist(User user, UUID playlistCode, UUID postCode);
    void removePostFromPlaylist(User user, UUID playlistCode, UUID postCode);
}