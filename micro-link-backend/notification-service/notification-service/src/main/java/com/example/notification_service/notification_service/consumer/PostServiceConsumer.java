package com.example.notification_service.notification_service.consumer;

import com.example.notification_service.notification_service.clients.ConnectionClient;
import com.example.notification_service.notification_service.dto.PersonDto;
import com.example.notification_service.notification_service.service.SendNotification;
import com.example.notification_service.post_service.event.PostCreationEvent;
import com.example.notification_service.post_service.event.PostLikeEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class PostServiceConsumer {

    private final ConnectionClient connectionClient;
    private final SendNotification sendNotification;

    @KafkaListener(topics = "post-created-topic",
            properties = {
                    "spring.json.use.type.headers=false",
                    "spring.json.value.default.type=com.example.notification_service.post_service.event.PostCreationEvent"
            })
    public void handlePostCreated(PostCreationEvent postCreationEvent){
        log.info("Sending notifications: handlePostCreated: {}", postCreationEvent);
        List<PersonDto> connections = connectionClient.getFirstConnection(postCreationEvent.getCreatorId());

        for(PersonDto connection: connections) {
            sendNotification.send(connection.getUserId(), "Your connection "+postCreationEvent.getCreatorId()+" has created" +
                    " a post, Check it out");
        }
    }

    @KafkaListener(topics = "post-liked-topic",
            properties = {
                    "spring.json.use.type.headers=false",
                    "spring.json.value.default.type=com.example.notification_service.post_service.event.PostLikeEvent"
            })
    public void handlePostLike(PostLikeEvent postLikeEvent){
        try {
            log.info("sending notification handlePostLike: {}", postLikeEvent);
            String message = String.format("Your post, %d has been liked by %d", postLikeEvent.getPostId(), postLikeEvent.getLikedByUserId());
            sendNotification.send(postLikeEvent.getCreatorId(), message);
        } catch (Exception ex) {
            log.error("Failed to handle post like event: {}", postLikeEvent, ex);
        }

    }

}
