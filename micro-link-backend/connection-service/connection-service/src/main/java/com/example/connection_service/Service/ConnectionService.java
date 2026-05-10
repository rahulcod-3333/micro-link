package com.example.connection_service.Service;

import com.example.connection_service.Entity.Person;
import com.example.connection_service.auth.UserContextHolder;
import com.example.connection_service.client.UserServiceClient;
import com.example.connection_service.dto.ConnectionResponseDto;
import com.example.connection_service.dto.UserDto;
import com.example.connection_service.event.AcceptRequestEvent;
import com.example.connection_service.event.SendRequestEvent;
import com.example.connection_service.repository.PersonsRepo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jspecify.annotations.Nullable;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ConnectionService {

    private final PersonsRepo personsRepo;
    private final KafkaTemplate<Object, Object> kafkaTemplate;
    private final UserServiceClient userServiceClient;

    public List<ConnectionResponseDto> getFirstDegreeConnections() {
        Long userId = UserContextHolder.getCurrentUserId();
        if (userId == null) {
            log.error("Cannot fetch first-degree connections because X-User-Id header was not provided");
            throw new RuntimeException("Missing X-User-Id header");
        }

        log.info("Getting first degree connections for user with id : {}", userId);

        List<Person> rawConnections = personsRepo.getFirstDegreeConnections(userId);
        log.info("Found {} raw first-degree connections for userId={}", rawConnections.size(), userId);

        List<ConnectionResponseDto> connectionsWithName = rawConnections.stream().map(node -> {
            ConnectionResponseDto dto = new ConnectionResponseDto();
            dto.setUserId(node.getUserId());

            try {
                UserDto friendProfile = userServiceClient.getUserById(node.getUserId());
                dto.setName(friendProfile.getName());
            } catch (Exception e) {
                log.warn("Could not fetch profile for userId {}: {}", node.getUserId(), e.getMessage());
                dto.setName("User " + node.getUserId()); // Fallback if User Service is down
            }

            return dto;
        }).collect(Collectors.toList());
        return connectionsWithName;
    }

    public List<ConnectionResponseDto> detailsConnections(List<Person> rawNodes){
        if(rawNodes == null) return List.of();
        return rawNodes.stream().map((node)->{
            ConnectionResponseDto connectionResponseDto = new ConnectionResponseDto();
            connectionResponseDto.setUserId(node.getUserId());
            try{
                UserDto profile = userServiceClient.getUserById(node.getUserId());
                connectionResponseDto.setName(profile.getName());
            }
            catch(Exception e ){
                connectionResponseDto.setName("User " + node.getUserId());
            }
            return connectionResponseDto;
        }).collect(Collectors.toList());
    }

    public @Nullable List<ConnectionResponseDto> getRecommendation() {
        Long userId = UserContextHolder.getCurrentUserId();
        List<Person> lists = personsRepo.getFriendsRecommendation(userId);
        return detailsConnections(lists);

    }

    public List<ConnectionResponseDto> getReceivedRequests(){
        Long userId = UserContextHolder.getCurrentUserId();
        List<Person> lists = personsRepo.getReceivedRequests(userId);
        return detailsConnections(lists);
    }

    public List<ConnectionResponseDto> getSentRequests() {
        Long userId = UserContextHolder.getCurrentUserId();
        List<Person> rawSent = personsRepo.getSentRequests(userId);
        return detailsConnections(rawSent);
    }

    public @Nullable Boolean sendConnectionRequest(Long receiverId) {
        Long senderID = UserContextHolder.getCurrentUserId();

        if (senderID.equals(receiverId)) {
            throw new RuntimeException("Both sender and receiver are the same ");
        }
        boolean alreadySentRequest = personsRepo.connectionRequestExists(senderID, receiverId);
        if (alreadySentRequest) {
            throw new RuntimeException("Request is already sent");
        }
        if (personsRepo.alreadyConnected(senderID, receiverId)) {
            throw new RuntimeException("You both are already connected");
        }
        personsRepo.addConnectionRequest(senderID, receiverId);
        log.info("successfully send connection request");
        SendRequestEvent sendRequestEvent = SendRequestEvent.builder()
                .receiverId(receiverId)
                .senderId(senderID)
                .build();
        kafkaTemplate.send("send-request-event", sendRequestEvent);
        return true;
    }

    public @Nullable Boolean acceptRequest(Long senderId) {
        Long receiverId = UserContextHolder.getCurrentUserId();
        boolean alreadySentRequest = personsRepo.connectionRequestExists(senderId, receiverId);
        if (!alreadySentRequest) {
            throw new RuntimeException("No pending request found");
        }
        personsRepo.acceptConnectionRequest(senderId, receiverId);
        log.info("successfully accepted connection request sender:{} , receiver:{}", senderId, receiverId);
        AcceptRequestEvent acceptRequestEvent = AcceptRequestEvent.builder()
                .senderId(senderId)
                .receiverId(receiverId)
                .build();
        kafkaTemplate.send("accept-request-event", acceptRequestEvent);
        return true;
    }

    public @Nullable Boolean rejectRequest(Long senderId) {
        Long receiverId = UserContextHolder.getCurrentUserId();
        boolean alreadySentRequest = personsRepo.connectionRequestExists(senderId, receiverId);
        if (!alreadySentRequest) {
            throw new RuntimeException("No pending request found");
        }
        personsRepo.rejectConnectionRequest(senderId, receiverId);
        return true;
    }
}
