package com.example.user_service.dto;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;

@Data
public class LoginDto {
    private String email;
    private String password ;

}
