package com.ziohelp.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String type; // NEW_TICKET, COMMENT, STATUS_UPDATE
    private String message;
    private boolean seen;
    private LocalDateTime timestamp;

    @ManyToOne
    private User recipient;
} 