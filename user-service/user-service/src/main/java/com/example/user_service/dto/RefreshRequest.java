package com.example.user_service.dto;

import lombok.Data;

@Data      // it is send y the client to us
public class RefreshRequest {
    private String refreshToken;
}
