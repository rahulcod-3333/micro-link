package com.example.notification_service.post_service.event;

import lombok.Builder;
import lombok.Data;

@Data
public class PostCreationEvent {
     Long creatorId;
     Long postId;
     String content;

}
