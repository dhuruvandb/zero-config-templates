package com.example.springboot.items;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ItemRepository extends JpaRepository<Item, String> {
  List<Item> findAllByUserIdOrderByCreatedAtDesc(String userId);
}
