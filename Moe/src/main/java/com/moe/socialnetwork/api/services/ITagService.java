package com.moe.socialnetwork.api.services;

import java.util.List;

import com.moe.socialnetwork.api.dtos.TagResponseDTO;
import com.moe.socialnetwork.models.User;

public interface ITagService {
   List<TagResponseDTO> searchByCode(String code);
    List<TagResponseDTO> searchTags(String keyword);
    TagResponseDTO addTag(String name, User user);
}
