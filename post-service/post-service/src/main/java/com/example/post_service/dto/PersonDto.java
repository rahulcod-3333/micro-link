package com.example.post_service.dto;

import jakarta.persistence.GeneratedValue;
import lombok.Data;
import org.springframework.data.annotation.Id;

@Data
public class PersonDto {
    @Id
    @GeneratedValue
    private Long id ;
    private Long userId;
    private String name ;
}
