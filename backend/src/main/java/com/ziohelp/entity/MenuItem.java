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
    // Explicit getters and setters for compatibility
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getPath() { return path; }
    public void setPath(String path) { this.path = path; }
    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Integer getSortOrder() { return sortOrder; }
    public void setSortOrder(Integer sortOrder) { this.sortOrder = sortOrder; }
    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public Long getParentId() { return parentId; }
    public void setParentId(Long parentId) { this.parentId = parentId; }
    public java.time.LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(java.time.LocalDateTime createdAt) { this.createdAt = createdAt; }
    public java.time.LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(java.time.LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    // Builder for compatibility
    public static MenuItemBuilder builder() { return new MenuItemBuilder(); }
    public static class MenuItemBuilder {
        private MenuItem m = new MenuItem();
        public MenuItemBuilder id(Long id) { m.setId(id); return this; }
        public MenuItemBuilder name(String name) { m.setName(name); return this; }
        public MenuItemBuilder path(String path) { m.setPath(path); return this; }
        public MenuItemBuilder icon(String icon) { m.setIcon(icon); return this; }
        public MenuItemBuilder description(String description) { m.setDescription(description); return this; }
        public MenuItemBuilder sortOrder(Integer sortOrder) { m.setSortOrder(sortOrder); return this; }
        public MenuItemBuilder isActive(Boolean isActive) { m.setIsActive(isActive); return this; }
        public MenuItemBuilder category(String category) { m.setCategory(category); return this; }
        public MenuItemBuilder parentId(Long parentId) { m.setParentId(parentId); return this; }
        public MenuItemBuilder createdAt(java.time.LocalDateTime createdAt) { m.setCreatedAt(createdAt); return this; }
        public MenuItemBuilder updatedAt(java.time.LocalDateTime updatedAt) { m.setUpdatedAt(updatedAt); return this; }
        public MenuItem build() { return m; }
    }
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
