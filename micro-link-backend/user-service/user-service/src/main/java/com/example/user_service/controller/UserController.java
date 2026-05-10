package com.example.user_service.controller;

import com.example.user_service.auth.UserContextHolder;
import com.example.user_service.dto.UserDto;
import com.example.user_service.entity.User;
import com.example.user_service.repository.AuthRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class UserController {

    private final AuthRepository userRepository;


    @GetMapping("/profile")
    public ResponseEntity<UserDto> getMyProfile(){
        Long id = UserContextHolder.getCurrentUserId();
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

        UserDto profile = new UserDto(user.getId() , user.getEmail() , user.getName());
        return ResponseEntity.ok(profile);
    }


    @GetMapping("/{id}")
    public ResponseEntity<UserDto> getUserById(@PathVariable Long id){
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

        UserDto profile = new UserDto(user.getId() , user.getEmail() , user.getName());
        return ResponseEntity.ok(profile);
    }
}