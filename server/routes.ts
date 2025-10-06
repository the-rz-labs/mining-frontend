import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  sendCodeSchema, 
  verifyCodeSchema, 
  insertUserSchema, 
  signInSchema,
  updateProfileSchema,
  connectWalletSchema,
  connectRankSchema
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
    const entries = Array.from(this.attempts.entries());
    for (const [key, record] of entries) {
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

  // Profile management routes
  
  // Get current user profile
  app.get("/api/me", async (req, res) => {
    try {
      // For now, return a mock user. In production, get from session/JWT
      const userId = req.headers['x-user-id'] as string;
      if (!userId) {
        return res.status(401).json({ error: "Authentication required" });
      }
      
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      const { passwordHash, ...userResponse } = user;
      res.json(userResponse);
    } catch (error) {
      console.error("Get profile error:", error);
      res.status(500).json({ error: "Failed to get profile" });
    }
  });
  
  // Update user profile
  app.patch("/api/profile", async (req, res) => {
    try {
      const updates = updateProfileSchema.parse(req.body);
      const userId = req.headers['x-user-id'] as string;
      
      if (!userId) {
        return res.status(401).json({ error: "Authentication required" });
      }
      
      const updatedUser = await storage.updateUserProfile(userId, updates);
      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }
      
      const { passwordHash, ...userResponse } = updatedUser;
      res.json({ user: userResponse, message: "Profile updated successfully" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Update profile error:", error);
      res.status(500).json({ error: "Failed to update profile" });
    }
  });
  
  // Connect wallet
  app.post("/api/wallet/connect", async (req, res) => {
    try {
      const { address } = connectWalletSchema.parse(req.body);
      const userId = req.headers['x-user-id'] as string;
      
      if (!userId) {
        return res.status(401).json({ error: "Authentication required" });
      }
      
      const updatedUser = await storage.connectWallet(userId, address);
      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }
      
      const { passwordHash, ...userResponse } = updatedUser;
      res.json({ user: userResponse, message: "Wallet connected successfully" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Connect wallet error:", error);
      res.status(500).json({ error: "Failed to connect wallet" });
    }
  });
  
  // Disconnect wallet
  app.delete("/api/wallet", async (req, res) => {
    try {
      const userId = req.headers['x-user-id'] as string;
      
      if (!userId) {
        return res.status(401).json({ error: "Authentication required" });
      }
      
      const updatedUser = await storage.disconnectWallet(userId);
      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }
      
      const { passwordHash, ...userResponse } = updatedUser;
      res.json({ user: userResponse, message: "Wallet disconnected successfully" });
    } catch (error) {
      console.error("Disconnect wallet error:", error);
      res.status(500).json({ error: "Failed to disconnect wallet" });
    }
  });
  
  // Connect rank account
  app.post("/api/rank/connect", async (req, res) => {
    try {
      const { rankId } = connectRankSchema.parse(req.body);
      const userId = req.headers['x-user-id'] as string;
      
      if (!userId) {
        return res.status(401).json({ error: "Authentication required" });
      }
      
      const updatedUser = await storage.connectRank(userId, rankId);
      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }
      
      const { passwordHash, ...userResponse } = updatedUser;
      res.json({ user: userResponse, message: "Rank account connected successfully" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Connect rank error:", error);
      res.status(500).json({ error: "Failed to connect rank account" });
    }
  });
  
  // Disconnect rank account
  app.delete("/api/rank", async (req, res) => {
    try {
      const userId = req.headers['x-user-id'] as string;
      
      if (!userId) {
        return res.status(401).json({ error: "Authentication required" });
      }
      
      const updatedUser = await storage.disconnectRank(userId);
      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }
      
      const { passwordHash, ...userResponse } = updatedUser;
      res.json({ user: userResponse, message: "Rank account disconnected successfully" });
    } catch (error) {
      console.error("Disconnect rank error:", error);
      res.status(500).json({ error: "Failed to disconnect rank account" });
    }
  });
  
  // Get user badges
  app.get("/api/badges", async (req, res) => {
    try {
      const userId = req.headers['x-user-id'] as string;
      
      if (!userId) {
        return res.status(401).json({ error: "Authentication required" });
      }
      
      const badges = await storage.getUserBadges(userId);
      res.json(badges);
    } catch (error) {
      console.error("Get badges error:", error);
      res.status(500).json({ error: "Failed to get badges" });
    }
  });
  
  // Recompute badges (admin/development)
  app.post("/api/badges/recompute", async (req, res) => {
    try {
      const userId = req.headers['x-user-id'] as string;
      
      if (!userId) {
        return res.status(401).json({ error: "Authentication required" });
      }
      
      const badges = await storage.recomputeBadges(userId);
      res.json({ badges, message: "Badges recomputed successfully" });
    } catch (error) {
      console.error("Recompute badges error:", error);
      res.status(500).json({ error: "Failed to recompute badges" });
    }
  });
  
  // Mining management routes
  
  // Start mining
  app.post("/api/mining/start", async (req, res) => {
    try {
      const userId = req.headers['x-user-id'] as string;
      
      if (!userId) {
        return res.status(401).json({ error: "Authentication required" });
      }
      
      const updatedUser = await storage.startMining(userId);
      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }
      
      const { passwordHash, ...userResponse } = updatedUser;
      res.json({ user: userResponse, message: "Mining started successfully" });
    } catch (error) {
      console.error("Start mining error:", error);
      res.status(500).json({ error: "Failed to start mining" });
    }
  });
  
  // Stop mining
  app.post("/api/mining/stop", async (req, res) => {
    try {
      const userId = req.headers['x-user-id'] as string;
      
      if (!userId) {
        return res.status(401).json({ error: "Authentication required" });
      }
      
      const updatedUser = await storage.stopMining(userId);
      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }
      
      const { passwordHash, ...userResponse } = updatedUser;
      res.json({ user: userResponse, message: "Mining stopped successfully" });
    } catch (error) {
      console.error("Stop mining error:", error);
      res.status(500).json({ error: "Failed to stop mining" });
    }
  });

  // Wallet Authentication Proxy Routes
  
  // Get nonce for wallet authentication
  app.post("/api/wallets/nonce", async (req, res) => {
    try {
      const { address } = req.body;
      
      if (!address) {
        return res.status(400).json({ error: "Wallet address is required" });
      }

      const response = await fetch('https://api.coinmaining.game/api/wallets/wallet/metamask/nonce/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Nonce API error:", response.status, errorText);
        throw new Error('Failed to fetch nonce from API');
      }
      
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("Wallet nonce proxy error:", error);
      res.status(500).json({ error: "Failed to fetch nonce for wallet authentication" });
    }
  });

  // Wallet signup
  app.post("/api/auth/wallet-signup", async (req, res) => {
    try {
      const { address, signature, nonce_id, email, username, avatar_key, invite } = req.body;
      
      if (!address || !signature || !nonce_id || !email || !username || !avatar_key) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const response = await fetch('https://api.coinmaining.game/api/users/auth/wallet_signup/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address,
          signature,
          nonce_id,
          email,
          username,
          avatar_key,
          invite
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        console.error("Wallet signup API error:", response.status, data);
        return res.status(response.status).json(data);
      }
      
      res.status(response.status).json(data);
    } catch (error) {
      console.error("Wallet signup proxy error:", error);
      res.status(500).json({ error: "Failed to complete wallet signup" });
    }
  });

  // Wallet login
  app.post("/api/auth/wallet-login", async (req, res) => {
    try {
      const { address, signature, nonce_id } = req.body;
      
      if (!address || !signature || !nonce_id) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const response = await fetch('https://api.coinmaining.game/api/users/auth/wallet_login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address,
          signature,
          nonce_id
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        console.error("Wallet login API error:", response.status, data);
        return res.status(response.status).json(data);
      }
      
      res.status(response.status).json(data);
    } catch (error) {
      console.error("Wallet login proxy error:", error);
      res.status(500).json({ error: "Failed to complete wallet login" });
    }
  });

  // Proxy route for mining plans API to avoid CORS
  app.get("/api/plans", async (req, res) => {
    try {
      const response = await fetch('https://api.coinmaining.game/api/plans/plans/');
      if (!response.ok) {
        throw new Error('Failed to fetch mining plans from external API');
      }
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("Mining plans proxy error:", error);
      res.status(500).json({ error: "Failed to fetch mining plans" });
    }
  });

  // Proxy route for individual plan details
  app.get("/api/plans/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const authHeader = req.headers.authorization;
      
      const headers: HeadersInit = {
        'accept': 'application/json'
      };
      
      if (authHeader) {
        headers['Authorization'] = authHeader;
      }
      
      const response = await fetch(`https://api.coinmaining.game/api/plans/plans/${id}/`, {
        headers
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch plan details from external API');
      }
      
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("Plan details proxy error:", error);
      res.status(500).json({ error: "Failed to fetch plan details" });
    }
  });

  // Proxy route for user referral data
  app.get("/api/users/referral/my", async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      
      if (!authHeader) {
        return res.status(401).json({ error: "Authorization header required" });
      }

      const response = await fetch('https://api.coinmaining.game/api/users/referral/my', {
        method: 'GET',
        headers: { 
          'Accept': 'application/json',
          'Authorization': authHeader,
          'X-CSRFTOKEN': 'ZHzxmia67LOHNAksl1BAlZcOl6qi0mNW'
        }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Referral API error:", response.status, errorText);
        return res.status(response.status).json({ error: "Failed to fetch referral data" });
      }

      const data = await response.json();
      return res.json(data);
    } catch (error) {
      console.error("Referral API error:", error);
      return res.status(500).json({ error: "Failed to fetch referral data" });
    }
  });

  // Proxy route for referral list
  app.get("/api/users/referral/list", async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      
      if (!authHeader) {
        return res.status(401).json({ error: "Authorization header required" });
      }

      const response = await fetch('https://api.coinmaining.game/api/users/referral/list/', {
        method: 'GET',
        headers: { 
          'Accept': 'application/json',
          'Authorization': authHeader,
          'X-CSRFTOKEN': 'ZHzxmia67LOHNAksl1BAlZcOl6qi0mNW'
        }
      });
      
      const contentType = response.headers.get('content-type');
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Referral list API error:", response.status, errorText.substring(0, 200));
        return res.status(response.status).json({ error: "Failed to fetch referral list" });
      }

      // Check if response is JSON
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        console.log("Referral list response:", JSON.stringify(data));
        return res.json(data);
      } else {
        const text = await response.text();
        console.error("Referral list returned non-JSON:", contentType, text.substring(0, 200));
        return res.status(500).json({ error: "API returned invalid response format" });
      }
    } catch (error) {
      console.error("Referral list API error:", error);
      return res.status(500).json({ error: "Failed to fetch referral list" });
    }
  });

  // Proxy route for user profile data
  app.get("/api/users/me", async (req, res) => {
    try {
      // Get the Authorization header from the request
      const authHeader = req.headers.authorization;
      
      if (!authHeader) {
        return res.status(401).json({ error: "Authorization header required" });
      }

      const response = await fetch('https://api.coinmaining.game/api/users/me/', {
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': authHeader
        }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("User profile API error:", response.status, errorText);
        
        if (response.status === 401) {
          return res.status(401).json({ error: "Unauthorized" });
        }
        
        throw new Error('Failed to fetch user profile from external API');
      }
      
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("User profile proxy error:", error);
      res.status(500).json({ error: "Failed to fetch user profile" });
    }
  });

  // Proxy route for user miners/stakes data
  app.get("/api/stakes/miners", async (req, res) => {
    try {
      // Get the Authorization header from the request
      const authHeader = req.headers.authorization;
      
      if (!authHeader) {
        return res.status(401).json({ error: "Authorization header required" });
      }

      const response = await fetch('https://api.coinmaining.game/api/stakes/staked-miner-dashboard-get/', {
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': authHeader
        }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Miners API error:", response.status, errorText);
        
        if (response.status === 401) {
          return res.status(401).json({ error: "Unauthorized" });
        }
        
        // 404 means no miners found - return empty array instead of error
        if (response.status === 404) {
          return res.json([]);
        }
        
        throw new Error('Failed to fetch miners from external API');
      }
      
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("Miners proxy error:", error);
      res.status(500).json({ error: "Failed to fetch miners" });
    }
  });

  // Proxy route for available miners list
  app.get("/api/miners", async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).json({ error: "Authorization header required" });
      }

      const response = await fetch('https://api.coinmaining.game/api/miners/miners/', {
        method: 'GET',
        headers: { 
          'accept': 'application/json',
          'X-CSRFTOKEN': 'ZHzxmia67LOHNAksl1BAlZcOl6qi0mNW',
          'Authorization': authHeader
        }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Available miners API error:", response.status, errorText);
        throw new Error('Failed to fetch available miners');
      }
      
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("Available miners proxy error:", error);
      res.status(500).json({ error: "Failed to fetch available miners" });
    }
  });

  // Proxy route for deploying/staking a miner
  app.post("/api/stakes/stake", async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      
      if (!authHeader) {
        return res.status(401).json({ error: "Authorization header required" });
      }

      const { miner, amount, token } = req.body;

      if (!miner || !amount || !token) {
        return res.status(400).json({ error: "Missing required fields: miner, amount, token" });
      }

      const response = await fetch('https://api.coinmaining.game/api/stakes/stake/', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': authHeader,
          'X-CSRFTOKEN': 'ZHzxmia67LOHNAksl1BAlZcOl6qi0mNW'
        },
        body: JSON.stringify({
          miner,
          amount,
          token
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        console.error("Stake miner API error:", response.status, data);
        return res.status(response.status).json(data);
      }
      
      res.status(response.status).json(data);
    } catch (error) {
      console.error("Stake miner proxy error:", error);
      res.status(500).json({ error: "Failed to deploy miner" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
