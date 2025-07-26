package com.ziohelp.controller;

import com.ziohelp.entity.FileInfo;
import com.ziohelp.service.FileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping("/api/files")
public class FileController {
    @Autowired
    private FileService fileService;

    private final String uploadDir = "uploads/";

    @PostMapping("/upload")
    @PreAuthorize("hasAnyRole('ADMIN', 'TENANT_ADMIN', 'DEVELOPER', 'USER')")
    public ResponseEntity<FileInfo> uploadFile(@RequestParam("file") MultipartFile file,
                                               @RequestParam(required = false) Long productId,
                                               @RequestParam(required = false) Long ticketId,
                                               @RequestParam(required = false) Long kbArticleId,
                                               @RequestParam(required = false) Long faqId,
                                               @RequestParam String uploadedBy) throws Exception {
        Path filePath = Paths.get(uploadDir + file.getOriginalFilename());
        Files.createDirectories(filePath.getParent());
        file.transferTo(filePath);
        FileInfo info = FileInfo.builder()
                .filename(file.getOriginalFilename())
                .url("/api/files/download/" + file.getOriginalFilename())
                .uploadedBy(uploadedBy)
                .productId(productId)
                .ticketId(ticketId)
                .kbArticleId(kbArticleId)
                .faqId(faqId)
                .build();
        return ResponseEntity.ok(fileService.save(info));
    }

    @GetMapping("/list")
    @PreAuthorize("hasAnyRole('ADMIN', 'TENANT_ADMIN', 'DEVELOPER', 'USER')")
    public ResponseEntity<List<FileInfo>> listFiles(@RequestParam(required = false) Long productId,
                                                   @RequestParam(required = false) Long ticketId,
                                                   @RequestParam(required = false) Long kbArticleId,
                                                   @RequestParam(required = false) Long faqId) {
        if (productId != null) return ResponseEntity.ok(fileService.listByProduct(productId));
        if (ticketId != null) return ResponseEntity.ok(fileService.listByTicket(ticketId));
        if (kbArticleId != null) return ResponseEntity.ok(fileService.listByKbArticle(kbArticleId));
        if (faqId != null) return ResponseEntity.ok(fileService.listByFaq(faqId));
        return ResponseEntity.ok(fileService.listAll());
    }

    @GetMapping("/download/{filename}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TENANT_ADMIN', 'DEVELOPER', 'USER')")
    public ResponseEntity<byte[]> downloadFile(@PathVariable String filename) throws Exception {
        Path filePath = Paths.get(uploadDir + filename);
        byte[] data = Files.readAllBytes(filePath);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + filename)
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(data);
    }

    @DeleteMapping("/{id}/delete")
    @PreAuthorize("hasAnyRole('ADMIN', 'TENANT_ADMIN', 'DEVELOPER')")
    public ResponseEntity<?> deleteFile(@PathVariable Long id) throws Exception {
        FileInfo info = fileService.get(id).orElseThrow(() -> new RuntimeException("File not found"));
        Path filePath = Paths.get(uploadDir + info.getFilename());
        Files.deleteIfExists(filePath);
        fileService.delete(id);
        return ResponseEntity.ok().build();
    }
} 