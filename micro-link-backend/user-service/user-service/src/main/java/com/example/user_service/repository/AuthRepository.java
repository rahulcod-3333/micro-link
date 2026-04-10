package com.example.user_service.repository;

import com.example.user_service.dto.UserDto;
import com.example.user_service.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AuthRepository extends JpaRepository<User , Long> {

    Optional<User> findByEmail(String email);
}
