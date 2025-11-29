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
    - **Support Center**: Fully integrated support ticket system allowing users to submit help requests with subject, category (general, mining, account, payments, technical, billing, other), priority level (low, medium, high, urgent), and detailed message. The backend securely proxies requests to the external CoinMaining API with proper Zod validation, sanitized error handling, and secure logging. The API bearer token is stored as an environment variable (COINMAINING_API_TOKEN).

# External Dependencies

- **Database**: Neon PostgreSQL serverless database
- **UI Components**: Radix UI primitives
- **Styling**: Tailwind CSS
- **Fonts**: Google Fonts (Inter, Orbitron, DM Sans, Geist Mono)
- **Icons**: Lucide React
- **Charts**: Recharts
- **Wallet Integration**: Wagmi for interacting with EVM wallets (BSC network for MGC and RZ tokens)
- **Development Environment**: Replit
- **External APIs**: `https://api.coinmaining.game` for user authentication, profile data, mining plans, staking operations, and support ticket management.

# Recent Changes

## November 29, 2025
- **Restake Feature**: Implemented restake functionality allowing users to compound their earnings back into active miners
  - **Restake Button**: Green gradient "Restake" button placed between Boost and Stop buttons on each active miner card (both mobile and desktop layouts)
  - **Backend Endpoint** (POST /api/restake/initiate): Proxies to CoinMaining API to initiate restake, returns signature-based transaction data
  - **Transaction Flow**: Uses wagmi's useWriteContract hook to call the claim function with the restake signature (same pattern as withdrawal)
  - **Restake Processing Dialog**: Beautiful step-by-step progress dialog showing:
    - Getting restake signature
    - Wallet confirmation
    - Blockchain confirmation
  - **Cache Invalidation**: Invalidates miners and user queries after successful restake
  - **Error Handling**: Toast notifications for transaction rejections, failures, and API errors
- **Withdrawal Modal Improvement**: Fixed amount input styling with cleaner layout
  - Input and MAX button now in side-by-side flex layout
  - MAX button styled as a purple pill-shaped badge
  - Improved focus states with border color change
  - Hidden number spinners for cleaner appearance

## November 26, 2025
- **Energy Turbos Redesign - Integrated Boost System**: Redesigned turbo boosts for a minimal, integrated user experience
  - **Boost Button**: Orange gradient "Boost" button appears next to each miner's Stop button (only visible when user has available turbos)
  - **Active Turbo Indicator**: Shows when a miner has an active boost with animated rocket icon and remaining time display
  - **Beautiful Turbo Selection Dialog**: Opens when clicking Boost button featuring:
    - Gradient cards with turbo images, names, and expiry times
    - Hover effects with glow animations
    - Loading state during activation
    - Empty state when no turbos available
  - **Backend Endpoint** (POST /api/events/rewards/:id/activate): Activates a turbo reward for a specific miner
  - **Cache Invalidation**: Properly invalidates both rewards and miners queries after activation
  - **Responsive Design**: Both mobile and desktop layouts include the Boost button with consistent styling

## November 25, 2025
- **Events & Challenges Page (Giveaways)**: Fully integrated events/tasks system with cyberpunk-themed UI
  - **Backend Endpoint** (GET /api/events/tasks): Proxies requests to CoinMaining API with JWT authentication
  - **Task Cards**: Display task title, description, kind (weekly/daily/monthly), reward type, and condition
  - **Visual Design**: Gradient cards with hover effects, icon-based reward indicators, badge-styled task types
  - **Loading States**: Skeleton loaders while fetching data
  - **Error Handling**: User-friendly error cards with retry guidance
  - **Empty State**: Encouraging message when no active challenges exist
  - **Info Section**: "How It Works" explanation for users
  - **Auto-refresh**: Data refreshes every 30 seconds

- **Token Address Updates**: Updated MGC and RZ token addresses
  - MGC Token: `0xa5b2324c9d9EBa3Bf7A392bEf64F56cC3061D1a8` (8 decimals)
  - RZ Token: `0x1B1052b305a30a9F4d77B53e0d09772a920c5A23`

- **Ticket Detail Page with Reply and Close Functionality**: Enhanced support system with dedicated ticket detail pages
  - **Ticket Detail Page** (/app/support/ticket/:id): Full-page view for individual tickets with complete conversation history, reply form, and close button
  - **Reply Functionality** (POST /api/support/tickets/:id/reply): Users can send replies directly from the ticket detail page
  - **Close Ticket Functionality** (POST /api/support/tickets/:id/close): Users can close tickets directly from the detail page with confirmation toast
  - **Navigation**: Simplified ticket list - clicking a ticket navigates to its detail page instead of expanding in-place
  - **Reply Form**: Textarea with Zod validation, optimistic updates, and toast notifications for success/error states
  - **Close Button**: Red-themed button only visible for open tickets, with loading state and disabled state during submission
  - **Back Navigation**: Easy return to ticket list with back button and breadcrumb navigation
  - **Auto-scroll**: Messages container auto-scrolls to latest message for better UX
  - **Refetch Interval**: Ticket detail auto-refreshes every 30 seconds to show new staff responses

## November 24, 2025
- **Support Center Integration**: Complete support ticket management system with modern cyberpunk UI
  - **Ticket Submission** (POST /api/support/tickets): Form with validation for subject, category, priority, and message
  - **Ticket List Display** (GET /api/support/tickets): Table-based layout with click-to-navigate rows
    - **Desktop View**: Clean table with columns (ID, Subject, Status, Priority, Category, Created Date), ChevronRight indicator for navigation
    - **Mobile View**: Card-based layout optimized for touch interactions
  - **Modern UI Design**: Glassmorphism cards with gradient backgrounds, neon-themed status/priority badges with animated icons, timeline view for messages with avatar chips and connecting lines
  - **Micro-interactions**: Smooth hover effects, animated tab transitions, loading states with gradient spinners
  - **Responsive Design**: Responsive grid layout (grid-cols-1 md:grid-cols-3) prevents overflow, single-column stacking on mobile, improved spacing and padding, enhanced readability with larger text and better hierarchy
  - Implemented secure API token management via environment variables (COINMAINING_API_TOKEN)
  - Added sanitized error handling with both toast notifications and inline error cards displaying server-provided error details
  - Complete data-testid attribute coverage for automated testing (row-ticket-*, card-ticket-mobile-*, etc.)
  - All code reviewed by architect and confirmed production-ready with design system compliance