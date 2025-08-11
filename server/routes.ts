import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertGuestSchema } from "@shared/schema";
import { z } from "zod";
import * as XLSX from "xlsx";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Get all guests
  app.get("/api/guests", async (req, res) => {
    try {
      const guests = await storage.getGuests();
      res.json(guests);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch guests" });
    }
  });

  // Create a new guest
  app.post("/api/guests", async (req, res) => {
    try {
      const guestData = insertGuestSchema.parse(req.body);
      const language = req.headers['x-client-language'] || 'ko';
      const guest = await storage.createGuest(guestData, language as string);
      res.status(201).json(guest);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid guest data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create guest" });
      }
    }
  });

  // Delete a guest
  app.delete("/api/guests/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteGuest(id);
      if (success) {
        res.status(204).send();
      } else {
        res.status(404).json({ message: "Guest not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to delete guest" });
    }
  });

  // Generate CSV export
  app.get("/api/guests/export/csv", async (req, res) => {
    try {
      const guests = await storage.getGuests();
      
      const headers = ['구분', '이름', '금액', '관계', '식권', '메모', '등록일시'];
      const csvRows = [
        headers.join(','),
        ...guests.map(guest => [
          guest.side,
          guest.name,
          guest.amount,
          guest.relationship,
          guest.tickets,
          guest.memo || '',
          new Date(guest.timestamp).toLocaleString('ko-KR')
        ].map(field => `"${String(field).replace(/"/g, '""')}"`).join(','))
      ];
      
      const csvContent = '\uFEFF' + csvRows.join('\n');
      const filename = 'wedding-gift-list_' + new Date().toISOString().split('T')[0] + '.csv';
      
      res.set({
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename=' + filename
      });
      res.send(csvContent);
    } catch (error) {
      console.error('CSV export error:', error);
      res.status(500).json({ message: "Failed to export CSV", error: error.message });
    }
  });

  // Generate XLSX export
  app.get("/api/guests/export/xlsx", async (req, res) => {
    try {
      const guests = await storage.getGuests();
      
      const worksheetData = [
        ['구분', '이름', '금액', '관계', '식권', '메모', '등록일시'],
        ...guests.map(guest => [
          guest.side,
          guest.name,
          guest.amount,
          guest.relationship,
          guest.tickets,
          guest.memo || '',
          new Date(guest.timestamp).toLocaleString('ko-KR')
        ])
      ];

      const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Wedding Gift List");

      const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
      const filename = 'wedding-gift-list_' + new Date().toISOString().split('T')[0] + '.xlsx';

      res.set({
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename=' + filename
      });
      res.send(buffer);
    } catch (error) {
      console.error('XLSX export error:', error);
      res.status(500).json({ message: "Failed to export XLSX", error: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
