package com.moe.socialnetwork.api.services.impl;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.moe.socialnetwork.api.dtos.RPTagDTO;
import com.moe.socialnetwork.api.services.ITagService;
import com.moe.socialnetwork.jpa.TagJPA;
import com.moe.socialnetwork.models.Tag;
import com.moe.socialnetwork.models.User;
import com.moe.socialnetwork.util.TextNormalizer;
import com.moe.socialnetwork.exception.AppException;

/**
 * Author: nhutnm379
 */
@Service
public class TagServiceImpl implements ITagService {

    private final TagJPA tagJpa;

    public TagServiceImpl(TagJPA tagJpa) {
        this.tagJpa = tagJpa;
    }

    public List<RPTagDTO> searchByCode(String code) {
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

                    return new RPTagDTO(
                            tag.getCode().toString(),
                            tag.getName(),
                            String.valueOf(tag.getUsageCount()),
                            user != null ? user.getUsername() : null,
                            user != null ? user.getAvatar() : null);
                })

                .collect(Collectors.toList());
    }

    @Override
    public List<RPTagDTO> searchTags(String keyword, int page, int size, String sort) {
        if (keyword == null || keyword.trim().isEmpty()) {
            keyword = "";
        }

        Sort.Direction direction = "asc".equalsIgnoreCase(sort) ? Sort.Direction.ASC : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, "id"));

        List<Tag> tags = tagJpa.searchTags(keyword, pageable);

        return tags.stream().map(tag -> {

            User user = tag.getUserCreate();

            return new RPTagDTO(
                    tag.getCode().toString(),
                    tag.getName(),
                    String.valueOf(tag.getUsageCount()),
                    user != null ? user.getUsername() : null,
                    user != null ? user.getAvatar() : null);
        }).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public RPTagDTO addTag(String name, User user) {
        String tagName = TextNormalizer.removeVietnameseAccents(name)
                .trim();
        boolean exists = tagJpa.existsByNameIgnoreCase(TextNormalizer.removeWhitespace(tagName));
        if (exists) {
            throw new AppException("Tag already in use", 400);
        }
        Tag tag = new Tag();
        tag.setName(TextNormalizer.removeWhitespace(tagName));
        tag.setUserCreate(user);
        tag.setUsageCount(0);
        tag = tagJpa.save(tag);

        return new RPTagDTO(
                tag.getCode().toString(),
                tag.getName(),
                String.valueOf(tag.getUsageCount()),
                user != null ? user.getUsername() : null,
                user != null ? user.getAvatar() : null);
    }
}
