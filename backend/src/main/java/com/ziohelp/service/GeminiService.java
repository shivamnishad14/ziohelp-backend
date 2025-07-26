package com.ziohelp.service;

import com.ziohelp.entity.Ticket;
import com.ziohelp.entity.Faq;
import com.ziohelp.repository.TicketRepository;
import com.ziohelp.repository.FaqRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.stream.Collectors;
import java.util.Random;

@Service
public class GeminiService {

    @Value("${gemini.api.key:}")
    private String geminiApiKey;

    @Value("${gemini.project.id:}")
    private String projectId;

    @Value("${gemini.location:us-central1}")
    private String location;

    @Autowired
    private TicketRepository ticketRepository;

    @Autowired
    private FaqRepository faqRepository;

    private final Random random = new Random();

    public void initializeModel() {
        System.out.println("GeminiService: AI model initialized with mock responses");
    }

    public Map<String, Object> chatWithAI(String question, String productId) {
        Map<String, Object> response = new HashMap<>();
        
        // Mock AI responses based on question content
        String reply = generateMockResponse(question);
        
        response.put("success", true);
        response.put("reply", reply);
        response.put("confidence", 0.85);
        
        return response;
    }

    public Map<String, Object> analyzeTicket(Long ticketId, String productId) {
        Map<String, Object> analysis = new HashMap<>();
        
        // Mock ticket analysis
        analysis.put("success", true);
        analysis.put("category", "Technical Support");
        analysis.put("priority", "MEDIUM");
        analysis.put("estimatedResolutionTime", "2-4 hours");
        List<Long> similarTickets = Arrays.asList(1L, 2L, 3L);
        analysis.put("similarTickets", similarTickets);
        analysis.put("suggestedResponse", "Thank you for your ticket. Our team will investigate this issue.");
        
        return analysis;
    }

    public Map<String, Object> generateResponse(Long ticketId, String productId, String responseType) {
        Map<String, Object> response = new HashMap<>();
        
        // Mock response generation
        String generatedResponse = generateMockResponse("Generate " + responseType + " response");
        
        response.put("success", true);
        response.put("response", generatedResponse);
        response.put("type", responseType);
        
        return response;
    }

    public Map<String, Object> searchKnowledge(String query, String productId) {
        Map<String, Object> searchResult = new HashMap<>();
        
        // Mock knowledge base search
        searchResult.put("success", true);
        List<Map<String, Object>> results = new ArrayList<>();
        Map<String, Object> r1 = new HashMap<>();
        r1.put("title", "How to reset password");
        r1.put("content", "Follow these steps...");
        r1.put("relevance", 0.9);
        results.add(r1);
        Map<String, Object> r2 = new HashMap<>();
        r2.put("title", "Account setup guide");
        r2.put("content", "Complete setup process...");
        r2.put("relevance", 0.8);
        results.add(r2);
        searchResult.put("results", results);
        
        return searchResult;
    }

    public Map<String, Object> getAIStatus() {
        Map<String, Object> status = new HashMap<>();
        
        status.put("available", true);
        status.put("model", "mock-gemini");
        status.put("projectId", projectId);
        status.put("location", location);
        status.put("apiKeyConfigured", geminiApiKey != null && !geminiApiKey.isEmpty());
        status.put("message", "AI service running with mock responses");

        return status;
    }

    public Map<String, Object> suggestFAQ(String ticketDescription, String productId) {
        Map<String, Object> suggestion = new HashMap<>();
        
        // Mock FAQ suggestions
        List<String> suggestions = Arrays.asList(
            "How to reset my password?",
            "Account setup guide",
            "Troubleshooting common issues",
            "Feature request process"
        );
        
        suggestion.put("success", true);
        suggestion.put("suggestions", suggestions);
        
        return suggestion;
    }

    public Map<String, Object> autoCategorizeTicket(String title, String description, String productId) {
        Map<String, Object> categorization = new HashMap<>();
        
        // Mock categorization based on keywords
        String category = categorizeByKeywords(title + " " + description);
        String priority = determinePriority(title + " " + description);
        
        categorization.put("success", true);
        categorization.put("category", category);
        categorization.put("priority", priority);
        categorization.put("confidence", 0.8);
        
        return categorization;
    }

    public Map<String, Object> smartAssistant(String task, String context, String productId) {
        Map<String, Object> result = new HashMap<>();
        
        // Mock smart assistant responses
        String response = generateMockResponse("Smart assistant: " + task + " " + context);
        
        result.put("success", true);
        result.put("response", response);
        result.put("task", task);
        
        return result;
    }

    private String generateMockResponse(String question) {
        String lowerQuestion = question.toLowerCase();
        
        if (lowerQuestion.contains("password") || lowerQuestion.contains("reset")) {
            return "To reset your password, go to the login page and click 'Forgot Password'. You'll receive an email with reset instructions.";
        } else if (lowerQuestion.contains("account") || lowerQuestion.contains("setup")) {
            return "To set up your account, please follow the welcome email instructions. If you need help, contact our support team.";
        } else if (lowerQuestion.contains("ticket") || lowerQuestion.contains("support")) {
            return "To create a support ticket, use the 'Create Ticket' button in your dashboard. Our team will respond within 24 hours.";
        } else if (lowerQuestion.contains("feature") || lowerQuestion.contains("request")) {
            return "For feature requests, please create a ticket with category 'Feature Request'. We review all suggestions regularly.";
        } else if (lowerQuestion.contains("bug") || lowerQuestion.contains("error")) {
            return "For bug reports, please include screenshots and detailed steps to reproduce the issue. This helps us resolve it faster.";
        } else {
            return "Thank you for your question. Our support team is here to help. You can create a ticket for specific assistance.";
        }
    }

    private String categorizeByKeywords(String text) {
        String lowerText = text.toLowerCase();
        
        if (lowerText.contains("password") || lowerText.contains("login")) {
            return "Authentication";
        } else if (lowerText.contains("bug") || lowerText.contains("error")) {
            return "Technical Issue";
        } else if (lowerText.contains("feature") || lowerText.contains("request")) {
            return "Feature Request";
        } else if (lowerText.contains("billing") || lowerText.contains("payment")) {
            return "Billing";
        } else {
            return "General Support";
        }
    }

    private String determinePriority(String text) {
        String lowerText = text.toLowerCase();
        
        if (lowerText.contains("urgent") || lowerText.contains("critical") || lowerText.contains("broken")) {
            return "HIGH";
        } else if (lowerText.contains("important") || lowerText.contains("blocking")) {
            return "MEDIUM";
        } else {
            return "LOW";
        }
    }

    private Map<String, Object> parseAnalysis(String analysisText) {
        Map<String, Object> analysis = new HashMap<>();
        analysis.put("raw", analysisText);
        return analysis;
    }

    private Map<String, Object> parseCategorization(String categorizationText) {
        Map<String, Object> categorization = new HashMap<>();
        categorization.put("raw", categorizationText);
        return categorization;
    }
} 