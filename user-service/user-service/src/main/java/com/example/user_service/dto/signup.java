package com.example.user_service.dto;

import jakarta.persistence.Table;
import lombok.Data;
import lombok.Getter;

@Data
public class signup {
    private String name ;
    private String email ;
    private String password ;

}
