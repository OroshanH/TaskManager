package com.example.backend.Task;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "tasks")
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // matches H2 IDENTITY
    private Integer id;

    @Column(nullable = false, length = 200)
    private String title;

    private LocalDate dueDate;

    @Column(length = 20)
    private String priority;

    @Column(length = 20)
    private String status;

    // Constructors
    public Task() {}

    public Task(String title, LocalDate dueDate, String priority, String status) {
        this.title = title;
        this.dueDate = dueDate;
        this.priority = priority;
        this.status = status;
    }

    // Getters and setters
    public Integer getId() {
        return id;
    }
    public void setId(Integer id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }
    public void setTitle(String title) {
        this.title = title;
    }

    public LocalDate getDueDate() {
        return dueDate;
    }
    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }

    public String getPriority() {
        return priority;
    }
    public void setPriority(String priority) {
        this.priority = priority;
    }

    public String getStatus() {
        return status;
    }
    public void setStatus(String status) {
        this.status = status;
    }
}