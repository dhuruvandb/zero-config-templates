package com.example.springboot.auth;

import com.example.springboot.auth.dto.LoginRequest;
import com.example.springboot.auth.dto.RegisterRequest;
import com.example.springboot.user.User;
import com.example.springboot.user.UserRepository;
import java.util.ArrayList;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

@Service
public class AuthService {
  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;
  private final JwtService jwtService;

  public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
    this.jwtService = jwtService;
  }

  public TokenPair register(RegisterRequest request) {
    if (userRepository.findByEmail(request.getEmail()).isPresent()) {
      throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User already exists");
    }

    User user = new User();
    user.setEmail(request.getEmail());
    user.setPassword(passwordEncoder.encode(request.getPassword()));
    user.setRefreshTokens(new ArrayList<>());
    userRepository.save(user);

    String accessToken = jwtService.generateAccessToken(user.getId());
    String refreshToken = jwtService.generateRefreshToken(user.getId());

    user.getRefreshTokens().add(refreshToken);
    userRepository.save(user);

    return new TokenPair(accessToken, refreshToken);
  }

  public TokenPair login(LoginRequest request) {
    User user = userRepository.findByEmail(request.getEmail())
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials"));

    if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
      throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
    }

    String accessToken = jwtService.generateAccessToken(user.getId());
    String refreshToken = jwtService.generateRefreshToken(user.getId());

    user.getRefreshTokens().add(refreshToken);
    userRepository.save(user);

    return new TokenPair(accessToken, refreshToken);
  }

  public TokenPair refresh(String oldRefreshToken) {
    String userId;
    try {
      userId = jwtService.validateRefreshTokenAndGetUserId(oldRefreshToken);
    } catch (Exception ex) {
      throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid refresh token");
    }

    User user = userRepository.findById(userId)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));

    if (!user.getRefreshTokens().contains(oldRefreshToken)) {
      throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Refresh token revoked");
    }

    String newAccessToken = jwtService.generateAccessToken(userId);
    String newRefreshToken = jwtService.generateRefreshToken(userId);

    user.getRefreshTokens().remove(oldRefreshToken);
    user.getRefreshTokens().add(newRefreshToken);
    userRepository.save(user);

    return new TokenPair(newAccessToken, newRefreshToken);
  }

  public void logout(String userId, String refreshToken) {
    userRepository.findById(userId).ifPresent(user -> {
      user.getRefreshTokens().remove(refreshToken);
      userRepository.save(user);
    });
  }

  public record TokenPair(String accessToken, String refreshToken) {}
}
