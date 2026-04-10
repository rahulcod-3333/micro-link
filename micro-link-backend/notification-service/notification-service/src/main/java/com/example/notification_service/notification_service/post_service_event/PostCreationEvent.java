package com.example.notification_service.notification_service.post_service_event;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class PostCreationEvent {
     Long creatorId;
     Long postId;
     String content;

}
