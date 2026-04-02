package com.example.connection_service.event;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AcceptRequestEvent {
    Long senderId;
    Long receiverId;
}
