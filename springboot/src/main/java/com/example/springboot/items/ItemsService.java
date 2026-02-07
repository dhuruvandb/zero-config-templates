package com.example.springboot.items;

import com.example.springboot.items.dto.CreateItemRequest;
import com.example.springboot.items.dto.ItemResponse;
import com.example.springboot.user.User;
import com.example.springboot.user.UserRepository;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class ItemsService {
  private final ItemRepository itemRepository;
  private final UserRepository userRepository;

  public ItemsService(ItemRepository itemRepository, UserRepository userRepository) {
    this.itemRepository = itemRepository;
    this.userRepository = userRepository;
  }

  public ItemResponse create(CreateItemRequest request, String userId) {
    User user = userRepository.findById(userId)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));

    Item item = new Item();
    item.setName(request.getName());
    item.setUser(user);

    Item saved = itemRepository.save(item);
    return new ItemResponse(saved.getId(), saved.getName());
  }

  public List<ItemResponse> findAll(String userId) {
    return itemRepository.findAllByUserIdOrderByCreatedAtDesc(userId).stream()
        .map(i -> new ItemResponse(i.getId(), i.getName()))
        .collect(Collectors.toList());
  }

  public void remove(String id, String userId) {
    Item item = itemRepository.findById(id)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Item not found"));

    if (!item.getUser().getId().equals(userId)) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Item not found");
    }

    itemRepository.delete(item);
  }
}
