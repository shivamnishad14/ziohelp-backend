package com.ziohelp.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "attachments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Attachment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Original filename is required")
    @Size(max = 255, message = "Original filename cannot exceed 255 characters")
    @Column(name = "original_filename", nullable = false)
    private String originalFilename;

    @NotBlank(message = "File path is required")
    @Size(max = 500, message = "File path cannot exceed 500 characters")
    @Column(name = "file_path", nullable = false)
    private String filePath;

    @NotBlank(message = "File type is required")
    @Size(max = 100, message = "File type cannot exceed 100 characters")
    @Column(name = "file_type", nullable = false)
    private String fileType;

    @NotNull(message = "File size is required")
    @Column(name = "file_size", nullable = false)
    private Long fileSize;

    @Size(max = 50, message = "Category cannot exceed 50 characters")
    @Column(name = "category")
    private String category;

    // References to parent entities
    @Column(name = "ticket_id")
    private Long ticketId;

    @Column(name = "comment_id")
    private Long commentId;

    @Column(name = "knowledge_base_id")
    private Long knowledgeBaseId;

    @NotNull(message = "Uploaded by user is required")
    @Column(name = "uploaded_by", nullable = false)
    private Long uploadedBy;

    @CreationTimestamp
    @Column(name = "uploaded_at", nullable = false, updatable = false)
    private LocalDateTime uploadedAt;

    @Column(name = "description")
    private String description;

    @Builder.Default
    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    // Relationships
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ticket_id", insertable = false, updatable = false)
    private Ticket ticket;

    // Legacy fields for backward compatibility
    @Transient
    private String filename;
    
    @Transient
    private String url;
    
    @Transient
    private String contentType;

    // Helper methods
    public String getFileExtension() {
        if (originalFilename != null && originalFilename.contains(".")) {
            return originalFilename.substring(originalFilename.lastIndexOf("."));
        }
        return "";
    }

    public String getFileSizeFormatted() {
        if (fileSize == null) return "Unknown";
        
        double size = fileSize.doubleValue();
        String[] units = {"B", "KB", "MB", "GB"};
        int unitIndex = 0;
        
        while (size >= 1024 && unitIndex < units.length - 1) {
            size /= 1024;
            unitIndex++;
        }
        
        return String.format("%.1f %s", size, units[unitIndex]);
    }

    public boolean isImage() {
        String extension = getFileExtension().toLowerCase();
        return extension.matches("\\.(jpg|jpeg|png|gif|bmp|svg)");
    }

    public boolean isDocument() {
        String extension = getFileExtension().toLowerCase();
        return extension.matches("\\.(pdf|doc|docx|txt|rtf|odt)");
    }

    // Legacy compatibility methods
    public String getFilename() {
        return originalFilename;
    }

    public void setFilename(String filename) {
        this.originalFilename = filename;
    }

    public String getUrl() {
        return "/api/files/download/" + id;
    }

    public String getContentType() {
        return fileType;
    }

    public void setContentType(String contentType) {
        this.fileType = contentType;
    }
} 