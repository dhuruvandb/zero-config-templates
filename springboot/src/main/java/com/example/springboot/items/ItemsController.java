package com.example.springboot.items;

import com.example.springboot.items.dto.CreateItemRequest;
import com.example.springboot.items.dto.ItemResponse;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/items")
public class ItemsController {
  private final ItemsService itemsService;

  public ItemsController(ItemsService itemsService) {
    this.itemsService = itemsService;
  }

  @GetMapping
  public List<ItemResponse> getItems(Authentication authentication) {
    String userId = (String) authentication.getPrincipal();
    return itemsService.findAll(userId);
  }

  @PostMapping
  public ItemResponse create(@Valid @RequestBody CreateItemRequest request, Authentication authentication) {
    String userId = (String) authentication.getPrincipal();
    return itemsService.create(request, userId);
  }

  @DeleteMapping("/{id}")
  @ResponseStatus(HttpStatus.OK)
  public String delete(@PathVariable String id, Authentication authentication) {
    String userId = (String) authentication.getPrincipal();
    itemsService.remove(id, userId);
    return "Deleted";
  }
}
