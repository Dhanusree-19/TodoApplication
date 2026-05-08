package com.example.alter.controller;

import com.example.alter.entity.Todo;
import com.example.alter.entity.User;
import com.example.alter.repository.UserRepository;
import com.example.alter.service.TodoService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/todos")
public class TodoController {

    private final TodoService todoService;
    private final UserRepository userRepository;

    public TodoController(TodoService todoService, UserRepository userRepository) {
        this.todoService = todoService;
        this.userRepository = userRepository;
    }

    @GetMapping
    public List<TodoResponse> getTodos(Authentication authentication) {
        return todoService.getTodosForUser(getCurrentUser(authentication))
                .stream()
                .map(TodoResponse::from)
                .toList();
    }

    @PostMapping
    public TodoResponse createTodo(@RequestBody TodoRequest request, Authentication authentication) {
        Todo todo = todoService.createTodoForUser(getCurrentUser(authentication), request.task());
        return TodoResponse.from(todo);
    }

    @PutMapping("/{id}")
    public TodoResponse updateTodo(@PathVariable Long id,
                                   @RequestBody TodoRequest request,
                                   Authentication authentication) {
        Todo todo = todoService.updateTodoForUser(
                id,
                getCurrentUser(authentication),
                request.task(),
                Boolean.TRUE.equals(request.completed())
        );
        return TodoResponse.from(todo);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTodo(@PathVariable Long id, Authentication authentication) {
        todoService.deleteTodoForUser(id, getCurrentUser(authentication));
        return ResponseEntity.noContent().build();
    }

    private User getCurrentUser(Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            throw new RuntimeException("Authenticated user not found.");
        }

        return userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Authenticated user not found."));
    }

    public record TodoRequest(String task, Boolean completed) {
    }

    public record TodoResponse(Long id, String task, boolean completed) {
        public static TodoResponse from(Todo todo) {
            return new TodoResponse(todo.getId(), todo.getTask(), todo.isCompleted());
        }
    }
}
