package com.moe.socialnetwork.api.services.impl;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.moe.socialnetwork.api.dtos.TagResponseDTO;
import com.moe.socialnetwork.api.services.ITagService;
import com.moe.socialnetwork.jpa.TagJpa;
import com.moe.socialnetwork.models.Tag;
import com.moe.socialnetwork.models.User;
import com.moe.socialnetwork.exception.AppException;

@Service
public class TagServiceImpl implements ITagService {

    private final TagJpa tagJpa;

    public TagServiceImpl(TagJpa tagJpa) {
        this.tagJpa = tagJpa;
    }

    public List<TagResponseDTO> searchByCode(String code) {
        List<String> codes = Arrays.stream(code.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .collect(Collectors.toList());

        return codes.stream()
                .map(codeStr -> {
                    Optional<Tag> optionalTag = tagJpa.findByCode(UUID.fromString(codeStr));
                    if (optionalTag.isEmpty())
                        return null;

                    Tag tag = optionalTag.get();
                    User user = tag.getUserCreate();

                    return new TagResponseDTO(
                            tag.getCode().toString(),
                            tag.getName(),
                            String.valueOf(tag.getUsageCount()),
                            user != null ? user.getUsername() : null,
                            user != null ? user.getAvatar() : null);
                })

                .collect(Collectors.toList());
    }

    @Override
    public List<TagResponseDTO> searchTags(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            keyword = "";
        }
        List<Tag> tags = tagJpa.searchTags(keyword, PageRequest.of(0, 100));
        return tags.stream().map(tag -> {

            User user = tag.getUserCreate();

            return new TagResponseDTO(
                    tag.getCode().toString(),
                    tag.getName(),
                    String.valueOf(tag.getUsageCount()),
                    user != null ? user.getUsername() : null,
                    user != null ? user.getAvatar() : null);
        }).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public TagResponseDTO addTag(String name, User user) {

        boolean exists = tagJpa.existsByNameIgnoreCase(name.trim());
        if (exists) {
            throw new AppException("Tag already in use", 400);
        }
        Tag tag = new Tag();
        tag.setName(name.trim());
        tag.setUserCreate(user);
        tag.setUsageCount(0);
        tag = tagJpa.save(tag);

        return new TagResponseDTO(
                tag.getCode().toString(),
                tag.getName(),
                String.valueOf(tag.getUsageCount()),
                user != null ? user.getUsername() : null,
                user != null ? user.getAvatar() : null);
    }
}
