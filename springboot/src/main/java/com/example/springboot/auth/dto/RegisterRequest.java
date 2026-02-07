package com.example.springboot.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class RegisterRequest {
  @Email(message = "Please provide a valid email address")
  @NotBlank
  private String email;

  @NotBlank
  @Size(min = 8, message = "Password must be at least 8 characters long")
  @Pattern(regexp = ".*[A-Z].*", message = "Password must contain at least one uppercase letter")
  @Pattern(regexp = ".*[a-z].*", message = "Password must contain at least one lowercase letter")
  @Pattern(regexp = ".*[0-9].*", message = "Password must contain at least one number")
  @Pattern(regexp = ".*[!@#$%^&*(),.?\":{}|<>].*", message = "Password must contain at least one special character")
  private String password;

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
}
