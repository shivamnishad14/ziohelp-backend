package com.ziohelp.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.util.Map;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private TemplateEngine templateEngine;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Value("${app.frontend.url:http://localhost:3000}")
    private String frontendUrl;

    public void sendEmail(String to, String subject, String content) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(content, true); // true indicates HTML content
            
            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send email", e);
        }
    }

    public void sendTicketCreatedEmail(String to, Map<String, Object> ticketData) {
        Context context = new Context();
        context.setVariable("ticket", ticketData);
        context.setVariable("frontendUrl", frontendUrl);
        
        String htmlContent = templateEngine.process("ticket-created", context);
        String subject = String.format("Ticket #%s Created - %s", 
            ticketData.get("id"), ticketData.get("title"));
        
        sendEmail(to, subject, htmlContent);
    }

    public void sendTicketUpdatedEmail(String to, Map<String, Object> ticketData, String updateType) {
        Context context = new Context();
        context.setVariable("ticket", ticketData);
        context.setVariable("updateType", updateType);
        context.setVariable("frontendUrl", frontendUrl);
        
        String htmlContent = templateEngine.process("ticket-updated", context);
        String subject = String.format("Ticket #%s Updated - %s", 
            ticketData.get("id"), ticketData.get("title"));
        
        sendEmail(to, subject, htmlContent);
    }

    public void sendTicketResolvedEmail(String to, Map<String, Object> ticketData) {
        Context context = new Context();
        context.setVariable("ticket", ticketData);
        context.setVariable("frontendUrl", frontendUrl);
        
        String htmlContent = templateEngine.process("ticket-resolved", context);
        String subject = String.format("Ticket #%s Resolved - %s", 
            ticketData.get("id"), ticketData.get("title"));
        
        sendEmail(to, subject, htmlContent);
    }

    public void sendWelcomeEmail(String to, Map<String, Object> userData) {
        Context context = new Context();
        context.setVariable("user", userData);
        context.setVariable("frontendUrl", frontendUrl);
        
        String htmlContent = templateEngine.process("welcome", context);
        String subject = "Welcome to ZioHelp - Your Account is Ready";
        
        sendEmail(to, subject, htmlContent);
    }

    public void sendPasswordResetEmail(String to, String resetToken) {
        Context context = new Context();
        context.setVariable("resetToken", resetToken);
        context.setVariable("frontendUrl", frontendUrl);
        
        String htmlContent = templateEngine.process("password-reset", context);
        String subject = "Password Reset Request - ZioHelp";
        
        sendEmail(to, subject, htmlContent);
    }

    public void sendPasswordChangedEmail(String to) {
        Context context = new Context();
        context.setVariable("frontendUrl", frontendUrl);
        
        String htmlContent = templateEngine.process("password-changed", context);
        String subject = "Password Changed - ZioHelp";
        
        sendEmail(to, subject, htmlContent);
    }

    public void sendAccountApprovedEmail(String to, Map<String, Object> userData) {
        Context context = new Context();
        context.setVariable("user", userData);
        context.setVariable("frontendUrl", frontendUrl);
        
        String htmlContent = templateEngine.process("account-approved", context);
        String subject = "Account Approved - ZioHelp";
        
        sendEmail(to, subject, htmlContent);
    }

    public void sendSLAWarningEmail(String to, Map<String, Object> ticketData, int hoursRemaining) {
        Context context = new Context();
        context.setVariable("ticket", ticketData);
        context.setVariable("hoursRemaining", hoursRemaining);
        context.setVariable("frontendUrl", frontendUrl);
        
        String htmlContent = templateEngine.process("sla-warning", context);
        String subject = String.format("SLA Warning - Ticket #%s", ticketData.get("id"));
        
        sendEmail(to, subject, htmlContent);
    }

    public void sendSLAViolationEmail(String to, Map<String, Object> ticketData) {
        Context context = new Context();
        context.setVariable("ticket", ticketData);
        context.setVariable("frontendUrl", frontendUrl);
        
        String htmlContent = templateEngine.process("sla-violation", context);
        String subject = String.format("SLA Violation - Ticket #%s", ticketData.get("id"));
        
        sendEmail(to, subject, htmlContent);
    }

    public void sendSystemNotificationEmail(String to, String notificationType, String message) {
        Context context = new Context();
        context.setVariable("notificationType", notificationType);
        context.setVariable("message", message);
        context.setVariable("frontendUrl", frontendUrl);
        
        String htmlContent = templateEngine.process("system-notification", context);
        String subject = String.format("System Notification - %s", notificationType);
        
        sendEmail(to, subject, htmlContent);
    }

    public void sendDailyReportEmail(String to, Map<String, Object> reportData) {
        Context context = new Context();
        context.setVariable("report", reportData);
        context.setVariable("frontendUrl", frontendUrl);
        
        String htmlContent = templateEngine.process("daily-report", context);
        String subject = "Daily Report - ZioHelp";
        
        sendEmail(to, subject, htmlContent);
    }

    public void sendWeeklyReportEmail(String to, Map<String, Object> reportData) {
        Context context = new Context();
        context.setVariable("report", reportData);
        context.setVariable("frontendUrl", frontendUrl);
        
        String htmlContent = templateEngine.process("weekly-report", context);
        String subject = "Weekly Report - ZioHelp";
        
        sendEmail(to, subject, htmlContent);
    }

    public void sendCommentNotificationEmail(String to, Map<String, Object> commentData) {
        Context context = new Context();
        context.setVariable("comment", commentData);
        context.setVariable("frontendUrl", frontendUrl);
        
        String htmlContent = templateEngine.process("comment-notification", context);
        String subject = String.format("New Comment on Ticket #%s", commentData.get("ticketId"));
        
        sendEmail(to, subject, htmlContent);
    }

    public void sendEscalationEmail(String to, Map<String, Object> escalationData) {
        Context context = new Context();
        context.setVariable("escalation", escalationData);
        context.setVariable("frontendUrl", frontendUrl);
        
        String htmlContent = templateEngine.process("escalation", context);
        String subject = String.format("Ticket Escalation - #%s", escalationData.get("ticketId"));
        
        sendEmail(to, subject, htmlContent);
    }

    public void sendTestEmail(String to) {
        Context context = new Context();
        context.setVariable("frontendUrl", frontendUrl);
        
        String htmlContent = templateEngine.process("test-email", context);
        String subject = "Test Email - ZioHelp";
        
        sendEmail(to, subject, htmlContent);
    }

    public void sendVerificationEmail(String to, String verificationToken) {
        Context context = new Context();
        context.setVariable("verificationToken", verificationToken);
        context.setVariable("frontendUrl", frontendUrl);
        String htmlContent = templateEngine.process("email-verification", context);
        String subject = "Verify your email - ZioHelp";
        sendEmail(to, subject, htmlContent);
    }
} 