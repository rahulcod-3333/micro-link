package com.example.connection_service.Controller;

import com.example.connection_service.Entity.person;
import com.example.connection_service.Service.ConnectionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/connect")
@RequiredArgsConstructor
public class ConnectionsController {

    private final ConnectionService connectionService;
    @GetMapping("/first-connected")
    public ResponseEntity<List<person>> getFirstConnection(){
        return ResponseEntity.ok(connectionService.getFirstDegreeConnections());

    }
}
