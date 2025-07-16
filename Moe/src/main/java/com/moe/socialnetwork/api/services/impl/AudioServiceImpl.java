package com.moe.socialnetwork.api.services.impl;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.moe.socialnetwork.api.dtos.RPPostDTO;
import com.moe.socialnetwork.api.dtos.ZRPPageDTO;
import com.moe.socialnetwork.api.services.IAudioService;
import com.moe.socialnetwork.jpa.AudioJPA;
import com.moe.socialnetwork.models.Post;
import com.moe.socialnetwork.models.User;
import com.moe.socialnetwork.util.PaginationUtils;

@Service
public class AudioServiceImpl implements IAudioService {
    private final AudioJPA audioJPA;
    private final PostServiceImpl postServiceImpl;

    public AudioServiceImpl(AudioJPA audioJPA, PostServiceImpl postServiceImpl) {
        this.audioJPA = audioJPA;
        this.postServiceImpl = postServiceImpl;
    }

    public ZRPPageDTO<RPPostDTO> getPostUseAudio(User user, String code, int page, int size, String sort) {
        Pageable pageable = PaginationUtils.buildPageable(page, size, sort);

        Page<Post> postPage = audioJPA.findPostByAudioCode(UUID.fromString(code), pageable);

        List<RPPostDTO> posts = postPage.getContent()
                .stream()
                .map(post -> postServiceImpl.toPostResponse(post, user))
                .collect(Collectors.toList());

        return PaginationUtils.buildPageDTO(postPage, posts);
    }

}
