# Overview

This project is a futuristic cryptocurrency mining platform named "Ranking" that facilitates mining for MGC (purple-themed) and RZ (green-themed) tokens. It features a cyberpunk aesthetic with neon colors and glowing effects. The platform provides mining plan selection, live statistics, token performance charts, a referral system, and comprehensive company information. It aims for a modern fintech look, similar to Binance or Coinbase, combined with gaming and cyberpunk visual elements.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The frontend is built with React and TypeScript, using Vite. It employs a component-based architecture with Radix UI components and shadcn/ui for styling via Tailwind CSS. TanStack Query manages server state, and Wouter handles client-side routing. The design system uses a custom color palette with neon purple, green, and orange themes, custom fonts (Inter, Orbitron), and CSS-based glow effects to achieve a futuristic, cyberpunk aesthetic.

## Backend Architecture
The backend uses Express.js with TypeScript in an ESM setup. It includes middleware for JSON parsing and logging, with an abstracted storage layer (currently in-memory, `MemStorage`) designed for future database integration. Vite is integrated for development with hot module replacement.

## Data Storage Solutions
The application utilizes Drizzle ORM with a PostgreSQL database, specifically Neon serverless. Drizzle Kit is used for database schema management and migrations. The current schema supports basic user management, with plans for expansion to mining plans, transactions, and user investments.

## System Design Choices
- **UI/UX**: Dark themes with neon accent colors, custom fonts, and CSS-based glow effects create a cyberpunk mining platform aesthetic.
- **Authentication**: Implemented JWT token-based authentication with secure storage in localStorage. Wallet authentication is integrated via an external API for nonce generation, signup, and login, using `wagmi` for real-time token balances.
- **API Integration**: All external API calls are proxied through the backend to handle CORS and ensure HTTPS.
- **Feature Specifications**:
    - **Mining Plans**: Unified grid view for all 10 MGC and RZ mining plans, with visual tiering (Elite, Premium, Standard) and hover effects.
    - **Miner Management**: Functionality to deploy and stop active miners, with real-time updates and success/error notifications.
    - **Earnings Management**: Dedicated earnings page with per-token withdrawal functionality, displaying total accrued, withdrawn, and pending balances. Auto-refreshes every 5 seconds.
    - **User Profile**: Displays real user data (username, email, avatar, active miners, referrals, bonus rate) fetched from an external profile API. Includes profile editing and avatar selection.
    - **Route Protection**: All authenticated routes (`/app/*`) are protected by a `ProtectedRoute` wrapper, redirecting unauthenticated users to the sign-in page.
    - **Navigation**: Optimized navigation structure with consistent ordering across desktop and mobile, dynamic updates based on authentication state, and dedicated sections for Dashboard, Miners, Profile, Referrals, and Support.

# External Dependencies

- **Database**: Neon PostgreSQL serverless database
- **UI Components**: Radix UI primitives
- **Styling**: Tailwind CSS
- **Fonts**: Google Fonts (Inter, Orbitron, DM Sans, Geist Mono)
- **Icons**: Lucide React
- **Charts**: Recharts
- **Wallet Integration**: Wagmi for interacting with EVM wallets (BSC network for MGC and RZ tokens)
- **Development Environment**: Replit
- **External APIs**: `https://api.coinmaining.game` for user authentication, profile data, mining plans, and staking operations.