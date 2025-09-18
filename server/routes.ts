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

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes - prefix all routes with /api
  
  // Send verification code to email
  app.post("/api/auth/send-code", async (req, res) => {
    try {
      const { email } = sendCodeSchema.parse(req.body);
      
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
      if (!verification) {
        return res.status(400).json({ error: "Email not verified" });
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
      
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(400).json({ error: "Invalid email or password" });
      }
      
      // Verify password (in production, use proper hashing comparison)
      if (user.passwordHash !== password) {
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
