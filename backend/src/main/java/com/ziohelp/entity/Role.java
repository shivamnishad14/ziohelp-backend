
package com.ziohelp.entity;

import jakarta.persistence.*;
import lombok.*;
import jakarta.validation.constraints.NotBlank;
import java.util.Set;

@Entity
@Table(name = "roles")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Role {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Role name is required")
    @Column(unique = true, nullable = false)
    private String name;

    // Indicates if this is a system role (for filtering in repository)
    @Column(nullable = false)
    @Builder.Default
    private boolean isSystem = false;

    // Indicates if this role is active (for filtering in repository)
    @Column(nullable = false)
    @Builder.Default
    private boolean isActive = true;
    @ManyToMany(mappedBy = "roles")
    private Set<User> users;
}