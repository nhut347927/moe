package com.moe.socialnetwork.api.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ZFilterPageRequestDTO {
      private String keyword;       // tìm kiếm toàn cục (title, name, content, ...)
    private String filterType;    // loại lọc, tùy context (VD: PostType, Role, Category,...)
    private String visibility;    // cũng có thể là trạng thái chung
    private Integer page = 0;
    private Integer size = 10;
    private String sortBy = "createdAt";
    private String sortDirection = "desc";
}
