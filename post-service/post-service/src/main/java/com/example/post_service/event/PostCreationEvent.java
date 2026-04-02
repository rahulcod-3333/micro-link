package com.example.post_service.event;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class PostCreationEvent {
     Long creatorId;
     Long postId;
     String content;

}
