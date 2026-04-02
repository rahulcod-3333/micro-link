package com.example.notification_service.notification_service.connection_service_event;

import lombok.Builder;
import lombok.Data;

@Data
public class RequestConnectionServiceEvent {
    Long senderId;
    Long receiverId;
}
