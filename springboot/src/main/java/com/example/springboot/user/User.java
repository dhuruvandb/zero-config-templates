package com.example.springboot.user;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "users")
public class User {
  @Id
  @Column(length = 36)
  private String id;

  @Column(unique = true, nullable = false)
  private String email;

  @Column(nullable = false)
  private String password;

  @ElementCollection(fetch = FetchType.EAGER)
  @CollectionTable(name = "user_refresh_tokens", joinColumns = @JoinColumn(name = "user_id"))
  @Column(name = "token", nullable = false, length = 512)
  private List<String> refreshTokens = new ArrayList<>();

  @Column(nullable = false)
  private LocalDateTime createdAt;

  @Column(nullable = false)
  private LocalDateTime updatedAt;

  @PrePersist
  public void prePersist() {
    this.id = this.id == null ? UUID.randomUUID().toString() : this.id;
    this.createdAt = LocalDateTime.now();
    this.updatedAt = this.createdAt;
  }

  @PreUpdate
  public void preUpdate() {
    this.updatedAt = LocalDateTime.now();
  }

  public String getId() {
    return id;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public String getPassword() {
    return password;
  }

  public void setPassword(String password) {
    this.password = password;
  }

  public List<String> getRefreshTokens() {
    return refreshTokens;
  }

  public void setRefreshTokens(List<String> refreshTokens) {
    this.refreshTokens = refreshTokens;
  }
}
