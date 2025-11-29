import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  referralCode: varchar("referral_code", { length: 8 }).notNull().unique(),
  referredByUserId: varchar("referred_by_user_id"),
  walletAddress: text("wallet_address"),
  rankAccountId: text("rank_account_id"),
  referralCount: integer("referral_count").default(0).notNull(),
  miningStartedAt: timestamp("mining_started_at"),
});

export const badgeTypeEnum = pgEnum("badge_type", [
  "referrals_5",
  "referrals_10", 
  "referrals_25",
  "referrals_50",
  "mining_week_1",
  "mining_month_1",
  "mining_year_1"
]);

export const emailVerifications = pgTable("email_verifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull(),
  codeHash: text("code_hash").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  attempts: integer("attempts").default(0).notNull(),
  verified: boolean("verified").default(false).notNull(),
});

export const userBadges = pgTable("user_badges", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  type: badgeTypeEnum("type").notNull(),
  awardedAt: timestamp("awarded_at").default(sql`now()`).notNull(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  passwordHash: true,
  referralCode: true,
}).extend({
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
  email: z.string().email("Invalid email address"),
  referredByUserId: z.string().optional(), // This will contain the referrer's referralCode, not userId
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const insertEmailVerificationSchema = createInsertSchema(emailVerifications).omit({
  id: true,
  codeHash: true,
  expiresAt: true,
  attempts: true,
  verified: true,
});

export const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const sendCodeSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const verifyCodeSchema = z.object({
  email: z.string().email("Invalid email address"),
  code: z.string().length(5, "Code must be 5 digits"),
});

export const insertUserBadgeSchema = createInsertSchema(userBadges).omit({
  id: true,
  awardedAt: true,
});

export const updateProfileSchema = z.object({
  username: z.string().min(1, "Username is required").optional(),
});

export const walletAddressSchema = z.object({
  address: z.string().regex(/^0x[a-fA-F0-9]{40}$/, "Invalid Ethereum address format"),
});

export const connectWalletSchema = walletAddressSchema;

export const connectRankSchema = z.object({
  rankId: z.string().min(1, "Rank account ID is required"),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type UserBadge = typeof userBadges.$inferSelect;
export type InsertUserBadge = z.infer<typeof insertUserBadgeSchema>;
export type EmailVerification = typeof emailVerifications.$inferSelect;
export type InsertEmailVerification = z.infer<typeof insertEmailVerificationSchema>;
export type SignInRequest = z.infer<typeof signInSchema>;
export type SendCodeRequest = z.infer<typeof sendCodeSchema>;
export type VerifyCodeRequest = z.infer<typeof verifyCodeSchema>;
export type UpdateProfileRequest = z.infer<typeof updateProfileSchema>;
export type ConnectWalletRequest = z.infer<typeof connectWalletSchema>;
export type WalletAddressRequest = z.infer<typeof walletAddressSchema>;
export type ConnectRankRequest = z.infer<typeof connectRankSchema>;

export const supportTicketSchema = z.object({
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  category: z.enum(["general", "mining", "account", "payments", "technical", "billing", "other"]),
  priority: z.enum(["low", "medium", "high", "urgent"]),
  message: z.string().min(10, "Message must be at least 10 characters")
});

export type SupportTicketRequest = z.infer<typeof supportTicketSchema>;

export type TicketMessage = {
  id: number;
  author: number;
  author_name: string;
  from_staff: boolean;
  body: string;
  created_at: string;
};

export type SupportTicket = {
  id: number;
  subject: string;
  category: "general" | "mining" | "account" | "payments" | "technical" | "billing" | "other";
  priority: "low" | "medium" | "high" | "urgent";
  status: "open" | "in_progress" | "resolved" | "closed";
  created_at: string;
  updated_at: string;
  messages: TicketMessage[];
};

export type TicketListResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: SupportTicket[];
};

export const ticketReplySchema = z.object({
  message: z.string().min(1, "Message is required").max(5000, "Message is too long")
});

export type TicketReplyRequest = z.infer<typeof ticketReplySchema>;
