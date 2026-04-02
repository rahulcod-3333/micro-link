package com.example.notification_service.notification_service.post_service_event;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class PostLikeEvent {
    Long postId;
    Long creatorId;
    Long likedByUserId;
}
