package com.ziohelp.service;

import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import com.ziohelp.entity.Ticket;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.util.List;

@Service
public class PdfExportService {

    public byte[] exportTickets(List<Ticket> tickets) throws Exception {
        Document document = new Document();
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        PdfPTable table = new PdfPTable(4);
        table.setWidthPercentage(100);
        table.setWidths(new int[]{1, 3, 3, 2});

        table.addCell("ID");
        table.addCell("Title");
        table.addCell("Status");
        table.addCell("Priority");

        for (Ticket ticket : tickets) {
            table.addCell(String.valueOf(ticket.getId()));
            table.addCell(ticket.getTitle());
            table.addCell(ticket.getStatus());
            table.addCell(ticket.getPriority());
        }

        PdfWriter.getInstance(document, out);
        document.open();
        document.add(table);
        document.close();
        return out.toByteArray();
    }
} 