import { type User, type InsertUser, type EmailVerification, type InsertEmailVerification } from "@shared/schema";
import { randomUUID, scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByReferralCode(referralCode: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  verifyPassword(password: string, hashedPassword: string): Promise<boolean>;
  
  // Email verification operations
  createEmailVerification(verification: InsertEmailVerification): Promise<EmailVerification>;
  getEmailVerification(email: string): Promise<EmailVerification | undefined>;
  updateEmailVerificationAttempts(email: string, attempts: number): Promise<void>;
  markEmailVerified(email: string): Promise<void>;
  deleteEmailVerification(email: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private emailVerifications: Map<string, EmailVerification>;

  constructor() {
    this.users = new Map();
    this.emailVerifications = new Map();
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email.toLowerCase(),
    );
  }

  async getUserByReferralCode(referralCode: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.referralCode === referralCode,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    // Generate a unique referral code (base36 from timestamp + random)
    const referralCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    // Hash the password with salt using scrypt
    const salt = randomBytes(32);
    const hashedPassword = (await scryptAsync(insertUser.password, salt, 64)) as Buffer;
    const passwordHash = `${salt.toString('hex')}:${hashedPassword.toString('hex')}`;
    
    // Find referrer if referralCode is provided
    let referredByUserId: string | null = null;
    if (insertUser.referredByUserId) {
      const referrer = await this.getUserByReferralCode(insertUser.referredByUserId);
      if (referrer) {
        referredByUserId = referrer.id;
      }
    }
    
    const user: User = { 
      id,
      email: insertUser.email.toLowerCase(),
      username: insertUser.username,
      passwordHash,
      referralCode,
      referredByUserId
    };
    
    this.users.set(id, user);
    return user;
  }

  async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    try {
      const [saltHex, hashHex] = hashedPassword.split(':');
      if (!saltHex || !hashHex) return false;
      
      const salt = Buffer.from(saltHex, 'hex');
      const hash = Buffer.from(hashHex, 'hex');
      
      const hashedInput = (await scryptAsync(password, salt, 64)) as Buffer;
      return timingSafeEqual(hash, hashedInput);
    } catch {
      return false;
    }
  }

  // Email verification operations
  async createEmailVerification(insertVerification: InsertEmailVerification): Promise<EmailVerification> {
    const id = randomUUID();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 10 * 60 * 1000); // 10 minutes
    
    // Generate 6-digit code and hash it (for now just store as is)
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const codeHash = code; // Should be hashed in production
    
    // Log the code for development (replace with email sending later)
    console.log(`📧 Verification code for ${insertVerification.email}: ${code}`);
    
    const verification: EmailVerification = {
      id,
      email: insertVerification.email.toLowerCase(),
      codeHash,
      expiresAt,
      attempts: 0,
      verified: false
    };
    
    this.emailVerifications.set(insertVerification.email.toLowerCase(), verification);
    return verification;
  }

  async getEmailVerification(email: string): Promise<EmailVerification | undefined> {
    return this.emailVerifications.get(email.toLowerCase());
  }

  async updateEmailVerificationAttempts(email: string, attempts: number): Promise<void> {
    const verification = this.emailVerifications.get(email.toLowerCase());
    if (verification) {
      verification.attempts = attempts;
      this.emailVerifications.set(email.toLowerCase(), verification);
    }
  }

  async markEmailVerified(email: string): Promise<void> {
    const verification = this.emailVerifications.get(email.toLowerCase());
    if (verification) {
      verification.verified = true;
      this.emailVerifications.set(email.toLowerCase(), verification);
    }
  }

  async deleteEmailVerification(email: string): Promise<void> {
    this.emailVerifications.delete(email.toLowerCase());
  }
}

export const storage = new MemStorage();
