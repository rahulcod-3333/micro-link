package com.example.connection_service.event;

import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Builder
public class SendRequestEvent {
    Long senderId;
    Long receiverId;

}
