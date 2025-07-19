package com.ziohelp.service;

import org.springframework.stereotype.Service;

@Service
public class GeminiService {
    public String getGeminiResponse(String message) {
        // TODO: Integrate with Gemini API using API key from config
        return "[Gemini AI] You asked: " + message + " (This is a stubbed Gemini response.)";
    }
} 