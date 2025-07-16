package com.moe.socialnetwork.util;

import com.moe.socialnetwork.api.dtos.ZRPPageDTO;
import org.springframework.data.domain.*;

import java.util.List;

public class PaginationUtils {

    /**
     * Tạo Pageable từ page, size, sort string.
     * @param page số trang (bắt đầu từ 0)
     * @param size số phần tử mỗi trang
     * @param sort thứ tự ("asc" hoặc "desc")
     * @return Pageable đối tượng
     */
    public static Pageable buildPageable(int page, int size, String sort) {
        Sort.Direction direction = "asc".equalsIgnoreCase(sort) ? Sort.Direction.ASC : Sort.Direction.DESC;
        return PageRequest.of(page, size, Sort.by(direction, "id"));
    }

    /**
     * Chuyển Page<?> và danh sách nội dung đã map thành ZRPPageDTO<T>
     * @param page Trang gốc từ JPA
     * @param contents Danh sách dữ liệu sau khi map
     * @return ZRPPageDTO<T>
     */
    public static <T> ZRPPageDTO<T> buildPageDTO(Page<?> page, List<T> contents) {
        ZRPPageDTO<T> dto = new ZRPPageDTO<>();
        dto.setContents(contents);
        dto.setTotalElements(page.getTotalElements());
        dto.setTotalPages(page.getTotalPages());
        dto.setPage(page.getNumber());
        dto.setSize(page.getSize());
        dto.setHasNext(page.hasNext());
        dto.setHasPrevious(page.hasPrevious());
        return dto;
    }
}
