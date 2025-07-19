package com.ziohelp.controller;

import com.ziohelp.service.GeminiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
public class AIChatController {
    @Autowired
    private GeminiService geminiService;

    @PostMapping("/chat")
    public ResponseEntity<?> chatWithAI(@RequestBody String message) {
        String aiResponse = geminiService.getGeminiResponse(message);
        return ResponseEntity.ok(aiResponse);
    }
} 