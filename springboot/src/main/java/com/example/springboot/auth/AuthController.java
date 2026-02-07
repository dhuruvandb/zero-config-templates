package com.example.springboot.auth;

import com.example.springboot.auth.dto.AuthResponse;
import com.example.springboot.auth.dto.LoginRequest;
import com.example.springboot.auth.dto.RegisterRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
  private final AuthService authService;

  public AuthController(AuthService authService) {
    this.authService = authService;
  }

  @PostMapping("/register")
  public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
    AuthService.TokenPair tokens = authService.register(request);
    return withRefreshCookie(new AuthResponse(tokens.accessToken()), tokens.refreshToken());
  }

  @PostMapping("/login")
  public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
    AuthService.TokenPair tokens = authService.login(request);
    return withRefreshCookie(new AuthResponse(tokens.accessToken()), tokens.refreshToken());
  }

  @PostMapping("/refresh")
  public ResponseEntity<AuthResponse> refresh(@CookieValue(value = "jid", required = false) String refreshToken) {
    if (refreshToken == null || refreshToken.isBlank()) {
      throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "No token provided");
    }
    AuthService.TokenPair tokens = authService.refresh(refreshToken);
    return withRefreshCookie(new AuthResponse(tokens.accessToken()), tokens.refreshToken());
  }

  @PostMapping("/logout")
  public ResponseEntity<String> logout(
      Authentication authentication,
      @CookieValue(value = "jid", required = false) String refreshToken,
      HttpServletResponse response) {

    String userId = authentication != null ? (String) authentication.getPrincipal() : null;
    if (userId != null && refreshToken != null) {
      authService.logout(userId, refreshToken);
    }

    ResponseCookie cleared = ResponseCookie.from("jid", "")
        .httpOnly(true)
        .secure(false)
        .path("/api/auth/refresh")
        .maxAge(0)
        .sameSite("Lax")
        .build();

    response.addHeader(HttpHeaders.SET_COOKIE, cleared.toString());
    return ResponseEntity.ok("Logged out");
  }

  private ResponseEntity<AuthResponse> withRefreshCookie(AuthResponse body, String refreshToken) {
    ResponseCookie cookie = ResponseCookie.from("jid", refreshToken)
        .httpOnly(true)
        .secure(false)
        .path("/api/auth/refresh")
        .maxAge(60L * 60 * 24 * 7)
        .sameSite("Lax")
        .build();

    return ResponseEntity.ok()
        .header(HttpHeaders.SET_COOKIE, cookie.toString())
        .body(body);
  }
}
