package com.example.springboot.auth;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;
import javax.crypto.SecretKey;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class JwtService {
  private final SecretKey accessSecret;
  private final SecretKey refreshSecret;
  private final String accessExpiry;
  private final String refreshExpiry;

  public JwtService(
      @Value("${app.jwt.access-secret}") String accessSecret,
      @Value("${app.jwt.refresh-secret}") String refreshSecret,
      @Value("${app.jwt.access-expiry}") String accessExpiry,
      @Value("${app.jwt.refresh-expiry}") String refreshExpiry) {
    this.accessSecret = Keys.hmacShaKeyFor(accessSecret.getBytes(StandardCharsets.UTF_8));
    this.refreshSecret = Keys.hmacShaKeyFor(refreshSecret.getBytes(StandardCharsets.UTF_8));
    this.accessExpiry = accessExpiry;
    this.refreshExpiry = refreshExpiry;
  }

  public String generateAccessToken(String userId) {
    return buildToken(userId, accessSecret, accessExpiry);
  }

  public String generateRefreshToken(String userId) {
    return buildToken(userId, refreshSecret, refreshExpiry);
  }

  public String validateAccessTokenAndGetUserId(String token) {
    return parseToken(token, accessSecret).get("userId", String.class);
  }

  public String validateRefreshTokenAndGetUserId(String token) {
    return parseToken(token, refreshSecret).get("userId", String.class);
  }

  private String buildToken(String userId, SecretKey key, String expiry) {
    long expiryMillis = parseExpiryToMillis(expiry);
    Instant now = Instant.now();
    return Jwts.builder()
        .claim("userId", userId)
        .issuedAt(Date.from(now))
        .expiration(Date.from(now.plusMillis(expiryMillis)))
        .signWith(key)
        .compact();
  }

  private Claims parseToken(String token, SecretKey key) {
    return Jwts.parser()
        .verifyWith(key)
        .build()
        .parseSignedClaims(token)
        .getPayload();
  }

  private long parseExpiryToMillis(String expiry) {
    if (expiry == null || expiry.isBlank()) {
      return 15 * 60 * 1000L;
    }

    char unit = expiry.charAt(expiry.length() - 1);
    long value = Long.parseLong(expiry.substring(0, expiry.length() - 1));
    return switch (unit) {
      case 's' -> value * 1000L;
      case 'm' -> value * 60_000L;
      case 'h' -> value * 3_600_000L;
      case 'd' -> value * 86_400_000L;
      default -> value;
    };
  }
}
