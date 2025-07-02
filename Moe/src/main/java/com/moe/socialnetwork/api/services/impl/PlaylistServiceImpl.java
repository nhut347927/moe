package com.moe.socialnetwork.api.services.impl;

import com.moe.socialnetwork.api.dtos.RPPlaylistDTO;
import com.moe.socialnetwork.api.dtos.RPPlaylistPostDTO;
import com.moe.socialnetwork.api.dtos.RQPlaylistSaveDTO;
import com.moe.socialnetwork.api.services.IPlaylistService;
import com.moe.socialnetwork.jpa.AudioJPA;
import com.moe.socialnetwork.jpa.PlaylistJPA;
import com.moe.socialnetwork.jpa.PostJPA;
import com.moe.socialnetwork.jpa.PostPlaylistJPA;
import com.moe.socialnetwork.models.Audio;
import com.moe.socialnetwork.models.Image;
import com.moe.socialnetwork.models.Playlist;
import com.moe.socialnetwork.models.Post;
import com.moe.socialnetwork.models.PostPlaylist;
import com.moe.socialnetwork.models.User;
import com.moe.socialnetwork.exception.AppException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;
/**
 * Author: nhutnm379
 */
@Service
public class PlaylistServiceImpl implements IPlaylistService {

    private final PlaylistJPA playlistJpa;
    private final PostJPA postJpa;
    private final PostPlaylistJPA postPlaylistJpa;
    private final AudioJPA audioJpa;

    public PlaylistServiceImpl(PlaylistJPA playlistJpa, PostJPA postJpa, PostPlaylistJPA postPlaylistJpa, AudioJPA audioJpa) {
        this.playlistJpa = playlistJpa;
        this.postJpa = postJpa;
        this.postPlaylistJpa = postPlaylistJpa;
        this.audioJpa = audioJpa;
    }

    public List<RPPlaylistDTO> getPlaylistsByUser(UUID userCode) {
        return playlistJpa.findPlaylistByUserCode(userCode)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<RPPlaylistPostDTO> getPostsByPlaylist(UUID playlistCode, User user) {
        List<Post> playlist = playlistJpa.findPostsByPlaylistCodeAndUserId(playlistCode, user.getId());

        return playlist.stream()
                .map(pp -> toPlaylistPostResponse(pp, user))
                .collect(Collectors.toList());
    }

    public void createPlaylist(RQPlaylistSaveDTO dto, User user) {
        Playlist playlist = new Playlist();
        playlist.setName(dto.getName());
        playlist.setDescription(dto.getDescription());
        playlist.setIsPublic(dto.getIsPublic());
        playlist.setImage(dto.getImage());
        playlist.setUser(user);
        playlist.setUserCreate(user);
        try {
            playlistJpa.save(playlist);
        } catch (Exception e) {
            throw new AppException("error occurred while saving playlist ", 500);
        }

    }

    public void updatePlaylist(RPPlaylistDTO dto, User user) {
        Playlist playlist = playlistJpa
                .findPlaylistByPlaylistCodeAndUserId(UUID.fromString(dto.getCode()), user.getId())
                .orElseThrow(() -> new AppException("Playlist not found or not public", 404));
        playlist.setName(dto.getName());
        playlist.setDescription(dto.getDescription());
        playlist.setIsPublic(dto.getIsPublic());
        playlist.setImage(dto.getImage());
        playlist.setUser(user);
        playlist.setUserCreate(user);
        try {
            playlistJpa.save(playlist);
        } catch (Exception e) {
            throw new AppException("error occurred while saving playlist ", 500);
        }
    }

    public void addPostToPlaylist(User user, UUID playlistCode, UUID postCode) {

        Playlist playlist = playlistJpa.findPlaylistByPlaylistCodeAndUserId(playlistCode, user.getId())
                .orElseThrow(() -> new AppException("Playlist not found", 404));
        Post post = postJpa.findPostByPostCode(postCode)
                .orElseThrow(() -> new AppException("Post not found", 404));

        Optional<PostPlaylist> postPlaylist = postPlaylistJpa.findPostPlaylistByPlaylistIdAndPostId(playlist.getId(),
                post.getId());
        if (postPlaylist.isPresent()) {
            throw new AppException("Post added", 409);
        }

        PostPlaylist pp = new PostPlaylist();
        pp.setPlaylist(playlist);
        pp.setPost(post);
        try {
            postPlaylistJpa.save(pp);
        } catch (Exception e) {
            throw new AppException("error occurred while saving playlist", 500);
        }
    }

    public void removePostFromPlaylist(User user, UUID playlistCode, UUID postCode) {
        Playlist playlist = playlistJpa.findPlaylistByPlaylistCodeAndUserId(playlistCode, user.getId())
                .orElseThrow(() -> new AppException("Playlist not found", 404));
        Post post = postJpa.findPostByPostCode(postCode)
                .orElseThrow(() -> new AppException("Post not found", 404));

        Optional<PostPlaylist> postPlaylist = postPlaylistJpa.findPostPlaylistByPlaylistIdAndPostId(playlist.getId(),
                post.getId());
        if (postPlaylist.isPresent()) {
            try {
                postPlaylistJpa.delete(postPlaylist.get());
                return;
            } catch (Exception e) {
                throw new AppException("error occurred while saving playlist", 500);
            }

        }
        throw new AppException("Post added", 409);

    }

    private RPPlaylistDTO toDTO(Playlist playlist) {
        RPPlaylistDTO dto = new RPPlaylistDTO();
        dto.setCode(playlist.getCode() != null ? playlist.getCode().toString() : null);
        dto.setName(playlist.getName());
        dto.setDescription(playlist.getDescription());
        dto.setIsPublic(playlist.getIsPublic());
        dto.setImage(playlist.getImage());
        return dto;
    }

    private RPPlaylistPostDTO toPlaylistPostResponse(Post post, User user) {
        RPPlaylistPostDTO dto = new RPPlaylistPostDTO();
        dto.setPostCode(String.valueOf(post.getCode()));
        dto.setCreated(post.getCreatedAt().toString());

        dto.setUserDisplayName(post.getUser().getDisplayName());
        dto.setUserName(post.getUser().getUsername());

        dto.setPostType(post.getType().toString());
        dto.setVideoUrl(post.getVideoUrl());

        dto.setTitle(post.getTitle());

        List<String> imageUrls = new ArrayList<>();
        for (Image image : post.getImages()) {
            imageUrls.add(image.getImageName());
        }
        dto.setImageUrls(imageUrls);

        if (post.getAudio() != null && post.getAudio().getOwnerPost() != null) {
            dto.setAudioUrl(post.getAudio().getAudioName());
            dto.setAudioOwnerAvatar(post.getAudio().getOwnerPost().getUser().getAvatar());
            dto.setAudioOwnerDisplayName(post.getAudio().getOwnerPost().getUser().getDisplayName());
            dto.setAudioCode(String.valueOf(post.getAudio().getId()));
        } else {
            // if post does not have audio, it means it uses default audio
            Audio defaultAudio = audioJpa.findAudioByOwnerPostId(post.getId());

            dto.setAudioUrl(defaultAudio.getAudioName());
            dto.setAudioOwnerAvatar(user.getAvatar());
            dto.setAudioOwnerDisplayName(user.getDisplayName());
            dto.setAudioCode(defaultAudio.getCode().toString());
        }

        return dto;
    }
}
