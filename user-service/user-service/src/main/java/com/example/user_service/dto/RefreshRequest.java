package com.example.user_service.dto;

import lombok.Data;

@Data      // it is send y the client to us
public class RefreshRequest {
    private String refreshToken;
}
// as when user login there are two token access token and refresh token
//but when access token expires user have to login again
//but then we send the refresh token so that frontend would recognize that and also
//ana it will then automatically generate a access token forn it
//hence user do not log out again and again from the server