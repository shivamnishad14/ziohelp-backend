package com.ziohelp.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MenuItemDto {
    private Long id;
    private String name;
    private String path;
    private String icon; // Should be a string like "Dashboard", "Ticket", etc.
    private String description;
    private Integer sortOrder;
    private Boolean isActive;
    private String category;
    private Long parentId;
    private List<MenuItemDto> children;
    private List<String> roles; // List of role names allowed to see this menu item
}
