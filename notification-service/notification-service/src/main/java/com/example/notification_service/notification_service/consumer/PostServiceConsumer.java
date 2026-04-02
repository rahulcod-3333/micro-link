package com.example.notification_service.notification_service.consumer;

import com.example.notification_service.notification_service.clients.ConnectionClient;
import com.example.notification_service.notification_service.dto.PersonDto;
import com.example.notification_service.notification_service.entity.Notification;
import com.example.notification_service.notification_service.post_service_event.PostCreationEvent;
import com.example.notification_service.notification_service.post_service_event.PostLikeEvent;
import com.example.notification_service.notification_service.repository.NotificationRepository;
import com.example.notification_service.notification_service.service.SendNotification;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class PostServiceConsumer {

    private final NotificationRepository notificationRepository;
    private final ConnectionClient connectionClient;
    private final SendNotification sendNotification;

    @KafkaListener(topics = "post-created-topics")
    public void handlePostCreated(PostCreationEvent postCreationEvent){
        log.info("sending notification handlePostCreated: {}", postCreationEvent);
        List<PersonDto> connections =  connectionClient.getFirstConnection(postCreationEvent.getCreatorId());
        for (PersonDto connection : connections){
            sendNotification.send(connection.getUserId(), "your connection"+postCreationEvent.getCreatorId()+"made a post"+"check it out");
        }
    }

    @KafkaListener(topics = "post-liked-event")
    public void handlePostLike(PostLikeEvent postLikeEvent){
        log.info("sending notification handlePostLike: {}",postLikeEvent);
        String message = String.format("Your post, %d has been liked by %d", postLikeEvent.getPostId(), postLikeEvent.getLikedByUserId());
        sendNotification.send(postLikeEvent.getCreatorId(), message);
    }

}
