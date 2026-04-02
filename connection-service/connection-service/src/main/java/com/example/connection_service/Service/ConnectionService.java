package com.example.connection_service.Service;

import com.example.connection_service.Entity.Person;
import com.example.connection_service.auth.UserContextHolder;
import com.example.connection_service.event.AcceptRequestEvent;
import com.example.connection_service.event.SendRequestEvent;
import com.example.connection_service.repository.PersonsRepo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jspecify.annotations.Nullable;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ConnectionService {
    private final PersonsRepo personsRepo;
    private final KafkaTemplate<Long , SendRequestEvent> sendRequestEventKafkaTemplate;
    private final KafkaTemplate<Long , AcceptRequestEvent> acceptRequestTemplate;
    public List<Person> getFirstDegreeConnections(){
        Long userId= UserContextHolder.getCurrentUserId();
        log.info("getting first degree connections for user with id : {}", userId);

        return personsRepo.getFirstDegreeConnections();
    }


    public @Nullable List<Person> getRecommendation() {
        Long userId = UserContextHolder.getCurrentUserId();
        return personsRepo.getFriendsRecommendation();
    }

    public @Nullable Boolean sendConnectionRequest(Long receiverId) {
        Long senderID = UserContextHolder.getCurrentUserId();

        if(senderID.equals(receiverId)){
            throw new RuntimeException("Both sender and receiver are the same ");
        }
        boolean alreadySentRequest = personsRepo.connectionRequestExists(senderID , receiverId);
        if (alreadySentRequest){
            throw new RuntimeException("Request is already sent");
        }
        if(personsRepo.alreadyConnected(senderID, receiverId)){
            throw new RuntimeException("You both are already connected");
        }
        personsRepo.addConnectionRequest(senderID ,receiverId);
        log.info("successfully send connection request");
        SendRequestEvent sendRequestEvent = SendRequestEvent.builder()
                .receiverId(receiverId)
                .senderId(senderID)
                .build();
        sendRequestEventKafkaTemplate.send("send-connection-request-topic" , sendRequestEvent);
        return true;
    }

    public @Nullable Boolean acceptRequest(Long senderId) {
        Long receiverId = UserContextHolder.getCurrentUserId();
        boolean alreadySentRequest = personsRepo.connectionRequestExists(senderId , receiverId);
        if (alreadySentRequest){
            throw new RuntimeException("Request is already sent");
        }
        personsRepo.acceptConnectionRequest(senderId, receiverId);
        log.info("successfully accepted connection request sender:{} , receiver:{}", senderId, receiverId);
        AcceptRequestEvent acceptRequestEvent = AcceptRequestEvent.builder()
                .senderId(senderId)
                .receiverId(receiverId)
                .build();
        acceptRequestTemplate.send("accept-kafka-request-template", acceptRequestEvent);
        return true;
    }

    public @Nullable Boolean rejectRequest(Long senderId) {
        Long receiverId = UserContextHolder.getCurrentUserId();
        boolean alreadySentRequest = personsRepo.connectionRequestExists(senderId , receiverId);
        if (alreadySentRequest){
            throw new RuntimeException("Request is already sent");
        }
        personsRepo.rejectConnectionRequest(senderId, receiverId);
        return true;
    }
}
