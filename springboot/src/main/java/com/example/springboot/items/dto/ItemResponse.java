package com.example.springboot.items.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class ItemResponse {
  @JsonProperty("_id")
  private String id;

  private String name;

  public ItemResponse(String id, String name) {
    this.id = id;
    this.name = name;
  }

  public String getId() {
    return id;
  }

  public String getName() {
    return name;
  }
}
