package com.example.notification_service.connection_service.event;

import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
public class SendRequestEvent {
    Long senderId;
    Long receiverId;

}
