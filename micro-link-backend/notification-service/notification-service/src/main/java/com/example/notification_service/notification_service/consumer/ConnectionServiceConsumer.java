package com.example.notification_service.notification_service.consumer;


import com.example.notification_service.notification_service.connection_service_event.AcceptConnectionServiceEvent;
import com.example.notification_service.notification_service.connection_service_event.RequestConnectionServiceEvent;
import com.example.notification_service.notification_service.service.SendNotification;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class ConnectionServiceConsumer {

    private final SendNotification sendNotification;
    @KafkaListener(topics = "request-connect-event")
    public void handleConnectionServiceConsumer(RequestConnectionServiceEvent requestConnectionServiceEvent){
        log.info("handle connections: handleSendConnectionRequest: {}", requestConnectionServiceEvent);

        String message = "You have request from user with id: %d"+requestConnectionServiceEvent.getSenderId();
        sendNotification.send(requestConnectionServiceEvent.getReceiverId() , message);
    }

    @KafkaListener(topics = "accept-request-event")
    public void handleAcceptConnectionService(AcceptConnectionServiceEvent acceptConnectionServiceEvent){
        log.info("handle connections: handleAcceptConnectionRequest: {}", acceptConnectionServiceEvent);

        String message = "Your request has been accepted by id : %d"+acceptConnectionServiceEvent.getReceiverId();
        sendNotification.send(acceptConnectionServiceEvent.getSenderId(), message);

    }


}
