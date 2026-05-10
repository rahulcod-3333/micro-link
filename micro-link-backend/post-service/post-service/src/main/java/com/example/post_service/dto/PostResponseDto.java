package com.example.post_service.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PostResponseDto {
    private Long id ;
    private Long userId;
    private String authorName;
    private String content;
    private LocalDateTime createdAt;
    private int likeCount;

}
