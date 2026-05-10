package com.example.connection_service.event;

import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Builder
public class AcceptRequestEvent {
    Long senderId;
    Long receiverId;
}
