package com.ziohelp.controller;

import com.ziohelp.entity.Ticket;
import com.ziohelp.repository.TicketRepository;
import com.itextpdf.text.Document;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.pdf.PdfWriter;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/tickets")
@RequiredArgsConstructor
public class TicketExportController {

    private final TicketRepository ticketRepository;

    @GetMapping("/export/pdf")
    public void exportToPDF(HttpServletResponse response) throws IOException {
        List<Ticket> tickets = ticketRepository.findAll();
        response.setContentType("application/pdf");
        response.setHeader("Content-Disposition", "attachment; filename=tickets-report.pdf");

        try {
            Document document = new Document();
            PdfWriter.getInstance(document, response.getOutputStream());
            document.open();
            document.add(new Paragraph("Tickets Report"));
            document.add(new Paragraph(" "));

            for (Ticket t : tickets) {
                document.add(new Paragraph("#" + t.getId() + " | " + t.getTitle() + " | Status: " + t.getStatus()));
            }

            document.close();
        } catch (Exception e) {
            throw new IOException("Failed to export PDF", e);
        }
    }
} 