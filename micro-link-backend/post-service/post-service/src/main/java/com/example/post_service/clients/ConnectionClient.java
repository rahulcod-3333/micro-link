package com.example.post_service.clients;

import com.example.post_service.dto.PersonDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;

import java.util.List;

@FeignClient(name = "connection-service" , path = "/connections")
public interface ConnectionClient {

    @GetMapping("/connect/first-connected")
     List<PersonDto> getFirstConnection(@RequestHeader("X-User-Id") Long userId);

}
