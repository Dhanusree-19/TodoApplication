package com.example.alter.service;

import com.example.alter.entity.Todo;
import com.example.alter.entity.User;
import com.example.alter.repository.TodoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TodoService {

    private final TodoRepository todoRepository;

    public TodoService(TodoRepository todoRepository) {
        this.todoRepository = todoRepository;
    }

    public List<Todo> getTodosForUser(User user) {
        return todoRepository.findByUser(user);
    }

    public Todo createTodoForUser(User user, String task) {
        String cleanTask = cleanTask(task);

        Todo todo = new Todo();
        todo.setTask(cleanTask);
        todo.setCompleted(false);
        todo.setUser(user);

        return todoRepository.save(todo);
    }

    public Todo updateTodoForUser(Long id, User user, String task, boolean completed) {
        Todo todo = todoRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new RuntimeException("Todo not found."));

        todo.setTask(cleanTask(task));
        todo.setCompleted(completed);

        return todoRepository.save(todo);
    }

    public void deleteTodoForUser(Long id, User user) {
        Todo todo = todoRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new RuntimeException("Todo not found."));

        todoRepository.delete(todo);
    }

    private String cleanTask(String task) {
        String cleanTask = task == null ? "" : task.trim();
        if (cleanTask.isBlank()) {
            throw new RuntimeException("Task cannot be empty.");
        }
        return cleanTask;
    }
}
