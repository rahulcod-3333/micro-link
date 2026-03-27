package com.example.user_service.service;

import com.example.user_service.Util.PasswordUtil;
import com.example.user_service.dto.AuthResponse;
import com.example.user_service.dto.LoginDto;
import com.example.user_service.dto.UserDto;
import com.example.user_service.dto.signup;
import com.example.user_service.entity.User;
import com.example.user_service.exceptions.BadRequestException;
import com.example.user_service.exceptions.ResourceNotFoundException;
import com.example.user_service.repository.AuthRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final AuthRepository authRepository;
    private final ModelMapper modelMapper;
    private final JwtService jwtService;
    public UserDto signUpUser(signup signup) {
        User user = modelMapper.map(signup , User.class);
        user.setPassword(PasswordUtil.hashPassword(signup.getPassword()));

        User savedUser = authRepository.save(user);
        return modelMapper.map(savedUser , UserDto.class);
    }

    public AuthResponse login(LoginDto loginDto) {
        User user = authRepository.findByEmail(loginDto.getEmail())
                .orElseThrow(()->new ResourceNotFoundException("user with this email"+loginDto.getEmail()+"not found"));
        boolean passwordMatch = PasswordUtil.checkPassword(loginDto.getPassword() ,user.getPassword());
        if(!passwordMatch){
            throw new BadRequestException("password do not match ");
        }
        String accessToken = jwtService.generateAccessToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);

        String hashedToken = PasswordUtil.hashPassword(refreshToken);

        user.setRefreshToken(hashedToken);
        authRepository.save(user);

        return new AuthResponse(accessToken,refreshToken);

    }

    public AuthResponse refreshToken(String rawRefreshToken) {
        Long userId = jwtService.getUserIdFromToken(rawRefreshToken);
        User user = authRepository.findById(userId)
                .orElseThrow(()->new ResourceNotFoundException("user with this id is not found"+userId));
        if(!PasswordUtil.checkPassword(rawRefreshToken , user.getRefreshToken())){
            throw new BadRequestException("password wont match");
        }

        String newAccessToken = jwtService.generateAccessToken(user);
        String newRefreshToken = jwtService.generateRefreshToken(user);

        user.setRefreshToken(PasswordUtil.hashPassword(newRefreshToken));
        authRepository.save(user);

        return new AuthResponse(newAccessToken , newRefreshToken);

    }
}
