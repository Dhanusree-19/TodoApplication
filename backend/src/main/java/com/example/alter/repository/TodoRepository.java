package com.example.alter.repository;

import com.example.alter.entity.Todo;
import com.example.alter.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface TodoRepository extends JpaRepository<Todo, Long> {
    List<Todo> findByUser(User user);
    Optional<Todo> findByIdAndUser(Long id, User user);
}
