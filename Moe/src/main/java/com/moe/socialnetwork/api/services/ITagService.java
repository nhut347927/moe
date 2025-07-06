package com.moe.socialnetwork.api.services;

import java.util.List;

import com.moe.socialnetwork.api.dtos.RPTagDTO;
import com.moe.socialnetwork.models.User;
/**
 * Author: nhutnm379
 */
public interface ITagService {
   List<RPTagDTO> searchByCode(String code);
    List<RPTagDTO> searchTags(String keyword, int page, int size, String sort);
    RPTagDTO addTag(String name, User user);
}
