package com.ziohelp.controller;

import com.ziohelp.service.GeminiService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/ai")
@Tag(name = "AI Chat & Analysis", description = "AI-powered chatbot, ticket analysis, and smart assistance")
public class AIChatController {

    @Autowired
    private GeminiService geminiService;

    @PostMapping("/chat")
    @PreAuthorize("hasAnyRole('ADMIN', 'TENANT_ADMIN', 'DEVELOPER', 'USER')")
    @Operation(summary = "Chat with AI", description = "Ask questions to the AI chatbot")
    public ResponseEntity<Map<String, Object>> chatWithAI(
            @RequestParam String question,
            @RequestParam String productId) {
        return ResponseEntity.ok(geminiService.chatWithAI(question, productId));
    }

    @PostMapping("/analyze-ticket")
    @PreAuthorize("hasAnyRole('ADMIN', 'TENANT_ADMIN', 'DEVELOPER')")
    @Operation(summary = "Analyze ticket", description = "Get AI analysis and insights for a ticket")
    public ResponseEntity<Map<String, Object>> analyzeTicket(
            @RequestParam Long ticketId,
            @RequestParam String productId) {
        return ResponseEntity.ok(geminiService.analyzeTicket(ticketId, productId));
    }

    @PostMapping("/generate-response")
    @PreAuthorize("hasAnyRole('ADMIN', 'TENANT_ADMIN', 'DEVELOPER')")
    @Operation(summary = "Generate response", description = "Generate AI-powered response for a ticket")
    public ResponseEntity<Map<String, Object>> generateResponse(
            @RequestParam Long ticketId,
            @RequestParam String productId,
            @RequestParam String responseType) {
        return ResponseEntity.ok(geminiService.generateResponse(ticketId, productId, responseType));
    }

    @PostMapping("/search-knowledge")
    @PreAuthorize("hasAnyRole('ADMIN', 'TENANT_ADMIN', 'DEVELOPER', 'USER')")
    @Operation(summary = "Search knowledge base", description = "Search knowledge base using AI")
    public ResponseEntity<Map<String, Object>> searchKnowledge(
            @RequestParam String query,
            @RequestParam String productId) {
        return ResponseEntity.ok(geminiService.searchKnowledge(query, productId));
    }

    @GetMapping("/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'TENANT_ADMIN', 'DEVELOPER')")
    @Operation(summary = "Get AI status", description = "Check AI service availability and configuration")
    public ResponseEntity<Map<String, Object>> getAIStatus() {
        return ResponseEntity.ok(geminiService.getAIStatus());
    }

    @PostMapping("/suggest-faq")
    @PreAuthorize("hasAnyRole('ADMIN', 'TENANT_ADMIN', 'DEVELOPER')")
    @Operation(summary = "Suggest FAQ", description = "Get AI suggestions for FAQ articles based on ticket description")
    public ResponseEntity<Map<String, Object>> suggestFAQ(
            @RequestParam String ticketDescription,
            @RequestParam String productId) {
        return ResponseEntity.ok(geminiService.suggestFAQ(ticketDescription, productId));
    }

    @PostMapping("/auto-categorize")
    @PreAuthorize("hasAnyRole('ADMIN', 'TENANT_ADMIN', 'DEVELOPER', 'USER')")
    @Operation(summary = "Auto categorize ticket", description = "Automatically categorize and tag tickets using AI")
    public ResponseEntity<Map<String, Object>> autoCategorizeTicket(
            @RequestParam String title,
            @RequestParam String description,
            @RequestParam String productId) {
        return ResponseEntity.ok(geminiService.autoCategorizeTicket(title, description, productId));
    }

    @PostMapping("/smart-assistant")
    @PreAuthorize("hasAnyRole('ADMIN', 'TENANT_ADMIN', 'DEVELOPER', 'USER')")
    @Operation(summary = "Smart assistant", description = "Get AI-powered smart assistance for various tasks")
    public ResponseEntity<Map<String, Object>> smartAssistant(
            @RequestParam String task,
            @RequestParam String context,
            @RequestParam String productId) {
        return ResponseEntity.ok(geminiService.smartAssistant(task, context, productId));
    }
} 