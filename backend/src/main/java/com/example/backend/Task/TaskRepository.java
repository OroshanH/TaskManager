package com.example.backend.Task;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.backend.Task.Task; 

@Repository
public interface TaskRepository extends JpaRepository<Task, Integer> {
}
