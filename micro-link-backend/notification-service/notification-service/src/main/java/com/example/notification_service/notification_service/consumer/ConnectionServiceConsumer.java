package com.example.notification_service.notification_service.consumer;


import com.example.notification_service.connection_service.event.AcceptRequestEvent;
import com.example.notification_service.connection_service.event.SendRequestEvent;
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

    @KafkaListener(topics = "send-request-event" ,
            properties = {
                    "spring.json.use.type.headers=false",
                    "spring.json.value.default.type=com.example.notification_service.connection_service.event.SendRequestEvent"
            })
    public void handleConnectionServiceConsumer(SendRequestEvent requestConnectionServiceEvent){
          try {
            log.info("handle connections: handleSendConnectionRequest: {}", requestConnectionServiceEvent);

            String message = String.format("You have a request from user with id: %d", requestConnectionServiceEvent.getSenderId());
            sendNotification.send(requestConnectionServiceEvent.getReceiverId(), message);
        } catch (Exception ex) {
            log.error("Failed to handle connection request event: {}", requestConnectionServiceEvent, ex);
        }
    }


    @KafkaListener(topics = "accept-request-event" ,
            properties = {
            "spring.json.use.type.headers=false",
            "spring.json.value.default.type=com.example.notification_service.connection_service.event.AcceptRequestEvent"
    })
    public void handleAcceptConnectionService(AcceptRequestEvent acceptConnectionServiceEvent){
        try{
            log.info("handle connections: handleAcceptConnectionRequest: {}", acceptConnectionServiceEvent);

            String message = String.format("Your request has been accepted by id: %d", acceptConnectionServiceEvent.getReceiverId());
            sendNotification.send(acceptConnectionServiceEvent.getSenderId(), message);
        }
        catch (Exception ex){
            log.error("Failed to handle connection request event: {}", acceptConnectionServiceEvent, ex);

        }

    }


}
