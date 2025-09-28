import { type User, type InsertUser, type EmailVerification, type InsertEmailVerification, type UserBadge, type InsertUserBadge, type UpdateProfileRequest, type ConnectWalletRequest, type ConnectRankRequest } from "@shared/schema";
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
  updateUserProfile(userId: string, updates: Partial<UpdateProfileRequest>): Promise<User | undefined>;
  connectWallet(userId: string, address: string): Promise<User | undefined>;
  disconnectWallet(userId: string): Promise<User | undefined>;
  connectRank(userId: string, rankId: string): Promise<User | undefined>;
  disconnectRank(userId: string): Promise<User | undefined>;
  startMining(userId: string): Promise<User | undefined>;
  stopMining(userId: string): Promise<User | undefined>;
  
  // Badge operations
  getUserBadges(userId: string): Promise<UserBadge[]>;
  awardBadge(userId: string, type: UserBadge['type']): Promise<UserBadge>;
  recomputeBadges(userId: string): Promise<UserBadge[]>;
  
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
  private userBadges: Map<string, UserBadge[]>;

  constructor() {
    this.users = new Map();
    this.emailVerifications = new Map();
    this.userBadges = new Map();
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
      referredByUserId,
      walletAddress: null,
      rankAccountId: null,
      referralCount: 0,
      miningStartedAt: null
    };
    
    this.users.set(id, user);
    
    // Increment referrer's referral count and recompute badges
    if (referredByUserId) {
      const referrer = this.users.get(referredByUserId);
      if (referrer) {
        referrer.referralCount++;
        this.users.set(referredByUserId, referrer);
        // Recompute badges for referrer
        await this.recomputeBadges(referredByUserId);
      }
    }
    
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

  // Profile operations
  async updateUserProfile(userId: string, updates: Partial<UpdateProfileRequest>): Promise<User | undefined> {
    const user = this.users.get(userId);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates };
    this.users.set(userId, updatedUser);
    return updatedUser;
  }

  async connectWallet(userId: string, address: string): Promise<User | undefined> {
    const user = this.users.get(userId);
    if (!user) return undefined;
    
    const updatedUser = { ...user, walletAddress: address };
    this.users.set(userId, updatedUser);
    return updatedUser;
  }

  async disconnectWallet(userId: string): Promise<User | undefined> {
    const user = this.users.get(userId);
    if (!user) return undefined;
    
    const updatedUser = { ...user, walletAddress: null };
    this.users.set(userId, updatedUser);
    return updatedUser;
  }

  async connectRank(userId: string, rankId: string): Promise<User | undefined> {
    const user = this.users.get(userId);
    if (!user) return undefined;
    
    const updatedUser = { ...user, rankAccountId: rankId };
    this.users.set(userId, updatedUser);
    return updatedUser;
  }

  async disconnectRank(userId: string): Promise<User | undefined> {
    const user = this.users.get(userId);
    if (!user) return undefined;
    
    const updatedUser = { ...user, rankAccountId: null };
    this.users.set(userId, updatedUser);
    return updatedUser;
  }

  // Badge operations
  async getUserBadges(userId: string): Promise<UserBadge[]> {
    return this.userBadges.get(userId) || [];
  }

  async awardBadge(userId: string, type: UserBadge['type']): Promise<UserBadge> {
    const id = randomUUID();
    const badge: UserBadge = {
      id,
      userId,
      type,
      awardedAt: new Date()
    };
    
    const userBadges = this.userBadges.get(userId) || [];
    // Check if user already has this badge type
    if (!userBadges.some(b => b.type === type)) {
      userBadges.push(badge);
      this.userBadges.set(userId, userBadges);
    }
    
    return badge;
  }

  async startMining(userId: string): Promise<User | undefined> {
    const user = this.users.get(userId);
    if (!user) return undefined;
    
    if (!user.miningStartedAt) {
      const updatedUser = { ...user, miningStartedAt: new Date() };
      this.users.set(userId, updatedUser);
      // Recompute badges after starting mining
      await this.recomputeBadges(userId);
      return updatedUser;
    }
    
    return user;
  }
  
  async stopMining(userId: string): Promise<User | undefined> {
    const user = this.users.get(userId);
    if (!user) return undefined;
    
    const updatedUser = { ...user, miningStartedAt: null };
    this.users.set(userId, updatedUser);
    return updatedUser;
  }

  async recomputeBadges(userId: string): Promise<UserBadge[]> {
    const user = this.users.get(userId);
    if (!user) return [];
    
    const currentBadges = this.userBadges.get(userId) || [];
    const badgeTypes = new Set(currentBadges.map(b => b.type));
    
    // Check referral badges
    if (user.referralCount >= 5 && !badgeTypes.has('referrals_5')) {
      await this.awardBadge(userId, 'referrals_5');
    }
    if (user.referralCount >= 10 && !badgeTypes.has('referrals_10')) {
      await this.awardBadge(userId, 'referrals_10');
    }
    if (user.referralCount >= 25 && !badgeTypes.has('referrals_25')) {
      await this.awardBadge(userId, 'referrals_25');
    }
    if (user.referralCount >= 50 && !badgeTypes.has('referrals_50')) {
      await this.awardBadge(userId, 'referrals_50');
    }
    
    // Check mining duration badges
    if (user.miningStartedAt) {
      const now = new Date();
      const miningDays = Math.floor((now.getTime() - user.miningStartedAt.getTime()) / (1000 * 60 * 60 * 24));
      
      if (miningDays >= 7 && !badgeTypes.has('mining_week_1')) {
        await this.awardBadge(userId, 'mining_week_1');
      }
      if (miningDays >= 30 && !badgeTypes.has('mining_month_1')) {
        await this.awardBadge(userId, 'mining_month_1');
      }
      if (miningDays >= 365 && !badgeTypes.has('mining_year_1')) {
        await this.awardBadge(userId, 'mining_year_1');
      }
    }
    
    return this.getUserBadges(userId);
  }
}

export const storage = new MemStorage();
