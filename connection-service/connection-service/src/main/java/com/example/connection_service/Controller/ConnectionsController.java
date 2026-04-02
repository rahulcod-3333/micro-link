package com.example.connection_service.Controller;

import com.example.connection_service.Entity.Person;
import com.example.connection_service.Service.ConnectionService;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.Response;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/connect")
@RequiredArgsConstructor
public class ConnectionsController {

    private final ConnectionService connectionService;
    @GetMapping("/first-connected")
    public ResponseEntity<List<Person>> getFirstConnection(){
        return ResponseEntity.ok(connectionService.getFirstDegreeConnections());

    }
    @GetMapping("/recommendations")
    public ResponseEntity<List<Person>> getRecommendation(){
        return ResponseEntity.ok(connectionService.getRecommendation());
    }

    @PostMapping("/request/{userId}")
    public ResponseEntity<Boolean> sendConnectionRequest(@PathVariable Long userId){
        return ResponseEntity.ok(connectionService.sendConnectionRequest(userId));
    }

    @PostMapping("/accept/{userId}")
    public ResponseEntity<Boolean> acceptRequest(@PathVariable Long userId) {
        return ResponseEntity.ok(connectionService.acceptRequest(userId));
    }

    @PostMapping("/reject/{userId}")
    public ResponseEntity<Boolean> rejectRequest(@PathVariable Long userId ) {
        return ResponseEntity.ok(connectionService.rejectRequest(userId));
    }
}
