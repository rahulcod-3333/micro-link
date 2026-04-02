package com.example.connection_service.event;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SendRequestEvent {
    Long senderId;
    Long receiverId;

}
