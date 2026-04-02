package com.example.notification_service.notification_service.clients;

import com.example.notification_service.notification_service.dto.PersonDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

@FeignClient(name = "connection-service" , path = "/connections")
public interface ConnectionClient {

    @GetMapping("/core/first-connected")
     List<PersonDto> getFirstConnection(Long userId);

}
