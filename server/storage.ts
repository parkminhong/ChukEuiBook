import { type Guest, type InsertGuest } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getGuests(): Promise<Guest[]>;
  getGuest(id: string): Promise<Guest | undefined>;
  createGuest(guest: InsertGuest, language?: string): Promise<Guest>;
  deleteGuest(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private guests: Map<string, Guest>;

  constructor() {
    this.guests = new Map();
  }

  async getGuests(): Promise<Guest[]> {
    return Array.from(this.guests.values()).sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  async getGuest(id: string): Promise<Guest | undefined> {
    return this.guests.get(id);
  }

  async createGuest(insertGuest: InsertGuest, language?: string): Promise<Guest> {
    const id = randomUUID();
    const timezone = language ? {
      ko: 'Asia/Seoul',
      en: 'America/New_York', 
      ja: 'Asia/Tokyo',
      zh: 'Asia/Shanghai'
    }[language as 'ko' | 'en' | 'ja' | 'zh'] || 'Asia/Seoul' : 'Asia/Seoul';
    
    const guest: Guest = { 
      ...insertGuest, 
      id, 
      timestamp: new Date(),
      timezone
    };
    this.guests.set(id, guest);
    return guest;
  }

  async deleteGuest(id: string): Promise<boolean> {
    return this.guests.delete(id);
  }
}

export const storage = new MemStorage();
