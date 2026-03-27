package com.example.post_service.clients;

import com.example.post_service.dto.PersonDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@FeignClient(name = "connection-service" , path = "/connections")
public interface ConnectionClient {

    @GetMapping("/core/first-connected")
     List<PersonDto> getFirstConnection();

}
