import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  sendCodeSchema, 
  verifyCodeSchema, 
  insertUserSchema, 
  signInSchema 
} from "@shared/schema";
import { z } from "zod";

// Simple in-memory rate limiter
class RateLimiter {
  private attempts: Map<string, { count: number; windowStart: number }> = new Map();
  
  isRateLimited(key: string, maxAttempts: number, windowMs: number): boolean {
    const now = Date.now();
    const record = this.attempts.get(key);
    
    if (!record || now - record.windowStart > windowMs) {
      this.attempts.set(key, { count: 1, windowStart: now });
      return false;
    }
    
    if (record.count >= maxAttempts) {
      return true;
    }
    
    record.count++;
    return false;
  }
  
  cleanup() {
    const now = Date.now();
    for (const [key, record] of this.attempts.entries()) {
      if (now - record.windowStart > 3600000) { // 1 hour cleanup
        this.attempts.delete(key);
      }
    }
  }
}

const rateLimiter = new RateLimiter();

// Cleanup rate limiter every hour
setInterval(() => rateLimiter.cleanup(), 3600000);

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes - prefix all routes with /api
  
  // Send verification code to email
  app.post("/api/auth/send-code", async (req, res) => {
    try {
      const { email } = sendCodeSchema.parse(req.body);
      
      // Rate limiting: 3 requests per email per 10 minutes
      const emailKey = `send-code:${email}`;
      const ipKey = `send-code-ip:${req.ip}`;
      
      if (rateLimiter.isRateLimited(emailKey, 3, 10 * 60 * 1000)) {
        return res.status(429).json({ error: "Too many verification requests. Please wait before requesting a new code." });
      }
      
      if (rateLimiter.isRateLimited(ipKey, 10, 10 * 60 * 1000)) {
        return res.status(429).json({ error: "Too many requests from this IP. Please wait." });
      }
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: "Email already registered" });
      }
      
      // Delete any existing verification for this email
      await storage.deleteEmailVerification(email);
      
      // Create new verification
      await storage.createEmailVerification({ email });
      
      res.json({ message: "Verification code sent to email" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Send code error:", error);
      res.status(500).json({ error: "Failed to send verification code" });
    }
  });

  // Verify email code
  app.post("/api/auth/verify-code", async (req, res) => {
    try {
      const { email, code } = verifyCodeSchema.parse(req.body);
      
      // Rate limiting: 5 verification attempts per email per 10 minutes
      const emailKey = `verify-code:${email}`;
      const ipKey = `verify-code-ip:${req.ip}`;
      
      if (rateLimiter.isRateLimited(emailKey, 5, 10 * 60 * 1000)) {
        return res.status(429).json({ error: "Too many verification attempts. Please wait before trying again." });
      }
      
      if (rateLimiter.isRateLimited(ipKey, 15, 10 * 60 * 1000)) {
        return res.status(429).json({ error: "Too many requests from this IP. Please wait." });
      }
      
      const verification = await storage.getEmailVerification(email);
      if (!verification) {
        return res.status(400).json({ error: "No verification found for this email" });
      }
      
      // Check expiration
      if (new Date() > verification.expiresAt) {
        await storage.deleteEmailVerification(email);
        return res.status(400).json({ error: "Verification code expired" });
      }
      
      // Check attempts (max 3)
      if (verification.attempts >= 3) {
        await storage.deleteEmailVerification(email);
        return res.status(400).json({ error: "Too many failed attempts" });
      }
      
      // Verify code (in production, this should be a hashed comparison)
      if (verification.codeHash !== code) {
        await storage.updateEmailVerificationAttempts(email, verification.attempts + 1);
        return res.status(400).json({ error: "Invalid verification code" });
      }
      
      // Mark email as verified
      await storage.markEmailVerified(email);
      
      res.json({ message: "Email verified successfully" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Verify code error:", error);
      res.status(500).json({ error: "Failed to verify code" });
    }
  });

  // Complete user registration
  app.post("/api/auth/sign-up", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Verify that email was verified
      const verification = await storage.getEmailVerification(userData.email);
      if (!verification || !verification.verified) {
        return res.status(400).json({ error: "Email verification required" });
      }
      
      // Check if user already exists
      const [existingEmailUser, existingUsernameUser] = await Promise.all([
        storage.getUserByEmail(userData.email),
        storage.getUserByUsername(userData.username)
      ]);
      
      if (existingEmailUser) {
        return res.status(400).json({ error: "Email already registered" });
      }
      
      if (existingUsernameUser) {
        return res.status(400).json({ error: "Username already taken" });
      }
      
      // Create user
      const user = await storage.createUser(userData);
      
      // Clean up verification
      await storage.deleteEmailVerification(userData.email);
      
      // Return user without password hash
      const { passwordHash, ...userResponse } = user;
      res.json({ user: userResponse, message: "Account created successfully" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Sign up error:", error);
      res.status(500).json({ error: "Failed to create account" });
    }
  });

  // Sign in user
  app.post("/api/auth/sign-in", async (req, res) => {
    try {
      const { email, password } = signInSchema.parse(req.body);
      
      // Rate limiting: 5 sign-in attempts per email per 15 minutes
      const emailKey = `sign-in:${email}`;
      const ipKey = `sign-in-ip:${req.ip}`;
      
      if (rateLimiter.isRateLimited(emailKey, 5, 15 * 60 * 1000)) {
        return res.status(429).json({ error: "Too many sign-in attempts. Please wait before trying again." });
      }
      
      if (rateLimiter.isRateLimited(ipKey, 20, 15 * 60 * 1000)) {
        return res.status(429).json({ error: "Too many requests from this IP. Please wait." });
      }
      
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(400).json({ error: "Invalid email or password" });
      }
      
      // Verify password using proper hashing
      const isValidPassword = await storage.verifyPassword(password, user.passwordHash);
      if (!isValidPassword) {
        return res.status(400).json({ error: "Invalid email or password" });
      }
      
      // Return user without password hash
      const { passwordHash, ...userResponse } = user;
      res.json({ user: userResponse, message: "Signed in successfully" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Sign in error:", error);
      res.status(500).json({ error: "Failed to sign in" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
