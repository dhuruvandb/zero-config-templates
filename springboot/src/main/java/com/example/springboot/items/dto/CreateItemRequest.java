package com.example.springboot.items.dto;

import jakarta.validation.constraints.NotBlank;

public class CreateItemRequest {
  @NotBlank
  private String name;

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }
}
