package com.example.user_service.controller;

import com.example.user_service.dto.*;
import com.example.user_service.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.Response;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
 private final AuthService authService;
    @PostMapping("/signup")
    public ResponseEntity<UserDto> signUp(@RequestBody signup signup){
        UserDto user = authService.signUpUser(signup);
        return new ResponseEntity<>(user , HttpStatus.CREATED);
    }
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login (@RequestBody LoginDto loginDto){
        AuthResponse response = authService.login(loginDto);
        return ResponseEntity.ok(response);
    }
    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> generateRefreshToken(@RequestBody RefreshRequest refreshRequest){
        AuthResponse response =authService.refreshToken(refreshRequest.getRefreshToken());
        return ResponseEntity.ok(response);
    }





}
