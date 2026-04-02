package com.example.post_service.event;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class PostLikeEvent {
    Long postId;
    Long creatorId;
    Long likedByUserId;
}
