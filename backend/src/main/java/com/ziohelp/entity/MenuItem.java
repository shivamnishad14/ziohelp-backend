package com.ziohelp.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "menu_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MenuItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String path;

    private String icon;
    private String description;
    private Integer sortOrder;
    private Boolean isActive;
    private String category;
    private Long parentId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
